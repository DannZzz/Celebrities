const { clan, clanFind, rpg, rpgFind, bagFind, serverFind, bag, addStar, promocodes, promoFind } = require("./models");
const { error, embed, firstUpperCase, randomRange, delay, pagination } = require("./functions");
const {none, main} = require("../JSON/colours.json");
const {AGREE, DISAGREE, STAR, HERO, CLAN, LEFT, RIGHT} = require("../config");
const {MessageAttachment, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageCollector, MessageButton} = require("discord.js");
const Subs = require("./subscriptionClass");

class TeamClass {
    constructor (msg) {
        this.msg = msg;
        this.user = msg.author;
        this.channel = msg.channel;
        this.server = msg.guild;
    }

    async addPromo(bot, code, uses, reward) {
        if (!code) return error(this.msg, "Укажите промокод.");
        if (!uses || isNaN(uses) || uses < 1) return error(this.msg, "Укажите кол-во испол.");
        if (!reward || isNaN(reward) || reward < 1) return error(this.msg, "Укажите награду.");
        
        const data = await promoFind(code);
        if (data) return error(this.msg, "Такой код уже существует.");

        let toGuild = bot.guilds.cache.get('731032795509686332');
        let toChannel = toGuild.channels.cache.get('898838552929009704');
    
        const emb = new MessageEmbed()
        .setAuthor(`${this.user.tag} (${this.user.id})`, this.user.displayAvatarURL({dynamic: true}))
        .setColor(main)
        .setTimestamp()

        const creating = await promocodes.create({
            code,
            max: uses,
            reward
        });
        creating.save().then(() => {
            toChannel.send({embeds: [emb.setDescription(`Promocode: \`${code}\`\nMax Uses: \`${uses}\`\nНаграда: \`${reward}\` ${STAR}`)]})
            this.msg.react(AGREE)
        }).catch(() => this.msg.react(DISAGREE));

    }

    async addPremiumPromo() {

        const sd = await serverFind(this.server.id);
        const { timeOut } = require(`../languages/${sd.lang || "ru"}`);
        
    

        const filter = m => m.author.id === this.user.id;
        
        const cl1 = await this.channel.createMessageCollector({
            filter,
            time: 15000
        });

        const m1 = await embed(this.msg, `Укажите код.`, false)
        let b1 = false;

        const newData = {};
        
        cl1.on("collect", async msg => {
            b1 = true;
            m1.delete();
            cl1.stop();
            const data = await promoFind(msg.content);
            if (data) {
                error(this.msg, "Такой код уже существует.")
                return await this.addPremiumPromo()
            }
            newData.code = msg.content;

            const cl2 = await this.channel.createMessageCollector({
                filter,
                time: 15000
            });
    
            const m2 = await embed(this.msg, `Укажите кол-во использований.`, false)
            let b2 = false;

            cl2.on("collect", async msg => {
                if (!isNaN(msg.content) && msg.content > 0) {
                    b2 = true;
                    m2.delete();
                    cl2.stop();
                    newData.uses = Math.round(msg.content);
        
                    const cl3 = await this.channel.createMessageCollector({
                        filter,
                        time: 15000
                    });
            
                    const m3 = await embed(this.msg, `Укажите награду. кол-во голды`, false)
                    let b3 = false;

                    cl3.on("collect", async msg => {
                        if (!isNaN(msg.content) && msg.content > 0) {
                            b3 = true;
                            m3.delete();
                            cl3.stop();
                            newData.reward = Math.round(msg.content);
                
                            const cl4 = await this.channel.createMessageCollector({
                                filter,
                                time: 15000
                            });
                    
                            const m4 = await embed(this.msg, `Укажите уровень подписки!`, false)
                            let b4 = false;

                            cl4.on("collect", async msg => {
                                if (!isNaN(msg.content) && msg.content >= 0 && msg.content < 4) {
                                    b4 = true;
                                    m4.delete();
                                    cl4.stop();
                                    newData.subLevel = Math.round(msg.content);

                                    const creating = await promocodes.create({
                                        code: newData.code,
                                        max: newData.uses,
                                        reward: newData.reward,
                                        subLevel: newData.subLevel
                                    });
                                    creating.save().then(() => embed(this.msg, `Промокод успешно создан!`)).catch(() => error(this.msg, "Ошибка при сохранении!"));
                        
                                    
                                };     
                            });
                    
                            cl4.on("end", () => {
                                if (!b4) {
                                    m4.edit(timeOut);
                                };
                            });
                        };     
                    });
            
                    cl3.on("end", () => {
                        if (!b3) {
                            m3.edit(timeOut);
                        };
                    });
                };     
            });
    
            cl2.on("end", () => {
                if (!b2) {
                    m2.edit(timeOut);
                };
            });
            
        });

        cl1.on("end", () => {
            if (!b1) {
                m1.edit(timeOut);
            };
        });
        
    };

    async usePromo(code, bot) {
        const sd = await serverFind(this.server.id);
        const {promoClass: pc} = require(`../languages/${sd.lang || "ru"}`);

        const data = await promoFind(code);
        if (!data) return error(this.msg, pc.noPromo);

        if (data.subLevel) {
            const string = await Subs(bot, this.msg, "Tyrus").getStringById(data.subLevel);
            const myLevel = Subs(bot, this.msg, "Tyrus").getSubId()
            if (myLevel < data.subLevel) {
                return error(this.msg, `${pc.subReq} ${string}`);
            }
        };

        const maxUsers = data.max; // number
        const usersArray = data.users; // array
        if (maxUsers <= usersArray.length) return error(this.msg, pc.noAvailable);
        if (usersArray.includes(this.user.id)) return error(this.msg, pc.already);

        data.users.push(this.user.id);
        await data.save()
        await addStar(this.user.id, data.reward);
        return embed(this.msg, `${pc.done} - ${data.reward} ${STAR}`)
    }

    async getAllPromo() {
        const data = await promocodes.find().exec();
        const mapped = data.map( ({reward, code, max, users, subLevel=false}) => {
            return `Promo: \`${code}\` | Use: \`${users.length}/${max}\` | ${reward} ${STAR} | Subscription: \`${subLevel ? subLevel : 0}\``
        })

        if (mapped.length > 15) {
            let arr = [];
            let i = 0;
            
            pages();
            function pages () {
                let v = mapped.slice(i, i+15);
                arr.push(
                    new MessageEmbed()
                    .setColor(main)
                    .setDescription(v.join("\n\n"))
                );
                i += 15;
                if (i < mapped.length) {
                    pages();
                }

            };

            const button1 = new MessageButton()
            .setCustomId("left")
            .setEmoji(LEFT)
            .setStyle("SECONDARY")
            const button2 = new MessageButton()
            .setCustomId("right")
            .setEmoji(RIGHT)
            .setStyle("SECONDARY")
            
            await pagination(this.msg, arr, [button1, button2], 30000, [this.user.id]);
            
        } else {
            return embed(this.msg, mapped.join("\n\n"), false);
        }
    }

}

function teamFunc(msg) {
    return new TeamClass(msg);
}

module.exports = teamFunc;

