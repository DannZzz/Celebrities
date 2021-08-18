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
    name: "ранг-картина",
    description: "Поставить фото на свою ранг-карту.",
    category: "g_vip",
    aliases: ["rank-image"],
    accessableby: "Для всех",
    usage: "[ссылка на фотку]"
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return

    let bag = await begModel.findOne({userID: message.author.id});

    if(bag['vip1'] === false || bag['vip2'] === false) return error(message, "Эта команда доступна только для **VIP 2** пользователей.");

    if(!args[0]) return error(message, "Укажите ссылку");

    embed(message, 'Успешно установлена новая картинка для ранг-карточки.\nОбратите внимание, что ссылка указана правильно.');
    await vipModel.findOneAndUpdate({userID: message.author.id}, {$set: {rankImage: args[0]}})

  }
}
