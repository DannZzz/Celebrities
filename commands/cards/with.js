const { main } = require('../../JSON/colours.json');
const Card = require("../../functions/cardClass");
const { MessageEmbed } = require("discord.js");
const {error, firstUpperCase} = require("../../functions/functions");
const cards = require('../../JSON/cards.json');
const {serverFind} = require("../../functions/models");

module.exports = {
  config: {
    name: "take",
    aliases: ['вывести'],
    category: 'cards',
    cooldown: 15
  },
  run: async (bot, msg, args) => {
    const sd = await serverFind(msg.guild.id);
    const {cardClass: cc, cards: cd} = require(`../../languages/${sd.lang}`);
    
    if (!args[0] || isNaN(args[0])) return error(msg, cc.specAmount);
    return Card(msg).withdraw(Math.round(args[0]));
  }
}