const vipModel = require("../../models/vipSchema");
const profileModel = require("../../models/profileSchema");
const begModel = require("../../models/begSchema");
const serverModel = require("../../models/serverSchema");
const fishes = require('../../JSON/fishes.json');
const { MessageEmbed } = require('discord.js');
const {greenlight, redlight, main} = require('../../JSON/colours.json');
const { COIN, BANK, STAR } = require('../../config');
const {error, embed, perms} = require("../../functions/functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);

module.exports = {
  config: {
    name: 'sell',
    aliases: ['продать'],
    category: 'h_roleplay',
  },
  run: async (bot, message, args) => {
    

    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {sell: s, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   
     
      let bal = await profileModel.findOne({userID: message.author.id});
      let bag = await begModel.findOne({userID: message.author.id});
      let sd = await serverModel.findOne({serverID: message.guild.id})
      let fish_sell;
      let rarity;
      let money;
      let cost;

      if (args[0] === '1') {
        fish_sell = bag.junk;
        cost = 1
        rarity = fishes['junk']
      }
      else if (args[0] === '2') {
        fish_sell = bag.common;
        cost = 2
        rarity = fishes['common']
      }
      else if (args[0] === '3') {
        fish_sell = bag.uncommon;
        cost = 3
        rarity = fishes['uncommon']
      }
      else if (args[0] === '4') {
        fish_sell = bag.rare;
        cost = 4
        rarity = fishes['rare']
      }
      else if (args[0] === '5') {
        fish_sell = bag.legendary;
        cost = 5
        rarity = fishes['legendary']
      } else {
        return error(message, `${s.err} **${sd.prefix}fish list**`);
      }
      const xx = fish_sell
      let exCost;
      if(bag['vip1']) exCost = cost + (cost / 3);
      if(xx === 0) return error(message, s.err1);
      if(xx < 10) money = cost * xx;
      else if (xx < 100) money = exCost * xx;
      else if (xx > 100) money = exCost * xx * (exCost / 2);

      if (args[0] === '1') await begModel.findOneAndUpdate({userID: message.author.id},{$set: {junk: 0}});
      else if (args[0] === '2') await begModel.findOneAndUpdate({userID: message.author.id},{$set: {common: 0}});
      else if (args[0] === '3') await begModel.findOneAndUpdate({userID: message.author.id},{$set: {uncommon: 0}});
      else if (args[0] === '4') await begModel.findOneAndUpdate({userID: message.author.id},{$set: {rare: 0}});
      else if (args[0] === '5') await begModel.findOneAndUpdate({userID: message.author.id},{$set: {legendary: 0}});
      await begModel.findOneAndUpdate({userID: message.author.id}, {$inc: {stars: Math.floor(money)}});

      embed(message, `${s.d1} **${xx}**${rarity.symbol} ${s.d2} **${Math.floor(money)} ${STAR}**`);

  }
}
