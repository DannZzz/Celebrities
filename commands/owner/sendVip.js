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
    dev: true
  },
  run: async (bot, message, args) => {
    
       
    try {
    if (!args[0]) return error(message, "Укажите участника.");

    let user = bot.users.cache.get(args[0]);
    let bag
    try {
      bag = await begModel.findOne({ userID: user.id });
    } catch {
      return error(message, "Данные не найдены.");
    }

    if(!args[1]) return error(message, "Укажите подарок.");
    const vips = ['vip', 'premium']
    if (!vips.includes(args[1])) return error(message, "Подарок не найден.");
    let giftType;
    if (args[1] === 'vip') {
      giftType = 'VIP';
      if(bag['vip1'] === false) {
        await begModel.findOneAndUpdate({userID: user.id}, {$set: {"vip1": true}})
        message.react(`${AGREE}`)
        return user.send({embeds: [embed(message, `**You have a gift!🎉**\n\n||---**${giftType}**---||`, "dm")]}).catch(()=> message.react('❌'))
      } else {
        return error(message, 'Пользователь уже имеет VIP.');

      }
    } else if (args[1] === 'premium') {
      giftType = 'PREMIUM';
      if(bag['vip2'] === false) {
        await begModel.findOneAndUpdate({userID: user.id}, {$set: {"vip1": true}})
        await begModel.findOneAndUpdate({userID: user.id}, {$set: {"vip2": true}})
        message.react(`${AGREE}`)
        return user.send({embeds: [embed(message, `**You have a gift!🎉**\n\n||---**${giftType}**---||`, "dm")]}).catch(()=> message.react('❌'))
      } else {
        return error(message, 'Пользователь уже имеет Premium.');
      }

    }
  } catch (e) {
    console.log(e);
  }
  }
}
