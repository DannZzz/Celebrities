const rpg = require("../../models/rpgSchema");
const {MessageEmbed} = require("discord.js");
const heroes = require('../../JSON/heroes.json');
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN, AGREE } = require('../../config');
let ownerID = '382906068319076372';
const {error, embed, perms, firstUpperCase} = require("../../functions/functions");
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
    if(rp.heroes.length === rp.itemCount) return error(message, "Участник имеет достаточно героев.")

    
    
    if(!args[1]) return error(message, "Укажите подарок.")
    const items = ["Zero", "Horus", "Thoth-amon", "Anubis", "Sebek", "Hathor", "Supernatural-ramses", "Hunter", "Broken", "Mistress-forest", "Snake-woman", "Blazer", "Athena", "Atalanta", "Kumbhakarna", "Zeenou", "Dilan", "Darius", "Selena", "Cthulhu", "Zeus", "Perfect-duo", "Eragon", "Ariel", "Archangel", "Darkangel"];
    if (!items.includes(firstUpperCase(args[1].toLowerCase()))) return error(message, "Герой не найден.")
    let giftType = heroes[firstUpperCase(args[01].toLowerCase())]
    let get = rp.heroes.find(x => x.name === giftType.name) 
    if (get) return error(message, "Участник уже имеет этого героя.")
    await rpg.findOneAndUpdate({userID: user.id}, {$set: {item: giftType.name}})
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
