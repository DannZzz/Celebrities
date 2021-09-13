const heroes = require('../../JSON/heroes.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed } = require("discord.js");
const { COIN } = require("../../config");
const { checkValue } = require("../../functions");
const {error, embed, perms, firstUpperCase} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);

module.exports = {
  config: {
    name: "kill",
    aliases: "",
    category: 'h_roleplay',
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return

    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {kill: k, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   
   
       
    const user = message.author;
    let rp = await rpg.findOne({userID: user.id});
    if (!rp) return error(message, hm.noHero);
    let bag = await bd.findOne({ userID: user.id });
    if(rp.item !== null || rp.heroes.length === 0) {
      if (rp.heroes.length > 1) {
        if (!args[0]) return error(message, k.error)
        const type = firstUpperCase(args[0].toLowerCase())
        let get = rp.heroes.find(x => x.name === type)
        if (get) {
          let old = get.name
          
          rp.heroes.splice(rp.heroes.indexOf(get), 1)
          rp.save()
          if (type === rp.item) await rpg.findOneAndUpdate({userID: user.id}, {$set: {item: rp.heroes[0].name}})
        } else {
          return error(message, k.notHero)
        }

        
        const item = heroes[type]
        return embed(message, `${k.done} - __${LANG.lang === "ru" ? item.nameRus : item.name}__.`);
      } else {
        const item = heroes[rp.item]
        await rpg.findOneAndUpdate({userID: user.id}, {$set: {item: null}});
        
        rp.heroes.pop();
        rp.save();
      }
      const item = heroes[item]
    
    

    return embed(message, `${k.done} - __${LANG.lang === "ru" ? item.nameRus : item.name}__.`);

  } else {
    return error(message, hm.noHero);
  }

  }
};
