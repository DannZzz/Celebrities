const { main } = require('../../JSON/colours.json');
const Card = require("../../functions/cardClass");
const { MessageEmbed } = require("discord.js");
const {error, firstUpperCase} = require("../../functions/functions");
const cards = require('../../JSON/cards.json');

module.exports = {
  config: {
    name: "pins",
    aliases: ['codes', 'коды'],
    category: 'cards'
  },
  run: async (bot, msg, args) => {
    const user = msg.author;
    Card(msg).sendPin()
  }
}