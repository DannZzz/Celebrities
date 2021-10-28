const { rpg, profile, profileFind, cardFind, bagFind, serverFind, card: cd, addStar, rpgFind, addPremiumStar, addCandy } = require("./models");
const { error, embed, firstUpperCase, randomRange, delay, sendToMail, pagination, getMember, getHeroData, makeTimestamp } = require("./functions");
const heroes = require("../JSON/heroes.json");
const { none, main } = require("../JSON/colours.json");
const { AGREE, DISAGREE, STAR, LEFT, RIGHT, heroNames, LEAGUE, HELL, LOADING } = require("../config");
const { stripIndents } = require("common-tags");
const Rate = require("./rateClass");
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageCollector, MessageButton, MessageAttachment } = require("discord.js");
const Canvas = require("canvas");
const value = 1500;

const LANG = {
    en: {
        membError: "Specify another member.",
        membHero: "This member has not a hero.",
        declined: "refused.",
        req: "you agree to go to battle against bots with"
    },

    ru: {
        membError: "Укажите другого участника.",
        membHero: "Этот участник не имеет героя.",
        declined: "отказался.",
        req: "вы согласны пойти в сражение против ботов с"
    }
}

class pvpClass {
    constructor(bot, msg) {
        this.msg = msg;
        this.user = msg.author;
        this.id = msg.author.id;
        this.server = msg.guild;
        this.channel = msg.channel;
        this.bot = bot;
    };

