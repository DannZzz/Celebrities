const Discord = require('discord.js');
const {cyan} = require('../../JSON/colours.json');
const serverModel = require("../../models/serverSchema");
const begModel = require("../../models/begSchema");
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
      config: {
        name: "приветствие",
        description: "Установить приветствие сервера.",
        usage: "[действие] (параметр)",
        category: "f_settings",
        accessableby: "Нужна права: Администратор.",
        aliases: ["welcome"]
    },
    run: async (bot, message, args) => {
      let limited = rateLimiter.take(message.author.id)
      if(limited) return

      if (!perms(message, "ADMINISTRATOR")) return error(message, "У вас недостаточно прав.")
      if (!args[0]) return error(message, `Укажите действие!\n\`\`?приветствие лист\`\`\n\`\`Действия: картина, текст, цвет, канал\`\``)
      const option = args[0];
      const serverData = await serverModel.findOne({serverID: message.guild.id});
      if (option === 'on' || option === 'включить') {
        if(serverData.welcome === false) {
          serverData.welcome = true
          serverData.save()
          return embed(message, `Приветствие успешно включено.`)
        } else {
          return error(message, `Приветствие и так включено.`)
        }
      } else if (option === 'off' || option === 'отключить') {
        if(serverData.welcome === true) {
          serverData.welcome = false
          serverData.save()
          return embed(message, `Приветствие успешно отключено.`)
        } else {
          return error(message, `Приветствие и так отключено.`)
        }
      } else if (option === 'list' || option === 'лист') {
        return message.channel.send(`
          \`\`Установленные действия.\`\`
          Картина - ${`[Ссылка](${serverData.welcomeImage})` || `Не установлена.`}
          Текст - \`\`${serverData.welcomeText || `Не установлен.`}\`\`
          Канал - ${message.guild.channels.cache.get(serverData.welcomeChannel) || `\`\`Не установлен.\`\``}
          Цвет - \`\`${serverData.welcomeColor || `Не установлен.`}\`\`
          `)
      }
      if (!args[1]) return error(message, `Укажите параметр действий.\n\`\`Например: ?приветствие картина хелп\`\``)
      const prop = args.splice(1).join(' ');
      const checkVip = await begModel.findOne({userID: message.author.id});


      if (option === 'картина' || option === 'image') {
        if(checkVip['vip2']) {
          if(prop === 'help' || prop === 'хелп') {
            return message.channel.send(`
              \`\`?приветствие картина [ссылка на картину, можно и гифку]\`\`
              `)
          } else {
            serverData.welcomeImage = prop;
            serverData.save()
            embed(message, `Успешно установлена картина для приветствие.`)
          }
        } else {
          return error(message, `Эта команда доступна только для **VIP 2** пользователей.`)
        }
      } else if (option === 'текст' || option === 'text') {
        if(prop === 'help' || prop === 'хелп') {
          return message.channel.send(`
            \`\`?приветствие текст [текст приветствий]\`\`
            `)
        } else {
          serverData.welcomeText = `${prop}`;
          serverData.save()
          embed(message, `Успешно установлен текст сообщений для приветствие.`)
        }
      } else if (option === 'color' || option === 'цвет') {
        if(prop === 'help' || prop === 'хелп') {
          return message.channel.send(`
            \`\`?приветствие цвет [цвет EMBED (Например: #0f0f0f)]\`\`
            `)
        } else {
          serverData.welcomeColor = prop;
          serverData.save()
          embed(message, `Успешно установлен цвет сообщений для приветствие.`)
        }
      } else if (option === 'канал' || option === 'channel') {
        if(prop === 'help' || prop === 'хелп') {
          return message.channel.send(`
            \`\`?приветствие канал [название текстового канала | упоминание | ID]\`\`
            `)
        } else {
          let channel = message.mentions.channels.first() || bot.guilds.cache.get(message.guild.id).channels.cache.get(args[1]) || message.guild.channels.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase());
          if (!channel) return error(message, `Канал не найден!`)
          serverData.welcomeChannel = channel.id;
          serverData.save()
          embed(message, `Успешно установлен канал сообщений для приветствие.`)
        }
      } else {
        return error(message, 'Действие не найдено!')
      }

    }
}
