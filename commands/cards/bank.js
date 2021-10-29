const { main } = require('../../JSON/colours.json');
const Bank = require("../../functions/bankClass");
const { MessageEmbed } = require("discord.js");
const {error, firstUpperCase, formatNumber} = require("../../functions/functions");
const {serverFind} = require("../../functions/models");

module.exports = {
  config: {
    name: "bank",
    aliases: ['банк'],
    category: 'cards'
  },
  run: async (bot, msg, args, ops) => {
    const sd = await serverFind(msg.guild.id);
    const cardLink = ["card"];
    const invest = ["invest"]
    
    if (args[0]) {
        ops.cards.set(msg.author.id, {get: "true"});
        setTimeout(() => {ops.cards.delete(msg.author.id)}, 32000)
        if (cardLink.includes(args[0].toLowerCase())) {
          await Bank(bot, msg, sd).linkCard(args[1]);
          return 
        } else if (invest.includes(args[0].toLowerCase())) {
          await Bank(bot, msg, sd).addMining();
          return 
        }
    } 
    
    await Bank(bot, msg, sd).createInterface();
    
  }
}