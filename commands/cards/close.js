const { main } = require('../../JSON/colours.json');
const Card = require("../../functions/cardClass");
const { MessageEmbed } = require("discord.js");
const {error, firstUpperCase} = require("../../functions/functions");
const cards = require('../../JSON/cards.json');

module.exports = {
  config: {
    name: "close",
    aliases: ['закрыть'],
    category: 'cards',
    cooldown: 45
  },
  run: async (bot, msg, args) => {
    Card(msg).closeCard()
  }
}