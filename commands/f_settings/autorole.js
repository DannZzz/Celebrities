const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX} = require("../../config");
const serverModel = require("../../models/serverSchema");
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
      config: {
        name: "автороль",
        description: "Установить автороль для сервера.",
        usage: "[Название роли | упоминание | ID]",
        category: "f_settings",
        accessableby: "Нужна права: Администратор.",
        aliases: ["autorole", "ar", "ар"]
    },
    run: async (bot, message, args) => {
      let limited = rateLimiter.take(message.author.id)
      if(limited) return

      if (!perms(message, "ADMINISTRATOR")) return error(message, "У вас недостаточно прав.");
      if (!message.guild.me.permissions.has("MANAGE_ROLES")) return error(message, "У меня недостаточно прав.");
      let sd = await serverModel.findOne({ serverID: message.guild.id });
        try {
          if(!args[0] && sd.autoRoleOn) {
            var role = member.guild.roles.cache.find(role => role.id == sd.autoRole);
            if (role) {
              return embed(message, `Авто-роль сервера: **${role.name}**\nУбедитесь что моя роль выше!`)
            }
          } else if (!args[0]) {
            return error(message, `Укажите роль!`)
          } else {
            let role = message.mentions.roles.first() || bot.guilds.cache.get(message.guild.id).roles.cache.get(args[0]) || message.guild.roles.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase());
            await serverModel.findOneAndUpdate({serverID: message.guild.id}, {$set: {autoRole: role.id, autoRoleOn: true}})
            embed(message, `Установлена авто-роль сервера: **${role.name}**\nУбедитесь что моя роль выше!`)
          }
        } catch {
            return error(message, "Недостаточно прав, либо роль не существует.");
        }
    }
};
