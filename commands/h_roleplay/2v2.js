const { main, reddark } = require('../../JSON/colours.json');
const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require("discord.js");
const { STAR, AGREE } = require("../../config");
const { error, embed, perms, firstUpperCase, makeTimestamp, delay, roundFunc, getHeroData } = require("../../functions/functions");
const { serverFind, rpgFind, addStar, bagFind, rpg, profileFind, profile, addPremiumStar } = require("../../functions/models");
const PVP = require("../../functions/2v2Class");

module.exports = {
  config: {
    name: "2v2",
    category: "h_roleplay",
    aliases: ["2vs2", "2на2"],
    cooldown: 16,
    examples: ["2v2 @Dann#0006", "2v2 382906068319076372"]
  },
  run: async (bot, msg, args, ops) => {

    const server = msg.guild;
    const user = msg.author;
    const channel = msg.channel;

    await PVP(bot, msg).start(args[0])

  }
}
