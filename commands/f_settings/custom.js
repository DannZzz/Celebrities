const {MessageEmbed} = require("discord.js")
const {PREFIX} = require("../../config");
const customModel = require("../../models/customSchema");
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);

module.exports = {
      config: {
        name: "custom",
        category: "f_settings",
        aliases: ["command", 'команда']
    },
    run: async (bot, message, args) => {
      let limited = rateLimiter.take(message.author.id)
      if(limited) return

      const getLang = require("../../models/serverSchema");
      const LANG = await getLang.findOne({serverID: message.guild.id});
      const {custom: b, waiting, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm} = require(`../../languages/${LANG.lang}`);   
     
      
      if (!perms(message, "ADMINISTRATOR")) return error(message, perm);

      if (!args[0]) return error(message, b.name);
      if (!args[1]) return error(message, b.resp);
      let cmd = args[0]
      let cnt = args.splice(1).join(" ")

      let data = await customModel.findOne({ serverID: message.guild.id, command: cmd }, async(err, data) => {
        if(err) throw err;
        if(data) {
          data.content = cnt;
          data.save();
          embed(message, `${b.updated} — **${cmd}**.`)
        } else if(!data) {
          let newdata = await customModel.create({
            serverID: message.guild.id,
            command: cmd,
            content: cnt
          })
          newdata.save();
          embed(message, `${b.done} — **${cmd}**.`)
        }
      });


    }
};
