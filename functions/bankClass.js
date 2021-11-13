const { bank, bankFind, rpg, profile, profileFind, cardFind, bagFind, serverFind, card: cd, addStar, rpgFind, addPremiumStar, addCandy } = require("./models");
const { error, embed, firstUpperCase, randomRange, delay, sendToMail, pagination, getMember, getHeroData, makeTimestamp, formatNumber } = require("./functions");
const heroes = require("../JSON/heroes.json");
const cards = require("../JSON/cards.json");
const { none, main } = require("../JSON/colours.json");
const { AGREE, DISAGREE, STAR, LEFT, RIGHT, heroNames, LEAGUE, HELL, LOADING } = require("../config");
const { stripIndents } = require("common-tags");
const Rate = require("./rateClass");
const Subscription = require("./subscriptionClass");
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageCollector, MessageButton, MessageAttachment } = require("discord.js");


class bankClass {
    constructor(bot, msg, sd) {
        this.msg = msg;
        this.user = msg.author;
        this.id = msg.author.id;
        this.server = msg.guild;
        this.channel = msg.channel;
        this.bot = bot;
        this.sd = sd;
    };

    async checkDocument(id = false) {
        if (!id) id = this.id;

        const data = await bankFind(id);
        if (!data) {
            const newData = await bank.create({userID: id});
            await newData.save();

            const DATA = await bankFind(id);
            return DATA;
        } else return data; 
    }
    
    async createInterface (id = false) {
        if (!id) id = this.id;
        const data = await this.checkDocument(id);

        let cardString = (this.sd.lang && this.sd.lang === "en") ? `**To link a card, write** \`${this.sd.prefix || "a!"}bank card\`` : `**Чтобы привязать карту, напишите** \`${this.sd.prefix || "a!"}bank card\``;

        if (data.paymentMethod) {
            const card = await cd.findOne({code: data.paymentMethod});

            if (card && card.userID === id) {
                const cardData = cards[card.name];
                cardString = `${cardData.emoji} \`${card.code}\``;
            } else {
                await bank.updateOne({userID: id}, {$set: {paymentMethod: undefined}});
            }
        }
        const slots = await getSlots(this.bot, this.msg);

        const en = new MessageEmbed()
        .setColor(main)
        .setAuthor(this.user.tag, this.user.displayAvatarURL({dynamic: true}))
        .setTitle("AdaBank")
        .setThumbnail(this.bot.user.displayAvatarURL())
        .setDescription(`You data:\nYour slots: ${slots}\nYou card for payments: ${cardString}\nTotal invests: ${formatNumber(data.totalInvests) || 0} ${STAR}\nTotal amount of gold received: ${formatNumber(data.totalGotten) || 0} ${STAR}`);

        const ru = new MessageEmbed()
        .setColor(main)
        .setAuthor(this.user.tag, this.user.displayAvatarURL({dynamic: true}))
        .setTitle("АдаБанк")
        .setThumbnail(this.bot.user.displayAvatarURL())
        .setDescription(`Ваши данные:\nТвои слоты: ${slots}\nТвоя карта для выплат: ${cardString}\nОбщие вложения: ${formatNumber(data.totalInvests) || 0} ${STAR}\nОбщее количество полученного золота: ${formatNumber(data.totalGotten) || 0} ${STAR}`);

        if (data.mining && data.mining.length !== 0) {
            var getEngString = data.mining.map((a, p) => {
                return `${p+1}. Finish date and time: __<t:${makeTimestamp(a.date.getTime())}:F>__\nAmount invested: \`${formatNumber(a.amount)}\` ${STAR}\nAmount after mining: ${formatNumber(a.amount + Math.round(a.amount * a.percentage / 100))} ${STAR}\nEnds at <t:${makeTimestamp(a.date.getTime())}:R>`;
            });

            var getRusString = data.mining.map((a, p) => {
                return `${p+1}. Дата и время финиша: __<t:${makeTimestamp(a.date.getTime())}:F>__\nСумма вложений: \`${formatNumber(a.amount)}\` ${STAR}\nСумма после майнинга: ${formatNumber(a.amount + Math.round(a.amount * a.percentage / 100))} ${STAR}\nЗакончится через <t:${makeTimestamp(a.date.getTime())}:R>`;
            });

            if (this.sd.lang && this.sd.lang === "en") {
                getEngString.forEach(a => en.addField(a, "** ** ", false));
            } else getRusString.forEach(a => ru.addField(a, "** **", false));

        } else {
            en.addField("You don't have mining farms.", `To invest money, write \`${this.sd.prefix || "a!"}bank invest\``);
            ru.addField("У тебя нет майнинг ферм.", `Чтобы вложить деньги, напиши \`${this.sd.prefix || "a!"}bank invest\``)
        };

        

        return this.msg.reply({embeds: [(this.sd.lang && this.sd.lang === "en") ? en : ru]});
        
    };

