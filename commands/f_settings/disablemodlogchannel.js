const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX, AGREE} = require("../../config");
const serverModel = require("../../models/serverSchema");
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
      config: {
        name: "откл-мод-лог-канал",
        description: "Изменить канал модерация.",
        usage: "[название текстового канала | упоминание | ID]",
        category: "f_settings",
        accessableby: "Нужна права: Администратор.",
        aliases: ["dis-mod-log-channel", "омлк", "dmlc", "dislogc"]
    },
    run: async (bot, message, args) => {
      let limited = rateLimiter.take(message.author.id)
      if(limited) return

      if (!perms(message, "ADMINISTRATOR")) return error(message, "У вас недостаточно прав.");
      let sd = await serverModel.findOne({ serverID: message.guild.id });
        try {
            let a = sd.modLog;

            if (!a) {
                return error(message, `Журнал модерации пока еще не установлен.`);
            } else {
              let channel = message.guild.channels.cache.get(a);
                bot.guilds.cache.get(message.guild.id).channels.cache.get(channel.id).send(`${AGREE} Журнал модерации отключен на этом канале.`);
                await serverModel.findOneAndUpdate({serverID: message.guild.id}, {$set: {modLog: undefined}})

                embed(message, `Успешно отключен канал модерации.`)
            }
        } catch {
            return error(message, "Недостаточно прав, либо канал не существует.");
        }
    }
};
