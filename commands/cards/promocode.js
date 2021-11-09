const { main } = require('../../JSON/colours.json');
const Promo = require("../../functions/promoClass");
const { MessageEmbed } = require("discord.js");
const {error, firstUpperCase, missingArgument} = require("../../functions/functions");
const {serverFind} = require("../../functions/models");
const cards = require('../../JSON/cards.json');

module.exports = {
  config: {
    name: "promocode",
    aliases: ['promo', 'промокод', 'промо'],
    category: 'cards',
    examples: ["promocode onlychill"]
  },
  run: async function (bot, msg, args) {
    const sd = await serverFind(msg.guild.id);
    const {promoClass: cc, cards: cd, promocode} = require(`../../languages/${sd.lang}`);
    
    if (!args[0]) return await missingArgument(msg, cc.noCode, `${this.config.name} ${promocode.usage}`, this.config.examples)
    await Promo(msg).usePromo(args[0], bot);
      
    
  }
}