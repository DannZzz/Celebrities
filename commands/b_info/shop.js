const respGlob = ['global', 'g', 'глобал', 'г'];
const respServ = ["server", 's', 'сервер', 'с'];
const {MessageEmbed} = require("discord.js");
const sd = require('../../models/serverSchema.js')
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR } = require('../../config');
const ms = require('ms');
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);

module.exports = {
  config: {
    name: "shop",
    category: "b_info",
    aliases: ["store"]
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return
      const getLang = require("../../models/serverSchema");
      const LANG = await getLang.findOne({serverID: message.guild.id});
      const {shop, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`); 
      
    const pack = ["pack", "packs"]
    
    if (args[0] && pack.includes(args[0].toLowerCase())) return message.channel.send({embeds: [shop.items()]})

    return message.channel.send({embeds: [shop.shop()]})
   


  }
}
