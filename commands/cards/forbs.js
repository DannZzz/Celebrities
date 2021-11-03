const { rpg, bag, serverFind } = require("../../functions/models");
const {MEDAL, LEFT, RIGHT, LEAGUE, STAR, HERO, LOADING} = require("../../config");
const { MessageEmbed, MessageButton } = require("discord.js");
const { formatNumber, pagination } = require("../../functions/functions");
const {greenlight, redlight, main} = require('../../JSON/colours.json');
const heroes = require("../../JSON/heroes.json");
const elements = require("../../JSON/elements.json");

module.exports = {
    config: {
        name: "forbs",
        aliases: ['форбс'],
        category: 'cards',
    },
    run: async (bot, msg, args, ops) => {
        const data = await bag.find().sort([['stars', 'descending']]).exec();
        const blackList = [];
        const m = await msg.reply(LOADING);

        const LANG = await serverFind(msg.guild.id)
        
        const filtered = data.filter(data => !blackList.includes(data.userID));

        const sliced = filtered.slice(0, 15);
        const texted = sliced.map((data, pos) => {

            let emoji;
            if (pos === 0) emoji = MEDAL.gold;
            if (pos === 1) emoji = MEDAL.silver;
            if (pos === 2) emoji = MEDAL.bronze;
            if (!emoji) emoji = "";
            let position = pos + 1 +". ";
            if (emoji) position = "";
            
            const getName = bot.users.cache.get(data.userID) ? bot.users.cache.get(data.userID).tag : (LANG.lang === "ru" ? "Неизвестный" : "Unknown");
            return `${emoji} ${position}**${getName}** | ${formatNumber(Math.round(data.stars))} ${STAR}`
        });
        
        const emb1 = new MessageEmbed()
        .setTitle(LANG.lang === "ru" ? "Список самых богатых участников!" : "List of the most richest members!")
        .setColor(main)
        .setThumbnail(bot.user.displayAvatarURL())
        .setDescription(texted.join('\n'))

        const rpgDocs = await rpg.find().exec();
        const sorted = rpgDocs.sort((a, b) => {
            function get (arr) {
                let aggr = 0;
                let number = arr.forEach((c) => {
                    const hd = heroes[c.name];
                    if (hd.elements.includes("legendary")) aggr += 1;
                });
                return aggr;
            };
            const a1 = get(a.heroes);
            const b1 = get(b.heroes);
            return b1 - a1;
        });

        const sliced1 = sorted.slice(0, 15);

        const texted2 = sliced1.map((obj, pos) => {
            let emoji;
            if (pos === 0) emoji = MEDAL.gold;
            if (pos === 1) emoji = MEDAL.silver;
            if (pos === 2) emoji = MEDAL.bronze;
            if (!emoji) emoji = "";
            let position = pos + 1 +". ";
            if (emoji) position = "";
            
            function get (arr) {
                let aggr = 0;
                let number = arr.forEach((c) => {
                    const hd = heroes[c.name];
                    if (hd.elements.includes("legendary")) aggr += 1;
                });
                return aggr;
            };

            const legCount = get(obj.heroes);
            const name = bot.users.cache.get(obj.userID) ?  bot.users.cache.get(obj.userID).tag : (LANG.lang === "en" ? "Unknown" : "Неизвестный");
            return `**${emoji} ${position} ${name}** | ${legCount} ${elements["legendary"]["emoji"]} | ${obj.heroes.length} ${HERO}`; 
        });

        const emb2 = new MessageEmbed()
        .setTitle(LANG.lang === "ru" ? "Список по легендарным героям!" : "List of the legendary heroes!")
        .setColor(main)
        .setThumbnail(bot.user.displayAvatarURL())
        .setDescription(texted2.join('\n'))


        const button1 = new MessageButton()
        .setCustomId("left1")
        .setEmoji(LEFT)
        .setStyle("SECONDARY")
        const button2 = new MessageButton()
        .setCustomId("right1")
        .setEmoji(RIGHT)
        .setStyle("SECONDARY")
        
        await pagination(msg, [emb1, emb2], [button1, button2], 100000, [msg.author.id])
        return m.delete();
        
    }
}