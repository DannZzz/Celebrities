const rpg = require("../../models/rpgSchema");
const {MessageEmbed} = require("discord.js");
const heroes = require('../../JSON/heroes.json');
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN, AGREE } = require('../../config');
let ownerID = '382906068319076372';
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "sendhero",
    description: "",
    category: "",
    aliases: "",
    accessableby: "Для разработчика.",
    usage: "[ID] [название] "
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return
       
    try {
    if (message.member.user.id !== ownerID) return 
    if (!args[0]) return error(message, "Укажите участника.")

    let user = bot.users.cache.get(args[0]);
    let rp = await rpg.findOne({userID: user.id})
    if(!rp) {
      let newData = await rpg.create({
        userID: user.id
      });
      newData.save()
    }
    rp = await rpg.findOne({userID: user.id})
    if(rp.heroes.length >= 2) return error(message, "Участник имеет достаточно героев.")
    if(!args[1]) return error(message, "Укажите подарок.")
    const items = ["Zeenou", "Dilan", "Darius", "Selena", "Cthulhu", "Zeus", "PerfectDuo", "Eragon", "Ariel"];
    if (!items.includes(args[1])) return error(message, "Герой не найден.")
    let giftType = heroes[args[01]]

    await rpg.findOneAndUpdate({userID: user.id}, {$set: {item: giftType.name}})
    await rpg.findOneAndUpdate({userID: user.id}, {$set: {health: giftType.health}})
    await rpg.findOneAndUpdate({userID: user.id}, {$set: {damage: giftType.damage}})
    await rpg.findOneAndUpdate({userID: user.id}, {$set: {level: 1}})

    await rp.heroes.push({
      name: giftType.name,
      level: 1,
      health: giftType.health,
      damage: giftType.damage
      })
    rp.save()
  
    message.react(`${AGREE}`)
      //
    user.send({embeds: [embed(message, `**У вас подарок от разработчика!🎉**\n\n||---**${giftType.nameRus}**---||`, "dm")]}).catch(()=> message.react('❌'))


  } catch (e) {
    console.log(e);
  }
  }
}
