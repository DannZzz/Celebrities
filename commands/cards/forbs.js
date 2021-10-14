const { rpg, bag, serverFind } = require("../../functions/models");
const {MEDAL, LEFT, RIGHT, LEAGUE, STAR} = require("../../config");
const { MessageEmbed } = require("discord.js");
const { formatNumber } = require("../../functions/functions");
const {greenlight, redlight, main} = require('../../JSON/colours.json');

module.exports = {
    config: {
        name: "forbs",
        aliases: ['форбс'],
        category: 'cards',
    },
    run: async (bot, msg, args, ops) => {
        const data = await bag.find().sort([['stars', 'descending']]).exec();
        const blackList = ["873237782825422968", "382906068319076372"];

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
        
        const emb = new MessageEmbed()
        .setTitle(LANG.lang === "ru" ? "Список самых богатых участников!" : "List of the most richest members!")
        .setColor(main)
        .setThumbnail(bot.user.displayAvatarURL())
        .setDescription(texted.join('\n'))

        msg.channel.send({embeds: [emb]});

    }
}