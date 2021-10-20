const { main } = require('../../JSON/colours.json');
const Partner = require("../../functions/partnerClass");
const { MessageEmbed } = require("discord.js");
const { error, firstUpperCase } = require("../../functions/functions");
const { serverFind } = require("../../functions/models");

module.exports = {
  config: {
    name: "partner",
    aliases: ['партнер'],
    category: 'cards',
    cooldown: 35
  },
  run: async (bot, msg, args) => {

    if (args[0] && args[0].toLowerCase() === "create") {
      return await Partner(bot, msg).createPartnerCode();
    };

    Partner(bot, msg).getData()

  }
}