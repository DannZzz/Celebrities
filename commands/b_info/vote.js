const { main, reddark } = require('../../JSON/colours.json');
const heroes = require('../../JSON/heroes.json');
const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require("discord.js");
const { STAR, AGREE, CRYSTAL } = require("../../config");
const { error, embed, perms, firstUpperCase, makeTimestamp, delay, roundFunc, getHeroData } = require("../../functions/functions");
const { serverFind, rpgFind, addStar, bagFind, rpg, profileFind, profile, addPremiumStar } = require("../../functions/models");

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

    const emb = new MessageEmbed()
    .setColor(main)
    .setDescription(sd.lang === "en" ? `Vote [here](https://discordbotlist.com/bots/adana/upvote) and get 15 ${CRYSTAL}!` : `Голосуй [тут](https://discordbotlist.com/bots/adana/upvote) и получи 15 ${CRYSTAL}!`)

    return msg.reply({embeds: [emb]});

  }
}
