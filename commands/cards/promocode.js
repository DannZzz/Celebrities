const { main } = require('../../JSON/colours.json');
const Promo = require("../../functions/promoClass");
const { MessageEmbed } = require("discord.js");
const {error, firstUpperCase} = require("../../functions/functions");
const {serverFind} = require("../../functions/models");
const cards = require('../../JSON/cards.json');

module.exports = {
  config: {
    name: "promocode",
    aliases: ['promo', 'промокод', 'промо'],
    category: 'cards'
  },
  run: async (bot, msg, args) => {
    const sd = await serverFind(msg.guild.id);
    const {promoClass: cc, cards: cd} = require(`../../languages/${sd.lang}`);
    
    if (!args[0]) return error(msg, cc.noCode);
    await Promo(msg).usePromo(args[0], bot);
      
    
  }
}