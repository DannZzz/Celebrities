const { main } = require('../../JSON/colours.json');
const Card = require("../../functions/cardClass");
const { MessageEmbed } = require("discord.js");
const {error, firstUpperCase} = require("../../functions/functions");
const cards = require('../../JSON/cards.json');
const {serverFind} = require("../../functions/models");

module.exports = {
  config: {
    name: "send",
    aliases: ['отправить', 'перевести'],
    category: 'cards',
    cooldown: 45
  },
  run: async (bot, msg, args) => {
    const sd = await serverFind(msg.guild.id);
    const {cardClass: cc, cards: cd} = require(`../../languages/${sd.lang}`);
    
    const user = msg.author;
    if (!args[0] || args[0].length !== 9) return error(msg, cc.specCode);
    if (!args[1] || isNaN(args[1])) return error(msg, cc.specAmount);
    return Card(msg).addMoney(args[0], args[1]);
  }
}