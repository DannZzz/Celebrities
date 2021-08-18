const begModel = require("../../models/begSchema");
const {error} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "канал",
    description: "Отправлять сообщение на указанном канале.",
    category: "g_vip",
    aliases: ["channel"],
    accessableby: "Нужна права: Администратор.",
    usage: "[упоминание канала] [ваше сообщение]"
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return
      
    let bag = await begModel.findOne({userID: message.author.id});

    let channel = message.mentions.channels.first();
    if(bag["vip1"] === false) return error(message, "Эта команда доступна только для **VIP 1** пользователей.");

    let arg = args.slice(1).join(" ")
    if (!message.member.hasPermission("ADMINISTRATOR")) return error(message, "У вас недостаточно прав.");
    if(!args[0]) return error(message, "Укажите #текстовый канал.");
    if(!arg) return error(message, "Укажите текст.");
    if(!channel) return error(message, "Укажите доступный #текстовый канал.");


    channel.send(arg)


  }
}
