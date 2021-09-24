const heroes = require('../../JSON/heroes.json');
const enemies = require('../../JSON/enemies.json');
const { main } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const clan = require("../../models/clanSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed } = require("discord.js");
const { COIN, STAR, CLAN } = require("../../config");
const {error, embed, perms, firstUpperCase} = require("../../functions/functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);

module.exports = {
  config: {
    name: "join",
    aliases: ['вступить'],
    category: 'h_roleplay',
  },
  run: async (bot, message, args) => {
    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {join: j, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   
   
    

    const data = await pd.findOne({userID: message.author.id})
    const user = message.author;
    const bag = await bd.findOne({userID: user.id})
    let rp = await rpg.findOne({userID: user.id});

    if (!rp) {
      let newData = await rpg.create({
        userID: user.id,
      })
      newData.save()
    }
    
    rp = await rpg.findOne({userID: user.id});
    
    let [a1] = args
    let author = await data.join;
      let timeout;
      if (bag["vip2"] === true) { timeout = 1800 * 1000; } else {
        timeout = 3559 * 1000;
      }
      if (author !== null && timeout - (Date.now() - author) > 0) {
          let time = new Date(timeout - (Date.now() - author));
  
          return error(message, j.time(time));
      }
    if (!a1) return error(message, cm.specN);
    let getClan = await clan.findOne({ID: a1});
    if (!getClan) return error(message, cm.notCLan);

    const members = await rpg.find({clanID: a1});
    if(rp.clanID !== null) return error(message, cm.clan);
    if (!getClan.appsStatus) return error(message, j.offed);
    if(getClan.space === members) return error(message, j.limit);
    const get = rp.heroes.find(x => x.name === rp.item)
    await getClan.apps.unshift({
      tag: message.author.tag,
      hero: rp.item || cm.noHero,
      level: get ? get.level : "—",
      id: message.author.id
    })
    getClan.save()

    await pd.updateOne({userID: message.author.id}, {$set: {join: Date.now()}})
    return embed(message, j.done);
    
    }
}