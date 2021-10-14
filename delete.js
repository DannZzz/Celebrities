const {MessageEmbed} = require("discord.js")
const {PREFIX} = require("../../config");
const customModel = require("../../models/customSchema");
const {error, embed, perms} = require("../../functions/functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);

module.exports = {
      config: {
        name: "delete",
        category: "f_settings",
        aliases: ['удалить'],
        permissions: ["ADMINISTRATOR"]
    },
    run: async (bot, message, args) => {
      

      const getLang = require("../../models/serverSchema");
      const LANG = await getLang.findOne({serverID: message.guild.id});
      const {delete: b, waiting, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm} = require(`../../languages/${LANG.lang}`);   
     
      if (!args[0]) return error(message, b.name)
      let cmd = args[0]

      let data = await customModel.findOne({ serverID: message.guild.id, command: cmd }, async(err, data) => {
        if(err) throw err;
        if(data) {
          data.delete()
          embed(message, `${b.done} — **${cmd}**.`)
        } else if(!data) {
          error(message, b.err(cmd))
        }
      });


    }
};
