const begModel = require("../../models/begSchema");
const { MessageEmbed } = require('discord.js');
const {greenlight, redlight, main} = require('../../JSON/colours.json');
const { COIN, BANK, STAR } = require('../../config');
const profileModel = require("../../models/profileSchema");
const vipModel = require("../../models/vipSchema");
const {error, embed, perms} = require("../../functions/functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);

module.exports = {
  config: {
    name: "rank-color",
    category: "g_vip",
    aliases: ['ранг-цвет'],
  },
  run: async (bot, message, args) => {
    
      const getLang = require("../../models/serverSchema");
      const LANG = await getLang.findOne({serverID: message.guild.id});
      const {"rank-color": b, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm} = require(`../../languages/${LANG.lang}`);   
      
    let bag = await begModel.findOne({userID: message.author.id});

    if(!bag['vip2']) return error(message, vipTwo);

    if(!args[0]) return error(message, b.error);

    embed(message, b.done);
    await vipModel.findOneAndUpdate({userID: message.author.id}, {$set: {rankColor: args[0]}})

  }
}
