const begModel = require("../../models/begSchema");
const {error} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);

module.exports = {
  config: {
    name: "channel",
    category: "g_vip",
    aliases: "",
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return

      const getLang = require("../../models/serverSchema");
      const LANG = await getLang.findOne({serverID: message.guild.id});
      const {channel: c, specify, specifyT, vipOne, vipTwo, maxLimit, perm} = require(`../../languages/${LANG.lang}`);   
      
    let bag = await begModel.findOne({userID: message.author.id});

    let channel = message.mentions.channels.first();
    if(bag["vip1"] === false) return error(message, vipOne);

    let arg = args.slice(1).join(" ")
    if (!message.member.permissions.has("ADMINISTRATOR")) return error(message, perm);
    if(!args[0]) return error(message, c.error1);
    if(!arg) return error(message, specifyT);
    if(!channel) return error(message, c.error2);


    channel.send(arg)


  }
}
