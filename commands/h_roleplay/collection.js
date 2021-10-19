const { main, reddark } = require('../../JSON/colours.json');
const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require("discord.js");
const { STAR, AGREE } = require("../../config");
const { error, embed, perms, firstUpperCase, makeTimestamp, delay, roundFunc, getHeroData } = require("../../functions/functions");
const { serverFind, rpgFind, addStar, bagFind, rpg, profileFind, profile, addPremiumStar } = require("../../functions/models");
const Collection = require("../../functions/collectionClass");

module.exports = {
  config: {
    name: "collection",
    category: "h_roleplay",
    aliases: ["коллекция"]
  },
  run: async (bot, msg, args, ops) => {

    const server = msg.guild;
    const user = msg.author;
    const channel = msg.channel;

    if (args[0] && args[0].toLowerCase() === "check") return await Collection(bot, msg).checkData();

    await Collection(bot, msg).showCollections();

  }
}
