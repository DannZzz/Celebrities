const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
let ownerID = '382906068319076372';
let dariusID = '873237782825422968';
const { COIN, BANK } = require('../../config');
const profileModel = require("../../models/profileSchema");
const mc = require('discordjs-mongodb-currency');
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "убрать",
    description: "Убрать кол-во денег от участника.",
    category: "c_economy",
    aliases: ["rmoney", "remove-money", "уб"],
    accessableby: "Нужна права: Администратор.",
    usage: "[никнейм участника | упоминание | ID] [кол-во монет] "
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return
      
    if (!perms(message, "ADMINISTRATOR")) return error(message, "У вас недостаточно прав.");

    if (!args[0]) return error(message, "Укажите участника.");

    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
    if(!args[1]) return error(message, "Укажите кол-во монет, чтобы убрать.");
    if(isNaN(args[1])) return error(message, "Укажите кол-во монет в виде, чтобы убрать.");

    await mc.deductCoins(user.id, message.guild.id, Math.floor(args[1]))

    embed(message, `Изменение баланса: Удаление <@${user.id}>\n\nУбрано: ${COIN}**${Math.floor(args[1])}**`, false);
  }
}
