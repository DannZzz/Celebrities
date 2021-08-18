const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const {PREFIX, AGREE} = require("../../config");
const serverModel = require("../../models/serverSchema");
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
      config: {
        name: "мод-лог-канал",
        description: "Установить канал модерации.",
        usage: "[название текстового канала | упоминание | ID]",
        category: "f_settings",
        accessableby: "Нужна права: Администратор.",
        aliases: ["mod-log-channel", "млк", "mlc", "logc"]
    },
    run: async (bot, message, args) => {
      let limited = rateLimiter.take(message.author.id)
      if(limited) return

      if (!perms(message, "ADMINISTRATOR")) return error(message, "У вас недостаточно прав.");
      if (!message.guild.me.permissions.has("MANAGE_CHANNELS")) return error(message, "У меня недостаточно прав.");
      let sd = await serverModel.findOne({ serverID: message.guild.id });
    if (!args[0]) {

      let b = await sd.modLog;
      let channelName = message.guild.channels.cache.get(b);
      if (message.guild.channels.cache.has(b)) {
        return embed(message,
          `${AGREE} Журнал модерации установлен на: <#${channelName.id}>`
        );
      } else
        return error(message,
          "Укажите доступный тектовый канал."
        );
    }
        let channel = message.mentions.channels.first() || bot.guilds.cache.get(message.guild.id).channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase());

        if (!channel || channel.type !== 'GUILD_TEXT') return error(message, "Укажите доступный текстовый канал.");

        try {
            let a = sd.modLog;

            if (channel.id === a) {
                return message.channel.send(`${AGREE} <#${channel.id}> этот канал уже установлен для модерации.`);
            } else {
                bot.guilds.cache.get(message.guild.id).channels.cache.get(channel.id).send(`${AGREE} Журнал модерации установлен на этот канал.`);
                await serverModel.findOneAndUpdate({serverID: message.guild.id}, {$set: {modLog: channel.id}})

                embed(message, `<#${channel.id}> установлен новый канал для модерации.`);
            }
        } catch {
            return error(message, "Недостаточно прав, либо канал не существует.");
        }
    }
};