    async linkCard(code) {
        if (!code) return error(this.msg, this.sd.lang === "en" ? "Specify a card number." : "Укажите номер карты.");
        const card = await cd.findOne({code});
        if (!card) return error(this.msg, this.sd.lang === "en" ? "Card not found." : "Карта не найдена.");
        if (card.userID !== this.id) return error(this.msg, this.sd.lang === "en" ? "This is not your card." : "Это не ваша карта.");

        await bank.updateOne({userID: this.id}, {$set: {paymentMethod: card.code}}).then(this.msg.react(AGREE));
        return;
    };


    async addMining (id = false) {
        if (!id) id = this.id;
        const data = await this.checkDocument(id);
        const { noStar, timeOut } = require(`../languages/${this.sd.lang || "ru"}`);
        const myBoostLevel = await Subscription(this.bot, this.msg, "Tyrus").getSubId();

        const perms = {
            none: {
                slots: 2,
                max: 100000
            },
            vip: {
                slots: 3,
                max: 500000
            },
            premium: {
                slots: 4,
                max: 1000000
            }
        };

        const perc = {
            "1": {
                percentage: 10,
                expire: 43200 * 1000 
            },
            "2": {
                percentage: 20,
                expire: 86400 * 1000 * 2
            },
            "3": {
                percentage: 50,
                expire: 86400 * 1000 * 5
            }
        };

        let myPerm = "none";
        const bag = await bagFind(id);

        if(bag.vip2) {
            myPerm = "premium";
        } else if (bag.vip1) myPerm = "vip";

        if ((perms[myPerm].slots + myBoostLevel) <= data.mining.length) return error(this.msg, this.sd.lang === "en" ? "You don't have enough space for mining." : "У тебя недостаточно мест для майнинга.");

        const emb = new MessageEmbed()
        .setColor(main)
        .setAuthor(this.user.tag, this.user.displayAvatarURL({dynamic: true}))
        

        const m1 = await this.msg.reply({embeds: [this.sd.lang === "en" ? emb.setDescription(`How many gold do you want to invest? For example: \`150000\`\nYour maximum invest amount is __${formatNumber(perms[myPerm].max)}__.`) : emb.setDescription(`Сколько золота вы хотите вложить? Например: \`150000\`\nВаша максимальная сумма вложений составляет __${formatNumber(perms[myPerm].max)}__.`)]});

        let b1 = false, b2 = false;

        const cl1 = await this.channel.createMessageCollector({
            filter: m => m.author.id === id,
            time: 15000
        });

        let myAmount = 0;

        cl1.on("collect", async message => {
            const m = message.content;
            if (!isNaN(m) && Math.round(m) >= 1000 && Math.round(m) <= perms[myPerm].max) {
                b1 = true;
                cl1.stop();
                const am = Math.round(m);
                const bagData = await bagFind(id);
                if (am > bagData.stars) return error(this.msg, noStar);
                myAmount = am;

                const m2 = await this.msg.reply({embeds: [this.sd.lang === "en" ? emb.setDescription(stripIndents`Choose a plan (write a number)
                1. Duration: 12h.
                Adds: ${perc["1"].percentage}%
                You'll get: ${formatNumber(myAmount + (myAmount * perc["1"]["percentage"] / 100))} ${STAR}
                
                2. Duration: 2 days.
                Adds: ${perc["2"].percentage}%
                You'll get: ${formatNumber(myAmount + (myAmount * perc["2"]["percentage"] / 100))} ${STAR}
                
                3. Duration: 5d.
                Adds: ${perc["3"].percentage}%
                You'll get: ${formatNumber(myAmount + (myAmount * perc["3"]["percentage"] / 100))} ${STAR}`) : emb.setDescription(stripIndents`Выберите план (напишите номер)
                1. Длиться: 12ч.
                Добавляет: ${perc["1"].percentage}%
                Вы получите: ${formatNumber(myAmount + (myAmount * perc["1"]["percentage"] / 100))} ${STAR}
                
                2. Длиться: 2д.
                Добавляет: ${perc["2"].percentage}%
                Вы получите: ${formatNumber(myAmount + (myAmount * perc["2"]["percentage"] / 100))} ${STAR}
                
                3. Длиться: 5д.
                Добавляет: ${perc["3"].percentage}%
                Вы получите: ${formatNumber(myAmount + (myAmount * perc["3"]["percentage"] / 100))} ${STAR}`)]});

                const cl2 = await this.channel.createMessageCollector({
                    filter: m => m.author.id === id,
                    time: 15000
                });

                cl2.on("collect", async message => {
                    const m = message.content+"";

                    const arr = ["1", "2", "3"];

                    if (arr.includes(m)) {
                        b2 = true;
                        cl2.stop();
                        const randomInt = randomRange(1, 4);
                        await delay(1000 * randomInt);
                        const bagData1 = await bagFind(id);
                        if (am > bagData1.stars) return error(this.msg, noStar);
                        await addStar(id, -am);
                        await bank.updateOne({userID: id}, {$inc: {totalInvests: am}});
                        data.mining.push({
                            date: new Date(Date.now() + perc[m]["expire"]),
                            amount: myAmount,
                            percentage: perc[m]["percentage"]
                        });

                        data.save()

                        return embed(this.msg, `${this.sd.lang === "en" ? `Mining will ends` : `Майнинг закончится`} <t:${makeTimestamp(Date.now() + perc[m]["expire"])}:R>`);
                    };
                });

                cl2.on("end", () => {
                    m2.delete();
                    if (!b2) return error(this.msg, timeOut);
                })
                
            }
        });

        cl1.on("end", () => {
            m1.delete();
            if (!b1) return error(this.msg, timeOut);
        })
        
    };


