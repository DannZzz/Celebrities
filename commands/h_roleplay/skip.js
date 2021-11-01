const { main, reddark } = require('../../JSON/colours.json');
const heroes = require('../../JSON/heroes.json');
const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require("discord.js");
const { STAR, AGREE } = require("../../config");
const { error, embed, perms, firstUpperCase, makeTimestamp, delay, roundFunc, getHeroData } = require("../../functions/functions");
const { serverFind, rpgFind, addStar, bagFind, rpg, profileFind, profile, addPremiumStar } = require("../../functions/models");
const Breeding = require("../../functions/breedingClass");

module.exports = {
  config: {
    name: "skip",
    category: "h_roleplay",
    aliases: ["пропустить"]
  },
  run: async (bot, msg, args, ops) => {

    const server = msg.guild;
    const user = msg.author;
    const channel = msg.channel;
    const sd = await serverFind(server.id);

    await Breeding(bot, msg, sd).skip();

  }
}
