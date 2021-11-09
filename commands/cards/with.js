const { main } = require('../../JSON/colours.json');
const Card = require("../../functions/cardClass");
const { MessageEmbed } = require("discord.js");
const {error, firstUpperCase, missingArgument} = require("../../functions/functions");
const cards = require('../../JSON/cards.json');
const {serverFind} = require("../../functions/models");

module.exports = {
  config: {
    name: "take",
    aliases: ['вывести'],
    category: 'cards',
    cooldown: 30,
    examples: ["take 5000"]
  },
  run: async function (bot, msg, args, ops) {
    const sd = await serverFind(msg.guild.id);
    const {cardClass: cc, cards: cd, take} = require(`../../languages/${sd.lang}`);
    
    if (!args[0] || isNaN(args[0])) return await missingArgument(msg, cc.specAmount, `${this.config.name} ${take.usage}`, this.config.examples);
    const user = msg.author;
    ops.cards.set(user.id, {Card: "on"});
    setTimeout(() => ops.cards.delete(user.id), 30000);
    
    return Card(msg).withdraw(Math.round(args[0]));
  }
}