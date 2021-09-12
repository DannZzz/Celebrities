const heroes = require('../../JSON/heroes.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const { COIN, STAR } = require("../../config");
const { checkValue } = require("../../functions");
const mc = require('discordjs-mongodb-currency');
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);
const Canvas = require('canvas');

module.exports = {
  config: {
    name: "battle",
    aliases: '',
    category: 'h_roleplay'
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return
       
    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {battle: b, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   
       
    const bag = await bd.findOne({ userID: message.author.id });
    const profileData = await pd.findOne({ userID: message.author.id });

    let author = profileData.random;
    let timeout;
    if (bag["vip2"] === true) { timeout = 70 * 1000; } else {
      timeout = 140 * 1000;
    }
    if (author !== null && timeout - (Date.now() - author) > 0) {
        let time = new Date(timeout - (Date.now() - author));

        return error(message, b.time(time));
    }
    let a = Math.round(Math.random() * 6) + 1
    let mgs = await message.channel.send(`<a:dannloading:876008681479749662> ${b.find}`)
    setTimeout(async function(){
    mgs.delete()
    if(!args[0] || isNaN(args[0])) return error(message, b.bet);
    let value = Math.floor(args[0])
    
    if (value < 1) return error(message, b.min);

    if (!bag["vip1"] && value > 10) {
      return error(message, b.vip1);
    } else if (!bag["vip2"] && value > 50) {
      return error(message, b.vip2);
    } else if (bag["vip2"] && value > 120) {
      return error(message, b.vipError);
    }

    if(value > bag.stars) return error(message, noStar);

    const mrp = await rpg.findOne({userID: message.author.id});

    if (!mrp || mrp.item === null) return error(message, hm.noHero);
    
    const mItem = mrp.item
    let item;
    const enem = ["Zeenou", "Dilan", "Darius", "Selena", "Cthulhu", "Zeus", "PerfectDuo", "Eragon", "Ariel", "Archangel", "Darkangel"];
    const random = Math.floor(Math.random() * enem.length);
    item = enem[random]
    
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
      } else {
        eLevel = mrp.level + 1
      }
    } else {
      if (rand1 > 10) {
        eLevel = mrp.level - 1
      } else if (rand1 >= 0) {
        eLevel = mrp.level - 2
      }
    }
    if (eLevel <= 1) eLevel = 2
    let eHealth = ((eLevel - 1) * 250) + data2.health;
    let eDamage = ((eLevel - 1) * 20) + data2.damage;
    
    let h1 = eHealth
    let h2 = mrp.health
    let d1 = eDamage
    let d2 = mrp.damage
    let winner = false

    let damn = await message.channel.send(`<a:dannloading:876008681479749662> ${b.find}`);
    const CC = await makeCanvas(data1.url, data2.url)
    const att = new MessageAttachment(CC.toBuffer(), 'fight.png')
    
    
    let myHero = new MessageEmbed()
    .setTitle(hm.battle)
    .setImage('attachment://fight.png')
    .setThumbnail('https://media.giphy.com/media/SwUwZMPpgwHNQGIjI7/giphy.gif')
    .addField(`${message.author.username} (${LANG.lang === "ru" ? data1.nameRus : data1.name})`, `**${hm.level} ${mrp.level}**`, true)
    .addField(`❤ ${hm.health} ${mrp.health}`, `**⚔ ${hm.damage} ${mrp.damage}**`, true)
    .addField(`\u200b`, `\u200b`, false)
    .addField(`${LANG.lang === "ru" ? data2.nameRus : data2.name}`, `**${hm.level} ${+eLevel}**`, true)
    .addField(`❤ ${hm.health} ${h1}`, `**⚔ ${hm.damage} ${d1}**`, true)
    .setColor(cyan)

   
      let msg = await message.channel.send({embeds: [myHero], files: [att]});
      damn.delete()
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
          .setTitle(`${b.winner} ${winner.tag || winner.user.tag} (${LANG.lang === "ru" ? hero.nameRus : hero.name})`)
          .setDescription(`${b.between} ${message.member}, ${it.name}(A.I)`)
          .setImage(hero.url)
          .setColor(cyan)
          .addField(`❤ ${hm.health} ${winData.health}`, `**⚔ ${hm.damage} ${winData.damage}**`, true)
          .addField(`${hm.reward} ${value * 2} ${STAR}`, `**🏆 ${hm.winrate} ${Math.trunc(winData.wins / winData.totalGames * 100) || '0'}%**`, true)
          msg.delete()
          return message.channel.send({embeds: [winEmb]})
        } else {
          await rpg.findOneAndUpdate({userID: message.author.id}, {$inc: {loses: 1}})
          

          let hero = heroes[item]
          let winEmb = new MessageEmbed()
          .setTitle(`${b.winner} ${hero.name} A.I (${LANG.lang === "ru" ? hero.nameRus : hero.name})`)
          .setDescription(`${b.between} ${message.member}, ${hero.name}(A.I)`)
          .setImage(hero.url)
          .setColor(cyan)
          .addField(`❤ ${hm.health} ${eHealth}`, `**⚔ ${hm.damage} ${eDamage}**`, true)
          msg.delete()
          return message.channel.send({embeds: [winEmb]})
        }
        
       

       
      }, 25000)

    }, a * 1000)  
  }
}

async function makeCanvas (data1, data2) {
  const canvas = Canvas.createCanvas(1110, 520);
  const ctx = canvas.getContext('2d');
  const background = await Canvas.loadImage('https://png.pngtree.com/thumb_back/fh260/background/20200729/pngtree-game-battle-versus-vs-background-image_373230.jpg');
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
  const h = 300;
  const heroHeight = 110;
  const firstW = 60;
  const secW = 750;
  
  const first = await Canvas.loadImage(data1);
  const second = await Canvas.loadImage(data2);
  
  ctx.drawImage(first, firstW, heroHeight, h, h);
  ctx.drawImage(second, secW, heroHeight, h, h);

  ctx.lineWidth = 3;
  ctx.strokeStyle = "GRAY";
  ctx.strokeRect(firstW, heroHeight, h, h)

  ctx.lineWidth = 3;
  ctx.strokeStyle = "ORANGE";
  ctx.strokeRect(secW, heroHeight, h, h)
  
  return canvas
}