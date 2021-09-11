const begModel = require("../../models/begSchema");
const { MessageEmbed } = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR } = require('../../config');
const profileModel = require("../../models/profileSchema");
const vipModel = require("../../models/vipSchema");
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);
const {isWebUri} = require('valid-url');

module.exports = {
  config: {
    name: "profile-image",
    category: "g_vip",
    aliases: "",
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return

      const getLang = require("../../models/serverSchema");
      const LANG = await getLang.findOne({serverID: message.guild.id});
      const {"profile-image": b, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm} = require(`../../languages/${LANG.lang}`);   
      
    let bag = await begModel.findOne({userID: message.author.id});

    if(!bag['vip2']) return error(message, vipTwo);

    if(!args[0] || !isWebUri(args[0])) return error(message, specifyL);

    embed(message, b.done);
    await vipModel.findOneAndUpdate({userID: message.author.id}, {$set: {profileImage: args[0]}})

  }
}
