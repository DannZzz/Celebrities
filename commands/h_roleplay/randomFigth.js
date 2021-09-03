const heroes = require('../../JSON/heroes.json');
const fights = require('../../JSON/fights.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed } = require("discord.js");
const { COIN, STAR } = require("../../config");
const { checkValue } = require("../../functions");
const mc = require('discordjs-mongodb-currency');
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "random",
    aliases: ['рандом'],
    category: 'h_roleplay',
    description: "Пойти в поединок с рандомным героем.",
    usage: "<ставка>",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return
       
    const bag = await bd.findOne({ userID: message.author.id });
    const profileData = await pd.findOne({ userID: message.author.id });

    let author = profileData.random;
    let timeout;
    if (bag["vip2"] === true) { timeout = 70 * 1000; } else {
      timeout = 140 * 1000;
    }
    if (author !== null && timeout - (Date.now() - author) > 0) {
        let time = new Date(timeout - (Date.now() - author));

        return error(message, `Попробуй еще раз через **${time.getMinutes()} минут ${time.getSeconds()} секунд.**.`);
    }
    let a = Math.round(Math.random() * 6) + 1
    let mgs = await message.channel.send(`<a:dannloading:876008681479749662> Ищем противника...`)
    setTimeout(async function(){
    mgs.delete()
    if(!args[0] || isNaN(args[0])) return error(message, 'Укажите ставку.');
    let value = Math.floor(args[0])
    
    if (value < 1) return error(message, `Минимальная ставка **1**.`);

    if (!bag["vip1"] && value > 10) {
      return error(message, "Максимальная ставка **10**!\nЛибо купите VIP 1");
    } else if (!bag["vip2"] && value > 100) {
      return error(message, "Максимальная ставка **100**!\nЛибо купите VIP 2");
    } else if (bag["vip2"] && value > 500) {
      return error(message, "Максимальная ставка **500**!");
    }

    if(value > bag.stars) return error(message, `У вас недостаточно денег.`);

    const mrp = await rpg.findOne({userID: message.author.id});

    if (!mrp || mrp.item === null) return error(message, 'Вы не имеете героя.');
    
    const mItem = mrp.item
    let item;
    const enem = ["Zeenou", "Dilan", "Darius", "Selena", "Cthulhu", "Zeus", "PerfectDuo", "Eragon", "Ariel", "Archangel", "Darkangel"];
    const random = Math.floor(Math.random() * enem.length);
    item = enem[random]
    let gifUrl;
    fights.filter(function (arr) {
      if((item === mItem && arr[0][0] === mItem && arr[0][1] === mItem) || (arr[0][0] === item && arr[0][1] === mItem) || (arr[0][1] === item && arr[0][0] === mItem)) gifUrl = arr[1]

    })

    await bd.updateOne({userID: message.author.id}, {$inc: {stars: -value}});
    
    const data1 = heroes[mItem];
    const data2 = heroes[item];
    let eLevel;
    const rand1 = Math.floor(Math.random() * 40);
    if (rand1 > 20) {
      if (rand1 > 27) {
        eLevel = mrp.level + 2
      } else if (rand1 > 35) {
        eLevel = mrp.level + 4
      }
    } else {
      if (rand1 > 10) {
        eLevel = mrp.level - 1
      } else if (rand1 > 0) {
        eLevel = mrp.level - 2
      }
    }
    if (eLevel <= 1) eLevel = 2
    let eHealth = (eLevel - 1) * 250 + data2.health;
    let eDamage = (eLevel - 1) * 20 + data2.damage;
    
    let h1 = eHealth
    let h2 = mrp.health
    let d1 = eDamage
    let d2 = mrp.damage
    let winner = false
  
    let myHero = new MessageEmbed()
    .setTitle(`Поединок начался.`)
    .setImage(gifUrl)
    .setThumbnail('https://media.giphy.com/media/SwUwZMPpgwHNQGIjI7/giphy.gif')
    .addField(`${message.author.username} (${data1.nameRus})`, `**Уровень: ${mrp.level}**`, true)
    .addField(`❤ Общая жизнь: ${mrp.health}`, `**⚔ Общая атака: ${mrp.damage}**`, true)
    .addField(`\u200b`, `\u200b`, false)
    .addField(`${data2.name} (${data2.nameRus})`, `**Уровень: ${eLevel}**`, true)
    .addField(`❤ Общая жизнь: ${h1}`, `**⚔ Общая атака: ${d1}**`, true)
    .setColor(cyan)

   
      let msg = await message.channel.send({embeds: [myHero]});
      let rand = Math.floor(Math.random() * 32)
      if (rand < 16) {
        while (true) {
          h1 -= d2
          h2 -= d1
          if(h1 <= 0) {
            winner = message.author;
            break;
          } else if (h2 <= 0) {
            break;
          }
        }
      } else {
        while (true) {
          h2 -= d1
          h1 -= d2
          if(h2 <= 0) {
            break;
          } else if (h1 <= 0) {
            winner = message.author;
            break;
          }
        }
      }

      await pd.findOneAndUpdate({userID: message.author.id}, {$set: {random: Date.now()}})
      await rpg.findOneAndUpdate({userID: message.author.id}, {$inc: {totalGames: 1}})

      setTimeout(async() => {
        let winData
        if (winner) {
          await rpg.findOneAndUpdate({userID: winner.id}, {$inc: {wins: 1}})
          await bd.updateOne({userID: winner.id}, {$inc: {stars: value*2}});
          winData = await rpg.findOne({userID: winner.id});

          let hero = heroes[winData.item]
          let it = heroes[item]
          let winEmb = new MessageEmbed()
          .setTitle(`Победитель: ${winner.tag || winner.user.tag} (${hero.nameRus})`)
          .setDescription(`Поединок между: ${message.member}, ${it.name}(A.I)`)
          .setImage(hero.url)
          .setColor(cyan)
          .addField(`❤ Общая жизнь: ${winData.health}`, `**⚔ Общая атака: ${winData.damage}**`, true)
          .addField(`Выигрыш: ${value * 2} ${STAR}`, `**🏆 Процент побед: ${Math.trunc(winData.wins / winData.totalGames * 100) || '0'}%**`, true)
  
          return msg.edit({embeds: [winEmb]})
        } else {
          await rpg.findOneAndUpdate({userID: message.author.id}, {$inc: {loses: 1}})
          

          let hero = heroes[item]
          let winEmb = new MessageEmbed()
          .setTitle(`Победитель: ${hero.name} A.I (${hero.nameRus})`)
          .setDescription(`Поединок между: ${message.member}, ${hero.name}(A.I)`)
          .setImage(hero.url)
          .setColor(cyan)
          .addField(`❤ Общая жизнь: ${eHealth}`, `**⚔ Общая атака: ${eDamage}**`, true)
  
          return msg.edit({embeds: [winEmb]})
        }
        
       

       
      }, 25000)

    }, a * 1000)  
  }
};
