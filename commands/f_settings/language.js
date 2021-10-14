const { updateOne } = require("../../models/serverSchema");
const {MessageEmbed} = require('discord.js');
const {main} = require("../../JSON/colours.json");
const serverModel = require("../../models/serverSchema");
const {error, embed, perms} = require("../../functions/functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);

module.exports = {
    config: {
      name: "language",
      aliases: ["lang", 'язык'],
      category: "f_settings",
      permissions: ["ADMINISTRATOR"]
    },
    run: async (bot, message, args) => {
      

      let getLang = require("../../models/serverSchema");
      let LANG = await getLang.findOne({serverID: message.guild.id});
      let {language: cl, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`); 
         
      const langs = ["ru", "en"];
      if (!args[0] || !langs.includes(args[0].toLowerCase())) return error(message, cl.err)
      

      await getLang.updateOne({serverID: message.guild.id}, {$set: {lang: args[0].toLowerCase()}})
      getLang = require("../../models/serverSchema");
      LANG = await getLang.findOne({serverID: message.guild.id});
      let {language: cll} = require(`../../languages/${LANG.lang}`); 
       
      embed(message, cll.done)
    }
}