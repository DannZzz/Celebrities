const heroes = require('../../JSON/heroes.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed } = require("discord.js");
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);

module.exports = {
  config: {
    name: "replace",
    aliases: ['заменить'],
    category: 'h_roleplay'
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return
    
    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {replace: r, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   
         

    const user = message.author;
    const rp = await rpg.findOne({userID: user.id});
    if (!rp && rp.item !== null) return error(message, hm.noHero);
    if (rp.heroes.length !== 1){
      
      if (!args[0] || isNaN(args[0]) || Math.round(args[0]) <= 0 || Math.round(args[0]) > rp.heroes.length) return error(message, cm.specN)

      
      await rpg.updateOne({userID: message.author.id}, {$set: {item: rp.heroes[Math.round(args[0])-1].name}})  
        
      const rpp = await rpg.findOne({userID: message.author.id})  
        
      const item = heroes[rpp.item]

    return embed(message, `${r.done} - __${LANG.lang === "ru" ? item.nameRus : item.name}__.`);
      
  } else {
    return error(message, r.err);
  }

  }
};
