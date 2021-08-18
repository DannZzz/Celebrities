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
    name: "ранг-цвет",
    description: "Установить цвет для текста на ранг-карту.",
    category: "g_vip",
    aliases: ["rank-color"],
    accessableby: "Для всех",
    usage: "[цвет hex(#00ff00)]"
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return
       
    let bag = await begModel.findOne({userID: message.author.id});

    if(bag['vip1'] === false || bag['vip2'] === false) return error(message, "Эта команда доступна только для **VIP 2** пользователей.");

    if(!args[0]) return error(message, "Укажите цвет.\nПример: \`\`#ff00ff или ff00ff\`\`");

    embed(message, 'Успешно установлена новая картинка для ранг-карточки.\nОбратите внимание, что цвет указан правильно.');
    await vipModel.findOneAndUpdate({userID: message.author.id}, {$set: {rankColor: args[0]}})

  }
}