    async start(MEMBER = false) {
        const member = getMember(this.msg, MEMBER);
        const sd = await serverFind(this.server.id);
        const { and, battle: b, timeOut, ERROR, interError, buttonYes, buttonNo, again, heroModel: hm } = require(`../languages/${sd.lang || "ru"}`);
        const l = LANG[sd.lang || "ru"];

        const bag = await bagFind(this.id);

        let timeout = 1000 * 60 * 2;
        if (bag.vip2) timeout /= 2;

        const pd = await profileFind(this.id);
        if (pd.pvp2 && pd.pvp2 > new Date()) {
            return error(this.msg, again + ` <t:${makeTimestamp(pd.pvp2.getTime())}:R>`);
        }
        
        if (member.id === this.id) return error(this.msg, l["membError"]);

        const rp1 = await rpgFind(this.id);
        if (!rp1 || !rp1.item) return error(this.msg, h.noHero);

        const rp2 = await rpgFind(member.id);
        if (!rp2 || !rp2.item) return error(this.msg, l["membHero"]);

        const but1 = new MessageButton()
        .setCustomId("extrano")
        .setStyle("DANGER")
        .setLabel(buttonNo);

        const but2 = new MessageButton()
        .setCustomId("extrayes")
        .setStyle("SUCCESS")
        .setLabel(buttonYes);

        const newEmb = new MessageEmbed()
                    .setColor(main)
                    .setAuthor(this.user.username, this.user.displayAvatarURL({dynamic: true}))
                    .setDescription(`${member}, ${l["req"]} **${this.user.username}**?`)
                    

        const row = new MessageActionRow().addComponents([but1, but2]);

        const m1 = await this.msg.reply({embeds: [newEmb], components: [row]});

        const collector = await m1.createMessageComponentCollector({
            filter: i => {
                if (![but1.customId, but2.customId].includes(i.customId)) return false;

                if (i.user.id === member.id) return true;

                const errEMb = new MessageEmbed()
                .setColor(reddark)
                .setTitle(ERROR)
                .setDescription(interError)

                return i.reply({embeds: [intEmbed], ephemeral: true});
            },

            time: 15000
        });
        let bool = false;
        collector.on("collect", async i => {
            bool = true;
            collector.stop();

            switch (i.customId) {
                case but1.customId:
                    return error(this.msg, `${member} ${l["declined"]}`);
                case but2.customId:
                    const data1 = await getHeroData(this.bot, this.id, rp1);
                    const data2 = await getHeroData(this.bot, member.id, rp2);

                    let allH1 = Math.round(data1.h + data2.h);
                    let allD1 = Math.round(data1.d + data2.d);

                    const enemies = heroNames;
                    const enemyName1 = enemies[Math.floor(Math.random() * enemies.length)];
                    const enemyName2 = enemies[Math.floor(Math.random() * enemies.length)];

                    const get1 = rp1.heroes.find(x => x.name === rp1.item);
                    const get2 = rp2.heroes.find(x => x.name === rp2.item);

                    const e1D = heroes[enemyName1];
                    const e2D = heroes[enemyName2];

                    let eh = Math.round( (e1D.health + e2D.health) + ((get1.level + get2.level) * 500) );
                    let ed = Math.round( (e1D.damage + e2D.damage) + ((get1.level + get2.level) * 40) );

                    while (eh * 2 < allH1) eh += Math.round((eh / 2));
                    while (ed * 2 < allD1) ed += Math.round((ed / 2));

                    await rpg.updateOne({ userID: this.id }, { $inc: { totalGames: 1 } });
                    await rpg.updateOne({ userID: member.id }, { $inc: { totalGames: 1 }});

                    await profile.updateOne({userID: this.id}, { $set: {pvp2: new Date(Date.now() + timeout)}});
                    await profile.updateOne({userID: member.id}, { $set: {pvp2: new Date(Date.now() + timeout)}});

                    let damn = await this.msg.reply(`${LOADING} ${b.find}`);
                    const CC = await makeCanvas(heroes[rp1.item].path, heroes[rp2.item].path, e1D.path, e2D.path)
                    const att = new MessageAttachment(CC.toBuffer(), 'fight.png')

                    const emb = new MessageEmbed()
                    .setColor(main)
                    .setImage("attachment://fight.png")
                    .setThumbnail("https://media.giphy.com/media/SwUwZMPpgwHNQGIjI7/giphy.gif")
                    .setTitle(hm.battle)
                    .addField(`${this.user.username}: ${sd.lang === "en" ? heroes[rp1.item]["name"] : heroes[rp1.item]["nameRus"]}\n${this.bot.users.cache.get(member.id).username}: ${sd.lang === "en" ? heroes[rp2.item]["name"] : heroes[rp2.item]["nameRus"]}`, `${allH1} ❤\n${allD1} ⚔`)
                    .addField(`${sd.lang === "en" ? e1D["name"] : e1D["nameRus"]}\n${sd.lang === "en" ? e2D["name"] : e2D["nameRus"]}`, `${eh} ❤\n${ed} ⚔`);

                    const m2 = await this.msg.reply({embeds: [emb], files: [att]});
                    damn.delete();
                    let winner = false;
                    setTimeout(async () => {

                        const random = randomRange(1, 40);
                        if (random <= 20) {
                             while (true) {
                                allH1 -= ed;
                                eh -= allD1;
                                if (allH1 <= 0) {
                                    break;
                                } else if (eh <= 0) {
                                    winner = true;
                                    break;
                                }
                            }
                        } else {
                            while (true) {
                                allH1 -= ed;
                                eh -= allD1;
                                if (eh <= 0) {
                                    winner = true;
                                    break;
                                } else if (allH1 <= 0) {
                                    break;
                                }
                            }
                        };

                        if (winner) {
                            // candies
                            const randomCandy = randomRange(1, 4);
                            await addCandy(this.id, randomCandy);
                            await addCandy(member.id, randomCandy);

                            const rate1 = rp1.league.rate || 0;
                            const league1 = rp1.league.id || 0;
                            const rate2 = rp2.league.rate || 0;
                            const league2 = rp2.league.id || 0;

                            
                            const winCup1 = Rate(this.msg).winRewardGenerator(league1);
                            const winCup2 = Rate(this.msg).winRewardGenerator(league2);
                            await Rate(this.msg).rateUpdate(this.id, winCup1);
                            await Rate(this.msg).rateUpdate(member.id, winCup2);

                            await rpg.updateOne({ userID: this.id }, { $inc: { wins: 1 } });
                            await rpg.updateOne({ userID: member.id }, { $inc: { wins: 1 } });

                            await addPremiumStar(this.bot, this.id, value);
                            await addPremiumStar(this.bot, member.id, value);

                            let winEmb = new MessageEmbed()
                                .setTitle(`${b.winner}\n${this.user.username}: ${sd.lang === "en" ? heroes[rp1.item]["name"] : heroes[rp1.item]["nameRus"]}\n${this.bot.users.cache.get(member.id).username}: ${sd.lang === "en" ? heroes[rp2.item]["name"] : heroes[rp2.item]["nameRus"]}`)
                                .setImage(heroes[rp1.item].url)
                                .setColor(main)
                                .setThumbnail(heroes[rp2.item].url)
                                .addField(`${hm.reward} ${this.user.username}:`, `${await addPremiumStar(this.bot, this.id, value, true).then(x => x)} ${STAR}\n+${winCup1} ${LEAGUE.cup} ${and} ${randomCandy} ${HELL.candy}`, true)
                                .addField(`${hm.reward} ${this.bot.users.cache.get(member.id).username}:`, `${await addPremiumStar(this.bot, member.id, value, true).then(x => x)} ${STAR}\n+${winCup2} ${LEAGUE.cup} ${and} ${randomCandy} ${HELL.candy}`, true)
                            m2.delete();
                            return this.channel.send({ embeds: [winEmb]});
                        } else {
                            let winEmb = new MessageEmbed()
                                .setTitle(`${b.winner}\n${sd.lang === "en" ? e1D["name"] : e1D["nameRus"]}\n${sd.lang === "en" ? e2D["name"] : e2D["nameRus"]}`)
                                .setImage(e1D.url)
                                .setColor(main)
                                .setThumbnail(e2D.url)
                            m2.delete();
                            return this.channel.send({ embeds: [winEmb]});
                        }
                        
                    }, 20000)

            };
        })

        collector.on("end", () => {
            m1.delete();
            if (bool) return;
            return error(this.msg, timeOut)
        })

        
    }

    
    
};

