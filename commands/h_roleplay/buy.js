const heroes = require('../../JSON/heroes.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed } = require("discord.js");
const { COIN, AGREE, STAR } = require("../../config");
const { checkValue } = require("../../functions");
const {error, embed, perms, firstUpperCase} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);
const ITEMS = require('../../JSON/items');

module.exports = {
  config: {
    name: "buy",
    aliases: ['get', "купить"],
    category: 'h_roleplay'
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return

    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {buy: b, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   
   
    const items = ["Mistress-forest", "Snake-woman", "Blazer", "Athena", "Atalanta", "Kumbhakarna", "Zeenou", "Dilan", "Darius", "Selena", "Cthulhu", "Zeus", "Perfect-duo", "Eragon", "Ariel", "Archangel", "Darkangel"];
    const user = message.author;
    const coinData = await pd.findOne({userID: user.id});
    let rp = await rpg.findOne({userID: user.id});
    if (!rp) {
      let newData = await rpg.create({
        userID: user.id,
        surviveLevel: 1
      });
      newData.save()
    }
    rp = await rpg.findOne({ userID: user.id });
    let bag = await bd.findOne({ userID: user.id });
    let profile = await pd.findOne({ userID: user.id });
    const author = coinData.drag
    let timeout;
    if (bag["vip2"] === true) { timeout = 86400000 * (3 / 2) } else {
      timeout = 86400000 * 3;
    }
    
    if (!args[0]) return error(message, b.specHero)

    if (!isNaN(args[0])) {
      const numbs = ["1", "2", "3", "4", "5", "6", "7", "8"];
      if (!numbs.includes(args[0])) return error(message, b.itemErr);
      let item;
      let value = 1
      if (args[1] || !isNaN(args[1])) value = Math.round(args[1]) 
      const it = args[0]
      if (it == 1) item = ITEMS.box
      if (it == 2) item = ITEMS.hlt
      if (it == 3) item = ITEMS.dmg
      if (it == 4) item = ITEMS.lvl
      if (it == 5) item = ITEMS.meat
      if (it == 6) item = ITEMS.pack1
      if (it == 7) item = ITEMS.pack2
      if (it == 8) item = ITEMS.pack3
      if (!item.cost) return error(message, b.noItem);
      const getCost = value * item.cost
      if (bag.stars < getCost) return error(message, noStar);

      await bd.updateOne({userID: user.id}, {$inc: {stars: -getCost}});

      if (it == 1) await rpg.updateOne({userID: user.id}, {$inc: {box: value}});
      if (it == 2) await rpg.updateOne({userID: user.id}, {$inc: {hlt: value}});
      if (it == 3) await rpg.updateOne({userID: user.id}, {$inc: {dmg: value}});
      if (it == 4) await rpg.updateOne({userID: user.id}, {$inc: {lvl: value}});
      if (it == 5) await rpg.updateOne({userID: user.id}, {$inc: {meat: value}});
      if (it == 6) await rpg.updateOne({userID: user.id}, {$inc: {pack1: value}});
      if (it == 7) await rpg.updateOne({userID: user.id}, {$inc: {pack2: value}});
      if (it == 8) await rpg.updateOne({userID: user.id}, {$inc: {pack3: value}});
      
      

      return message.react(AGREE)
    }
    
    if(args[0].toLowerCase() === "slot" || args[0].toLowerCase() === "place") {
      if(bag["vip2"] && rp.itemCount !== 10) {
        if(bag.stars >= 2000 * (rp.itemCount || 1)) {
          await bd.updateOne({userID: message.author.id}, {$inc: {stars: -(2000 * (rp.itemCount || 1))}})
          await rpg.updateOne({userID: message.author.id}, {$inc: {itemCount: 1}})
          return embed(message, b.donePlace)
        } else {
          return error(message, noStar + ` ${2000 * (rp.itemCount || 1)} ${STAR}`)
        }
      } else if(!bag["vip2"] && rp.itemCount === 5) {
        return error(message, vipTwo)
      } else {
        return error(message, b.errPlace)
      }
    }

    if (author !== null && timeout - (Date.now() - author) > 0) {
      let time = new Date(timeout - (Date.now() - author));

      return error(message, b.time(time));
    }
    
    const type = firstUpperCase(args[0].toLowerCase());
    if (!items.includes(type)) return error(message, b.nh)
      const item = heroes[type]

      if (item.vip === true) {
        if(bag["vip2"] !== true) {
          return error(message, b.vip);
        }
      }

      if (item.marry === true && !coinData.marryID) return error(message, b.love)

      if (rp.heroes.length === rp.itemCount) return error(message, b.place)
      const idk = rp.heroes.find(x => x.name === type) 
      if (idk) return error(message, b.already)

      if (item.costType === "star") {
        const stars = bag.stars
        if (item.cost > stars) {
          return error(message, b.error);
        }
        await bd.findOneAndUpdate({userID: user.id}, {$inc: {stars: -item.cost}});
        await pd.findOneAndUpdate({userID: user.id}, {$set: {drag: Date.now()}})
        await rpg.findOneAndUpdate({userID: user.id}, {$set: {item: type}});

        await rp.heroes.push({
          name: type,
          health: item.health,
          damage: item.damage,
          level: 1
        })
        rp.save()
        
        return embed(message, b.done(LANG.lang === "ru" ? item.nameRus : item.name));
      } else {
        return error(message, b.not);
      }

   
    //

  }
};
