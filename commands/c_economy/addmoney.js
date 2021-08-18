const { COIN } = require('../../config');
const mc = require('discordjs-mongodb-currency');
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "добавить",
    description: "Добавить кол-во денег участнику.",
    category: "c_economy",
    aliases: ["addm", "addmoney", "доб"],
    accessableby: "Нужна права: Администратор.",
    usage: "[никнейм участника | упоминание | ID] [кол-во монет] "
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
    if(limited) return
      
    if (!perms(message, "ADMINISTRATOR")) return error(message, "У вас недостаточно прав.");
    if (!args[0]) return error(message, "Укажите участника.");

    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());


    if(!args[1]) return error(message, "Укажите кол-во монет, чтобы добавить.");
    if(isNaN(args[1])) return error(message, "Укажите кол-во монет в виде, чтобы добавить.");
    if(args[1] > 1000000000) return error(message, "Укажите число меньше **1.000.000.000**.");
    if(args[1] < 10) return error(message, "Укажите число больше **10**.");


    await mc.giveCoins(user.id, message.guild.id, Math.floor(args[1]))

    embed(message, `Изменение баланса: Добавление <@${user.id}>\n\nДобавлено: ${COIN}**${Math.floor(args[1])}**`, false)
  }
}
