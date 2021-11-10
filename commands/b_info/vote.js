const { main, reddark } = require('../../JSON/colours.json');
const heroes = require('../../JSON/heroes.json');
const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require("discord.js");
const { STAR, AGREE, CRYSTAL } = require("../../config");
const rewards = require("../../rewards.json");
const { voteTime, error, embed, perms, firstUpperCase, makeTimestamp, delay, roundFunc, getHeroData, progressBar } = require("../../functions/functions");
const { voteFind, serverFind, rpgFind, addStar, bagFind, rpg, profileFind, profile, addPremiumStar } = require("../../functions/models");

module.exports = {
  config: {
    name: "vote",
    category: "b_info",
    aliases: ["голосовать"]
  },
  run: async (bot, msg, args, ops) => {

    const server = msg.guild;
    const user = msg.author;
    const channel = msg.channel;
    const sd = await serverFind(server.id);

    const vote = await voteFind(user.id);
    
    const voteString = await voteTime(user.id, sd.lang || "ru")
    const emb = new MessageEmbed()
    .setColor(main)
    .setDescription(`${voteString}\n${sd.lang === "en" ? `Vote [here](https://top.gg/bot/726784476377514045/vote) and get 15 ${CRYSTAL}!` : `Голосуй [тут](https://top.gg/bot/726784476377514045/vote) и получи 15 ${CRYSTAL}!`}`)
    .addField(sd.lang === "en" ? "My votes:" : "Мои голосы", `${vote.topggCount || 0}`)
    .addField(`Goal: ${rewards.voteGoal} ${CRYSTAL}`, progressBar(((vote.topggCount || 0) % 10), 10, 10, "🟢", "⚫")+ ` **${(vote.topggCount || 0) % 10} / 10**`);
    
    return msg.reply({embeds: [emb]});

  }
}