    async checkEnd() {
        const data = await this.checkDocument(this.id);
        if (!data.mining || data.mining.length === 0) return;
        const filtered = data.mining.filter(obj => obj.date < new Date());

        if (!filtered || filtered.length === 0) return;

        await filtered.forEach(async (obj) => {
            const data1 = await this.checkDocument(this.id);
            data1.mining.splice(data1.mining.indexOf(obj), 1)
            await data1.save()
            await bank.updateOne({userID: this.id}, {$inc: {totalGotten: Math.round(obj.amount + (obj.amount * obj.percentage / 100) )}});
            if (data1.paymentMethod) {
                const card = await cd.findOne({code: data1.paymentMethod});
                const cardData = cards[card.name];

                if (card && card.userID === this.id && cardData.maxSpace >= (card.amount + Math.round(obj.amount + (obj.amount * obj.percentage / 100) )) ) {
                    card.amount += Math.round(obj.amount + (obj.amount * obj.percentage / 100) );
                    await card.save()
                } else {
                await addStar(this.id, Math.round(obj.amount + (obj.amount * obj.percentage / 100) ) );
                }
            } else {
                await addStar(this.id, Math.round(obj.amount + (obj.amount * obj.percentage / 100) ) );
            }
            await sendToMail(this.id, {createdAt: obj.date, textMessage: this.sd.lang === "en" ? `Mining successfully finished, you got __${formatNumber(Math.round(obj.amount + (obj.amount * obj.percentage / 100) ))}__.` : `Майнинг успешно закончился, вы получили __${formatNumber(Math.round(obj.amount + (obj.amount * obj.percentage / 100) ))}__.`})
        })
    }


    
};

module.exports = function(bot, msg, sd) {
    return new bankClass(bot, msg, sd);
} 

async function getSlots(bot, msg) {
    const myBoostLevel = await Subscription(bot, msg, "Tyrus").getSubId();

    const perms = {
        none: {
            slots: 2,
            max: 100000
        },
        vip: {
            slots: 3,
            max: 500000
        },
        premium: {
            slots: 4,
            max: 1000000
        }
    };
    
    let myPerm = "none";
    const bag = await bagFind(msg.author.id);

    if(bag.vip2) {
        myPerm = "premium";
    } else if (bag.vip1) myPerm = "vip";
    return perms[myPerm].slots + myBoostLevel;
}