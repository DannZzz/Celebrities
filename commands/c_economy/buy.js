
const sd = require('../../models/serverSchema.js')
const bd = require('../../models/begSchema.js')
const pd = require('../../models/profileSchema.js')
const mc = require('discordjs-mongodb-currency');
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "купить",
    description: "Купить роли на сервере.",
    category: "c_economy",
    aliases: ['buy'],
    accessableby: "Для всех",
    usage: "[номер предмета]"
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return
    
    const profileData = await pd.findOne({userID: message.author.id})
    const user = await mc.findUser(message.author.id, message.guild.id)
    const servData = await sd.findOne({serverID: message.guild.id})
    const begdata = await bd.findOne({userID: message.author.id})
    if(!args[0]) return error(message, "Укажите предмет.");
    if(args[0].toLowerCase() === "место" || args[0].toLowerCase() === "place") {
      if(!profileData.allowMultiHeroes) {
        if(begdata.stars >= 2000) {
          await bd.updateOne({userID: message.author.id}, {$inc: {stars: -2000}})
          await pd.updateOne({userID: message.author.id}, {$set: {allowMultiHeroes: true}})
          return embed(message, "Вы успешно купили дополнительное место для героев.")
        } else {
          return error(message, "У вас недостаточно звёзд.")
        }
      } else {
        return error(message, "Вы уже купили дополнительное место.")
      }
    }
    if (isNaN(args[0])) return error(message, "Укажите номер предмета, который хотите купить.");
    if (args[0] > servData.shop.length) return error(message, "Предмет не найден.");
    if(args[0].toLowerCase() === "место" || args[0].toLowerCase() === "place") {

    }
    const resp = args[0] - 1
    const item = servData.shop[resp]
    if(isNaN(item.Cost) || item.Cost === null) return error(message, "Предмет полностью не готов.");
    if(!message.guild.roles.cache.get(item.Role)) return error(message, "Предмет не имеет роль.");
    if(item.Cost > user.coinsInWallet) return error(message, "У вас недостаточно денег.");
    if(message.member.roles.cache.get(item.Role)) return error(message, `Вы уже имеете эту роль.`);
    try {
      let role = message.guild.roles.cache.get(item.Role);
      await message.member.roles.add(role)
      if(!message.member.manageable && !role.editable) return error(message, `Я не могу выдать роль.`);
    } catch (e) {
      return error(message, `Роль не найдена, либо я не могу выдать.`);
    }

    await mc.deductCoins(message.author.id, message.guild.id, item.Cost)
    return embed(message, `Вы успешно купили себе новую роль!`)
  }
}