module.exports = function(bot, msg) {
    return new pvpClass(bot, msg);
} 


async function makeCanvas(data1, data2, data3, data4) {
    const canvas = Canvas.createCanvas(1110, 520);
    const ctx = canvas.getContext('2d');
    const background = await Canvas.loadImage('https://png.pngtree.com/thumb_back/fh260/background/20200729/pngtree-game-battle-versus-vs-background-image_373230.jpg'); // https://i.ibb.co/BqPXZdq/vs-Template.jpg
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
    const h = 230;
    const heroHeight = 10;
    const firstW = 80;
    const secW = 800;
  
    const first = await Canvas.loadImage(data1);
    const second = await Canvas.loadImage(data2);
    const th = await Canvas.loadImage(data3);
    const ft = await Canvas.loadImage(data4);
  
    ctx.drawImage(first, firstW, heroHeight, h, h);
    ctx.drawImage(second, firstW, (520-heroHeight-h), h, h);
    ctx.drawImage(th, secW, heroHeight, h, h);
    ctx.drawImage(ft, secW, (520-heroHeight-h), h, h);

  
    ctx.lineWidth = 3;
    ctx.strokeStyle = "GRAY";
    ctx.strokeRect(firstW, heroHeight, h, h)

    ctx.lineWidth = 3;
    ctx.strokeStyle = "GRAY";
    ctx.strokeRect(firstW, (520-heroHeight-h), h, h)

    ctx.lineWidth = 3;
    ctx.strokeStyle = "ORANGE"
    ctx.strokeRect(secW, (520-heroHeight-h), h, h)
  
    ctx.lineWidth = 3;
    ctx.strokeStyle = "ORANGE";
    ctx.strokeRect(secW, heroHeight, h, h)
  
    return canvas
  }