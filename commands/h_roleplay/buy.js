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
    name: "buy",
    aliases: ['get'],
    category: 'h_roleplay'
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return

    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {buy: b, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   
   
    const items = ["Athena", "Atalanta", "Kumbhakarna", "Zeenou", "Dilan", "Darius", "Selena", "Cthulhu", "Zeus", "Perfect-Duo", "Eragon", "Ariel", "Archangel", "Darkangel"];
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
    if (bag["vip2"] === true) { timeout = 86400000 * 4 / 2 } else {
      timeout = 86400000 * 4;
    }
    if (author !== null && timeout - (Date.now() - author) > 0) {
        let time = new Date(timeout - (Date.now() - author));

        return error(message, b.time(time));
    }
    if (!args[0]) return error(message, b.specHero)
    if(args[0].toLowerCase() === "slot" || args[0].toLowerCase() === "place") {
      if(!profile.allowMultiHeroes) {
        if(bag.stars >= 2000) {
          await bd.updateOne({userID: message.author.id}, {$inc: {stars: -2000}})
          await pd.updateOne({userID: message.author.id}, {$set: {allowMultiHeroes: true}})
          return embed(message, b.donePlace)
        } else {
          return error(message, noStar)
        }
      } else {
        return error(message, b.errPlace)
      }
    }
    const type = firstUpperCase(args[0]);
    if (!items.includes(type)) return error(message, b.nh)
    if (rp.heroes.length !== 2 && rp.heroes.length < 2) {
      const item = heroes[type]

      if (item.vip === true) {
        if(bag["vip2"] !== true) {
          return error(message, b.vip);
        }
      }

      if (item.marry === true && !coinData.marryID) return error(message, b.love)

      if (rp.heroes.length === 1 && !coinData.allowMultiHeroes) return error(message, b.place)

      if (rp.heroes.length === 1 && rp.heroes[0].name === type) return error(message, b.already)

      if (item.costType === "star") {
        const stars = bag.stars
        if (item.cost > stars) {
          return error(message, b.error);
        }
        await bd.findOneAndUpdate({userID: user.id}, {$inc: {stars: -item.cost}});
        await pd.findOneAndUpdate({userID: user.id}, {$set: {drag: Date.now()}})
        await rpg.findOneAndUpdate({userID: user.id}, {$set: {item: type}});
        await rpg.findOneAndUpdate({userID: user.id}, {$set: {health: item.health}});
        await rpg.findOneAndUpdate({userID: user.id}, {$set: {level: 1}});
        await rpg.findOneAndUpdate({userID: user.id}, {$set: {damage: item.damage}});

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

    } else {
      return error(message, b.err);

    }
    //

  }
};
