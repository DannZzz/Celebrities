const {serverFind, rpgFind, bagFind, rpg} = require("../../functions/models");
const {error, embed, roundFunc, pagination} = require("../../functions/functions");
const {MEDAL, LEFT, RIGHT, LEAGUE, STAR} = require("../../config");
const {MessageEmbed, MessageButton} = require("discord.js");
const {greenlight, redlight, main} = require('../../JSON/colours.json');
const heroes = require('../../JSON/heroes.json');
const Rate = require("../../functions/rateClass");
const {stripIndents} = require("common-tags")

module.exports = {
    config: {
        name: "leaderboard",
        category: "h_roleplay",
        aliases: ['lb', "top", "топ"],
      },
    run: async (bot, message, args) => {
        const m = message;
        const LANG = await serverFind(m.guild.id)
        const {hero: h, leaderboard: lb, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   

        // creating arrays
        const dataRPG = await rpg.find({item: {$exists: true}}).sort([['totalGames', 'descending']]).exec();
        const sliced = dataRPG.slice(0, 10);
        const mapped = sliced.map((data, pos) => {
            let emoji;
            if (pos === 0) emoji = MEDAL.gold;
            if (pos === 1) emoji = MEDAL.silver;
            if (pos === 2) emoji = MEDAL.bronze;
            if (!emoji) emoji = "";
            let position = pos + 1 +". ";
            if (emoji) position = "";
            try {
                const name = bot.users.cache.get(data.userID) ? bot.users.cache.get(data.userID).tag : (LANG.lang === "ru" ? "Неизвестный" : "Unknown");
                const getCurrentHero = data.heroes.find(x => x.name === data.item);
                const getWR = `${roundFunc(data.wins / data.totalGames  * 100, 1) || '0'}%`
                const heroData = heroes[getCurrentHero.name];
                let heroName = heroData.name
                if (LANG.lang === "ru") heroName = heroData.nameRus
                
                return `\n${emoji} ${position}**${name}** | ${h.all} **${data.totalGames}** | 🏆 ${getWR}  | <a:herodann:883382573231923201> — ${heroName} (${hm.level} ${getCurrentHero.level})`
            } catch {
                return `\n${emoji} ${position}**${LANG.lang === "ru" ? "Неизвестный" : "Unknown"}**`
            }
           
        });

        const jRPG = await rpg.find({item: {$exists: true}}).sort([['surviveLevel', 'descending']]).exec();
        const sliced2 = jRPG.slice(0, 10);
        const mapped2 = sliced2.map((data, pos) => {
            let emoji;
            if (pos === 0) emoji = MEDAL.gold;
            if (pos === 1) emoji = MEDAL.silver;
            if (pos === 2) emoji = MEDAL.bronze;
            if (!emoji) emoji = "";
            let position = pos + 1 +". ";
            if (emoji) position = "";
            try {
                const name = bot.users.cache.get(data.userID) ? bot.users.cache.get(data.userID).tag : (LANG.lang === "ru" ? "Неизвестный" : "Unknown");
                
                return `\n${emoji} ${position}**${name}** | ${hm.level} ${data.surviveLevel-1 || 0}`
            } catch {
                return `\n${emoji} ${position}**${LANG.lang === "ru" ? "Неизвестный" : "Unknown"}**`
            }
           
        });

        const cupRPG = await rpg.find({"league.rate": {$exists: true}}).sort([["league.rate", "descending"]]).exec();
        const sliced0 = cupRPG.slice(0, 10);
        const mapped0 = await Promise.all(sliced0.map(async (data, pos) => {
            let emoji;
            if (pos === 0) emoji = MEDAL.gold;
            if (pos === 1) emoji = MEDAL.silver;
            if (pos === 2) emoji = MEDAL.bronze;
            if (!emoji) emoji = "";
            let position = pos + 1 +". ";
            if (emoji) position = "";
            
            const league = await Rate(message).rateData(data.league.rate || 0);
            const name = bot.users.cache.get(data.userID) ? bot.users.cache.get(data.userID).tag : (LANG.lang === "ru" ? "Неизвестный" : "Unknown");
            return `\n${emoji} ${position}**${name}** | ${league}`;
        }))
        
        // ending arrays

        const lg = Rate(message).fetch().reverse();
        const text = lg.map(i => `\n${i.emoji} ${LANG.lang === "en" ? i.nameEn : i.name}: ${i.max} ${LEAGUE.cup} - ${i.reward} ${STAR}`)

        const Embed0 = new MessageEmbed()
        .setTitle(LANG.lang === "en" ? "Top of Rate" : "Топ по рейтингу")
        .setColor(main)
        .setThumbnail(bot.user.displayAvatarURL())
        .setDescription(`${text.join("")}\n\n`+mapped0.join("\n"))

        const Embed1 = new MessageEmbed()
        .setTitle(lb.games)
        .setColor(main)
        .setThumbnail(bot.user.displayAvatarURL())
        .setDescription(mapped.join("\n"))

        const Embed2 = new MessageEmbed()
        .setTitle(lb.journey)
        .setColor(main)
        .setDescription(mapped2.join("\n"))
        .setThumbnail(bot.user.displayAvatarURL())

        // creating button and sending msg
        const button1 = new MessageButton()
        .setCustomId("left")
        .setEmoji(LEFT)
        .setStyle("SECONDARY")
        const button2 = new MessageButton()
        .setCustomId("right")
        .setEmoji(RIGHT)
        .setStyle("SECONDARY")
        
        return await pagination(m, [Embed0, Embed1, Embed2], [button1, button2], 100000, [m.author.id])
        
    }
}

