const { main } = require('../../JSON/colours.json');
const Card = require("../../functions/cardClass");
const { MessageEmbed } = require("discord.js");
const {error, firstUpperCase, missingArgument} = require("../../functions/functions");
const cards = require('../../JSON/cards.json');
const {serverFind} = require("../../functions/models");

module.exports = {
  config: {
    name: "send",
    aliases: ['отправить', 'перевести'],
    category: 'cards',
    cooldown: 45,
    examples: ["send 1568-4500 150000"]
  },
  run: async function(bot, msg, args, ops)  {
    const sd = await serverFind(msg.guild.id);
    const {cardClass: cc, cards: cd, send} = require(`../../languages/${sd.lang}`);
    
    const user = msg.author;
    if (!args[0]) return await missingArgument(msg, cc.specCode, `${this.config.name} ${send.usage}`, this.config.examples);
    if (!args[1] || isNaN(args[1])) return await missingArgument(msg, cc.specAmount, `${this.config.name} ${send.usage}`, this.config.examples);

    ops.cards.set(user.id, {Card: "on"});
    setTimeout(() => ops.cards.delete(user.id), 30000);
    
    return Card(msg).addMoney(args[0], args[1]);
  }
}