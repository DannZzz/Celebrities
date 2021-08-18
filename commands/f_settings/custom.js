const {MessageEmbed} = require("discord.js")
const {PREFIX} = require("../../config");
const customModel = require("../../models/customSchema");
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
      config: {
        name: "команда",
        description: "Создать пользовательскую команду.",
        usage: "[название команды] [сообщение ответа]",
        category: "f_settings",
        accessableby: "Нужна права: Администратор.",
        aliases: ["custom", "command"]
    },
    run: async (bot, message, args) => {
      let limited = rateLimiter.take(message.author.id)
      if(limited) return

      if (!perms(message, "ADMINISTRATOR")) return error(message, "У вас недостаточно прав.");

      if (!args[0]) return error(message, 'Укажите название.');
      if (!args[1]) return error(message, 'Укажите сообщение.');
      let cmd = args[0]
      let cnt = args.splice(1).join(" ")

      let data = await customModel.findOne({ serverID: message.guild.id, command: cmd }, async(err, data) => {
        if(err) throw err;
        if(data) {
          data.content = cnt;
          data.save();
          embed(message, `Успешно обновлена команда **${cmd}**.`)
        } else if(!data) {
          let newdata = await customModel.create({
            serverID: message.guild.id,
            command: cmd,
            content: cnt
          })
          newdata.save();
          embed(message, `Успешно создана новая команда **${cmd}**.`)
        }
      });


    }
};
