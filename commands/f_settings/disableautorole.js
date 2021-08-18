const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX, DISAGREE, AGREE} = require("../../config");
const serverModel = require("../../models/serverSchema");
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
      config: {
        name: "откл-автороль",
        description: "Отключить автороль для сервера.",
        usage: "[Название роли | упоминание | ID]",
        category: "f_settings",
        accessableby: "Нужна права: Администратор.",
        aliases: ["dis-autorole", "dar", "оар"]
    },
    run: async (bot, message, args) => {
      let limited = rateLimiter.take(message.author.id)
      if(limited) return

      if (!perms(message, "ADMINISTRATOR")) return error(message, "У вас недостаточно прав.");
      let sd = await serverModel.findOne({ serverID: message.guild.id });
        try {
          if(sd.autoRoleOn === false) {

            return error(message, `Авто-роль и так отключена.`)

          }  else {

            await serverModel.findOneAndUpdate({serverID: message.guild.id}, {$set: {autoRoleOn: false}})
            embed(message, `Отключена авто-роль сервера.`);
          }

        } catch {
            return error(message, "Недостаточно прав.");
        }
    }
};
