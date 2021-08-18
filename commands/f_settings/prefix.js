const {MessageEmbed} = require('discord.js');
const {cyan} = require("../../JSON/colours.json");
const serverModel = require("../../models/serverSchema");
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
    config: {
        name: "префикс",
        description: "Поменять префикс сервера.",
        usage: "[новый префикс]",
        category: "f_settings",
        accessableby: "Нужна права: Управление сервером.",
        aliases: ["prefix", "pr"]
    },
    run: async (bot, message, args) => {
      let limited = rateLimiter.take(message.author.id)
      if(limited) return

        if (!perms(message, "MANAGE_SERVER")) return error(`У вас недостаточно прав.`)
        let sd = await serverModel.findOne({ serverID: message.guild.id });
        if (!args[0]) {

          let b = sd.prefix;
          if (b) {
        return embed(message, `👀 Префикс сервера: \`${b}\``);
      } else return error("Пожалуйста, укажите новый префикс.");
    }

        try {

            let a = args.join(' ');
            let b = sd.prefix;

            if (a === b) {
                return error("Этот префикс уже установлен.")
            } else {
                await serverModel.findOneAndUpdate({serverID: message.guild.id}, {$set: {prefix: a}});

                return embed(message, `Новый префикс сервера: ${a}`)
            }
        } catch (e) {
            console.log(e)
        }
    }
}
