const {MessageEmbed} = require('discord.js');
const {main} = require("../../JSON/colours.json");
const serverModel = require("../../models/serverSchema");
const {error, embed, perms} = require("../../functions/functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);

module.exports = {
    config: {
        name: "prefix",
        category: "f_settings",
        aliases: ["pr", 'префикс'],
        permissions: ["ADMINISTRATOR"]
    },
    run: async (bot, message, args) => {
      

      const getLang = require("../../models/serverSchema");
      const LANG = await getLang.findOne({serverID: message.guild.id});
      const {prefix: bb, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm} = require(`../../languages/${LANG.lang}`);   
      
        let sd = await serverModel.findOne({ serverID: message.guild.id });
        if (!args[0]) {

          let b = sd.prefix;
          if (b) {
        return embed(message, `${bb.now} \`${b}\``);
      } else return error(message, bb.err);
    }

        try {

            let a = args.join(' ');
            let b = sd.prefix;

            if (a === b) {
                return error(message, bb.err1)
            } else {
                await serverModel.findOneAndUpdate({serverID: message.guild.id}, {$set: {prefix: a}});

                return embed(message, `${bb.done} ${a}`)
            }
        } catch (e) {
            console.log(e)
        }
    }
}
