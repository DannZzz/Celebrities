const { main } = require('../../JSON/colours.json');
const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require("discord.js");
const {STAR, AGREE } = require("../../config");
const {error, embed, perms, firstUpperCase, makeTimestamp, delay, roundFunc, getPowers} = require("../../functions/functions");
const {serverFind, rpgFind, addStar, bagFind, rpg, profileFind, profile, powersFind } = require("../../functions/models");
const {stripIndents} = require("common-tags");
const powers = require("../../JSON/powers.json");
const Collections = require("../../JSON/collections.json");

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
        let collections = [];
        if (rp.collections && rp.collections.length !== 0) {
            collections = rp.collections.map(id => {
                let a;
                for (let coll in Collections) {
                    const c = Collections[coll]
                    if (c.id === id) a = c;
                }
                return a;
            })
        }
        let textedCollections = [];
        if (collections.length !== 0) textedCollections = collections.map(obj => `${obj[`name${(sd.lang || "ru").toUpperCase()}`]}`);

        
        const EMB = new MessageEmbed()
        .setColor(main)
        .setAuthor(user.username, user.displayAvatarURL({dynamic: true}))
        .setDescription(stripIndents`
        ${sd.lang === "en" ? "My collections:" : "Мои коллекции:"} [ ${textedCollections.length} ]
        \`${textedCollections.length === 0 ? `—` : textedCollections.join("\n")}\`

        <:monsterboss:887750235646996570> ${h.journey}: ${rp.surviveLevel}

        <a:herodann:883382573231923201> ${stats.trial} ${rp.trialMax || 0}

        ${powers.health.emoji} ${sd.lang === "ru" ? powers.health.nameRU : powers.health.nameEN}: ${await getPowers(user.id).then(x => x.h.toFixed(1))}%

        ${powers.damage.emoji} ${sd.lang === "ru" ? powers.damage.nameRU : powers.damage.nameEN}: ${await getPowers(user.id).then(x => x.d.toFixed(1))}%

        ${powers.gold.emoji} ${sd.lang === "ru" ? powers.gold.nameRU : powers.gold.nameEN}: ${await getPowers(user.id).then(x => x.g.toFixed(1))}%

        🟡 ${h.all} ${rp.totalGames || 0}

        🟢 ${h.win} ${rp.wins || 0}

        🔴 ${h.lose} ${rp.totalGames - rp.wins || 0}

        🏆 ${hm.winrate} ${((rp.wins / rp.totalGames  * 100) || 0).toFixed(1)}%`)

        msg.channel.send({embeds: [EMB]});
    }
}