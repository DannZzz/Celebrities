const { rpg, rpgFind, addCrystal } = require("../../functions/models");
const { error, embed } = require("../../functions/functions");
const { STAR, AGREE, DISAGREE, devID, adminID, CRYSTAL } = require('../../config')
const ITEMS = require("../../JSON/items.js");
const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require("discord.js");
const { main } = require('../../JSON/colours.json');
const Cards = require("../../functions/cardClass");

module.exports = {
  config: {
    name: "add-custom-card",
    aliases: '',
    dev: true
  },
  run: async (bot, msg, args) => {
    const errorText = `ID [Тип карты] [код | default] (пин-код)`

    if (!args[0] || !args[1] || !args[2]) return error(msg, errorText);
    await Cards(msg, bot).addCustomCard(args[0], args[1], args[2], args[3]);
  }
}