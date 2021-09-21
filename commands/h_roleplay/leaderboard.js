const {serverFind, rpgFind, bagFind, rpg} = require("../../functions/models");
const {error, embed, roundFunc} = require("../../functions/functions");
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight, main} = require('../../JSON/colours.json');
const heroes = require('../../JSON/heroes.json');

module.exports = {
    config: {
        name: "leaderboard",
        category: "g_vip",
        aliases: ['lb', "top", "топ"],
      },
    run: async (bot, message, args) => {
        const m = message;
        const LANG = await serverFind(m.guild.id)
        const {hero: h, leaderboard: lb, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   

        
        const [a0] = args;
        if (!a0) return error(m, lb.no);
        const values = ["total", "тотал"];
        const value = a0.toLowerCase();
        if (values.includes(value)) {
            const dataRPG = await rpg.find({item: {$exists: true}}).sort([['totalGames', 'descending']]).exec();
            const sliced = dataRPG.slice(0, 20);
            const mapped = sliced.map((data, pos) => {
                try {
                    const name = bot.users.cache.get(data.userID) ? bot.users.cache.get(data.userID).tag : (LANG.lang === "ru" ? "Неизвестный" : "Unknown");
                    const getCurrentHero = data.heroes.find(x => x.name === data.item);
                    const getWR = `${roundFunc(data.wins / data.totalGames  * 100, 1) || '0'}%`
                    const heroData = heroes[getCurrentHero.name];
                    let heroName = heroData.name
                    if (LANG.lang === "ru") heroName = heroData.nameRus
                    return `${pos+1}. **${name}** | ${h.all} **${data.totalGames}** | 🏆 ${getWR}  | <a:herodann:883382573231923201> — ${heroName} (${hm.level} ${getCurrentHero.level})`
                } catch {
                    return `${pos+1}. **${LANG.lang === "ru" ? "Неизвестный" : "Unknown"}**`
                }
               
            });
            const Embed = new MessageEmbed()
            .setTitle(lb.total)
            .setColor(main)
            .setDescription(mapped.join("\n"))
            m.channel.send({embeds: [Embed]})
        }
    }
}

