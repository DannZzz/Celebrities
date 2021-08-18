const {MessageEmbed} = require("discord.js")
const {PREFIX} = require("../../config");
const customModel = require("../../models/customSchema");
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
      config: {
        name: "удалить",
        description: "Удалить пользовательскую команду.",
        usage: "[название команды]",
        category: "f_settings",
        accessableby: "Нужна права: Администратор.",
        aliases: ["delete"]
    },
    run: async (bot, message, args) => {
      let limited = rateLimiter.take(message.author.id)
      if(limited) return

      if (!perms(message, "ADMINISTRATOR")) return error(message, "У вас недостаточно прав.");
      if (!args[0]) return error(message, 'Укажите название.')
      let cmd = args[0]

      let data = await customModel.findOne({ serverID: message.guild.id, command: cmd }, async(err, data) => {
        if(err) throw err;
        if(data) {
          data.delete()
          embed(message, `Успешно удалена команда **${cmd}**.`)
        } else if(!data) {
          error(message, `Команда **${cmd}** не найдена.`)
        }
      });


    }
};
