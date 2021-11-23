const {serverFind, rpgFind, bagFind, rpg, profile} = require("../../functions/models");
const {error, embed, roundFunc, pagination, formatNumber} = require("../../functions/functions");
const {MEDAL, LEFT, RIGHT, LEAGUE, STAR, CRYSTAL, LOADING} = require("../../config");
const {MessageEmbed, MessageButton} = require("discord.js");
const {greenlight, redlight, main} = require('../../JSON/colours.json');
const heroes = require('../../JSON/heroes.json');
const Rate = require("../../functions/rateClass");
const {stripIndents} = require("common-tags")
const rewards = require("../../rewards.json");

const { LevelMethods } = require("../../functions/levelClass");

module.exports = {
    config: {
        name: "leaderboard",
        category: "h_roleplay",
        aliases: ['lb', "top", "топ"],
      },
    run: async (bot, message, args, ops, tr) => {
        
        const m = message;
        const LANG = await serverFind(m.guild.id)
        const {hero: h, leaderboard: lb, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   
        
        if (!devID.includes(message.author.id)) return error(message, LANG.lang === "en" ? "This command is not available right now." : "Эта команда недоступна сейчас.");
        
        const load = await m.reply(LOADING);

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
                
                return `\n${emoji} ${position}**${name}** | ${h.all} **${formatNumber(data.totalGames)}** | 🏆 ${getWR}  | <a:herodann:883382573231923201> — ${heroName} (${hm.level} ${getCurrentHero.level})`
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

        const allXpData = await profile.find({xp: {$exists: true}}).sort([["xp", "descending"]]).exec();
        const slicedXp = allXpData.slice(0, 20);
        const mappedXp = slicedXp.map((data, pos) => {
            const level = LevelMethods.getCurrentLevelByXp(data.xp);
                
                const xp = formatNumber(data.xp);
            try {
                const name = bot.users.cache.get(data.userID) ? bot.users.cache.get(data.userID).tag : (LANG.lang === "ru" ? "Неизвестный" : "Unknown");       
                
                return `${pos+1}.  ${xp} | ${name} | ${level.current} lvl`
            } catch {
                return `${pos+1}.  ${xp} | ${LANG.lang === "ru" ? "Неизвестный" : "Unknown"} | ${level.current} lvl`
            }
           
        });
        
        // ending arrays

        const lg = Rate(message).fetch().reverse();
        const text = lg.map(i => `\n${i.emoji} ${LANG.lang === "en" ? i.nameEn : i.name}: ${formatNumber(i.max)} ${LEAGUE.cup} - ${formatNumber(i.reward)} ${STAR}`)

        const Embed00 = new MessageEmbed()
        .setTitle(LANG.lang === "en" ? "Top of XP" : "Топ по XP")
        .setColor(main)
        .setThumbnail(bot.user.displayAvatarURL())
        .setDescription(stripIndents`
        ${LANG.lang === "en" ? `Top 1 will get ${rewards.lbTop1} ${CRYSTAL} daily.` : `Топ 1 будет получать ${rewards.lbTop1} ${CRYSTAL} ежедневно!`}
        ${LANG.lang === "en" ? `Each new level will give more` : "Каждый новый уровень дает больше"} ${rewards.xpLevelUpdate} ${CRYSTAL}
        \`\`\`dts
        #  XP  |  Tag  |  Level
        =======================
        ${mappedXp.join("\n")}  
        \`\`\``)
        
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
        
        return await pagination(m, [Embed00, Embed0, Embed1, Embed2], [button1, button2], 100000, [m.author.id]).then(load.delete());
        
    }
}

