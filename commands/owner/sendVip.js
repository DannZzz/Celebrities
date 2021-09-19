const begModel = require("../../models/begSchema");
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN, AGREE } = require('../../config');
let ownerID = '382906068319076372';
const {error, embed, perms} = require("../../functions/functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "sendvip",
    description: "",
    category: "",
    aliases: "",
    accessableby: "Для разработчика.",
    usage: "[ID] [название] "
  },
  run: async (bot, message, args) => {
    
       
    try {
    if (message.member.user.id !== ownerID) return 
    if (!args[0]) return error(message, "Укажите участника.");

    let user = bot.users.cache.get(args[0]);
    let bag
    try {
      bag = await begModel.findOne({ userID: user.id });
    } catch {
      return error(message, "Данные не найдены.");
    }

    if(!args[1]) return error(message, "Укажите подарок.");
    const vips = ['vip-1', 'vip-2']
    if (!vips.includes(args[1])) return error(message, "Подарок не найден.");
    let giftType;
    if (args[1] === 'vip-1') {
      giftType = 'VIP-1';
      if(bag['vip1'] === false) {
        await begModel.findOneAndUpdate({userID: user.id}, {$set: {"vip1": true}})
        message.react(`${AGREE}`)
        return user.send({embeds: [embed(message, `**У вас подарок от разработчика!🎉**\n\n||---**${giftType}**---||`, "dm")]}).catch(()=> message.react('❌'))
      } else {
        return error(message, 'Пользователь уже имеет VIP 1.');

      }
    } else if (args[1] === 'vip-2') {
      giftType = 'VIP-2';
      if(bag['vip2'] === false) {
        await begModel.findOneAndUpdate({userID: user.id}, {$set: {"vip2": true}})
        message.react(`${AGREE}`)
        return user.send({embeds: [embed(message, `**У вас подарок от разработчика!🎉**\n\n||---**${giftType}**---||`, "dm")]}).catch(()=> message.react('❌'))
      } else {
        return error(message, 'Пользователь уже имеет VIP 2.');
      }

    }
  } catch (e) {
    console.log(e);
  }
  }
}
