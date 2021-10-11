const { main } = require('../../JSON/colours.json');
const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require("discord.js");
const {STAR, AGREE } = require("../../config");
const {error, embed, perms, firstUpperCase, makeTimestamp, delay, roundFunc, getPowers} = require("../../functions/functions");
const {serverFind, rpgFind, addStar, bagFind, rpg, profileFind, profile } = require("../../functions/models");
const {stripIndents} = require("common-tags");
const powers = require("../../JSON/powers.json");

module.exports = {
    config: {
        name: "stats",
        aliases: ["статы"],
        category: "h_roleplay"
    },
    run: async (bot, msg, args) => {
        const server = msg.guild;
        const user = msg.author;
        const channel = msg.channel;

        const rp = await rpgFind(user.id);
        const sd = await serverFind(server.id);
        const {stats, hero: h, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${sd.lang}`);
        
        const EMB = new MessageEmbed()
        .setColor(main)
        .setAuthor(user.username, user.displayAvatarURL({dynamic: true}))
        .setDescription(stripIndents`
        <:monsterboss:887750235646996570> ${h.journey}: ${rp.surviveLevel}

        <a:herodann:883382573231923201> ${stats.trial} ${rp.trialMax || 0}

        ${powers.health.emoji} ${sd.lang === "ru" ? powers.health.nameRU : powers.health.nameRN}: ${getPowers(bot, user.id, rp).h}%

        ${powers.damage.emoji} ${sd.lang === "ru" ? powers.damage.nameRU : powers.damage.nameRN}: ${getPowers(bot, user.id, rp).d}%

        🟡 ${h.all} ${rp.totalGames || 0}

        🟢 ${h.win} ${rp.wins || 0}

        🔴 ${h.lose} ${rp.loses || 0}

        🏆 ${hm.winrate} ${roundFunc(rp.wins / rp.totalGames  * 100) || '0'}%`)

        msg.channel.send({embeds: [EMB]});
    }
}