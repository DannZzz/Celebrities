const begModel = require("../../models/begSchema");
const { MessageEmbed } = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR } = require('../../config');
const profileModel = require("../../models/profileSchema");
const vipModel = require("../../models/vipSchema");
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "эмбед",
    description: "Отправлять сообщение на указанном канале в формате EMBED.",
    category: "g_vip",
    aliases: ["embed"],
    accessableby: "Нужна права: Администратор.",
    usage: "[упоминание канала] [цвет] [ваше сообщение]"
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return
       
    let bag = await begModel.findOne({userID: message.author.id});

    let channel = message.mentions.channels.first();
    if(bag["vip1"] === false) return error(message, "Эта команда доступна только для **VIP 1** пользователей.");

    let arg = args.slice(2).join(" ")
    if (!perms(message, "ADMINISTRATOR")) return error(message, "У вас недостаточно прав.");
    if(!args[0]) return error(message, "Укажите #текстовый канал.");
    if(!args[1]) return error(message, "Укажите цвет эмбед.");
    if(!arg) return error(message, "Укажите текст.");
    if(!channel) return error(message, "Укажите доступный #текстовый канал.");
    let doEmbed = new MessageEmbed()
    .setColor(`${args[1]}`)
    .setTimestamp()
    .setDescription(arg)

    channel.send({embeds: [doEmbed]})


  }
}
