const heroes = require('../../JSON/heroes.json');
const { main } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const { COIN, STAR, LEAGUE } = require("../../config");
const { checkValue } = require("../../functions/functions");
const {error, embed, perms, roundFunc} = require("../../functions/functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 10000);
const Canvas = require('canvas');
const Rate = require("../../functions/rateClass");

module.exports = {
  config: {
    name: "battle",
    aliases: ["битва"],
    category: 'h_roleplay',
    cooldown: 30
  },
  run: async (bot, message, args, ops) => {
    const now = ops.games.get(message.author.id);
    if (now) return;
    ops.games.set(message.author.id, {battling: "on"});
    setTimeout(() => ops.games.delete(message.author.id), 30000)
       
    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {battle: b, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   
       
    const bag = await bd.findOne({ userID: message.author.id });
    const profileData = await pd.findOne({ userID: message.author.id });

    let author = profileData.random;
    let timeout;
    if (bag["vip2"] === true) { timeout = 100 * 1000; } else {
      timeout = 180 * 1000;
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

    if (!bag["vip1"] && value > 50) {
      return error(message, b.vip1);
    } else if (!bag["vip2"] && value > 100) {
      return error(message, b.vip2);
    } else if (bag["vip2"] && value > 250) {
      return error(message, b.vipError);
    }

    if(value > bag.stars) return error(message, noStar);

    const mrp = await rpg.findOne({userID: message.author.id});
    const rate = mrp.league.rate || 0;
    const league = mrp.league.id || 0;

    if (!mrp || mrp.item === null) return error(message, hm.noHero);
    const mItem = mrp.item
    let item;
    const enem = ["Hookfang", "Tartarus", "Ancalgon", "X", "Toothless", "Zero", "Horus", "Thoth-amon", "Anubis", "Sebek", "Hathor", "Supernatural-ramses", "Broken", "Mistress-forest", "Snake-woman", "Blazer", "Athena", "Atalanta", "Kumbhakarna", "Zeenou", "Dilan", "Darius", "Selena", "Cthulhu", "Zeus", "Perfect-duo", "Eragon", "Ariel", "Archangel", "Darkangel"];
    const random = Math.floor(Math.random() * enem.length);
    item = enem[random]
    
    await bd.updateOne({userID: message.author.id}, {$inc: {stars: -value}});
    
    const data1 = heroes[mItem];
    const data2 = heroes[item];
    const get = mrp.heroes.find(x => x.name === mrp.item)
    const myLevel = get.level;
    const myHealth = get.health;
    const myDamage = get.damage;
    let eLevel;
    const rand1 = Math.floor(Math.random() * 40);
    if (rand1 > 20) {
      if (rand1 > 27) {
        eLevel = myLevel + 2
      } else if (rand1 > 35) {
        eLevel = myLevel + 4
      } else {
        eLevel = myLevel + 1
      }
    } else {
      if (rand1 > 10) {
        eLevel = myLevel - 1
      } else if (rand1 >= 0) {
        eLevel = myLevel - 2
      }
    }
    if (eLevel <= 1) eLevel = 2
    let eHealth = ((eLevel - 1) * 500) + data2.health;
    let eDamage = ((eLevel - 1) * 40) + data2.damage;
    if (myHealth / 2 > eHealth) {
      eHealth += eHealth + (500*(eLevel / 1.8));
      eDamage += eDamage + (40*(eLevel / 1.8));
    }
    let h1 = Math.round(eHealth)
    let h2 = Math.round(myHealth)
    let d1 = Math.round(eDamage)
    let d2 = Math.round(myDamage)
    let winner = false

    let damn = await message.channel.send(`<a:dannloading:876008681479749662> ${b.find}`);
    const CC = await makeCanvas(data1.url, data2.url)
    const att = new MessageAttachment(CC.toBuffer(), 'fight.png')
    
    
    let myHero = new MessageEmbed()
    .setTitle(hm.battle)
    .setImage('attachment://fight.png')
    .setThumbnail('https://media.giphy.com/media/SwUwZMPpgwHNQGIjI7/giphy.gif')
    .addField(`${message.author.username} (${LANG.lang === "ru" ? data1.nameRus : data1.name})`, `**${hm.level} ${myLevel}**`, true)
    .addField(`❤ ${hm.health} ${myHealth}`, `**⚔ ${hm.damage} ${myDamage}**`, true)
    .addField(`\u200b`, `\u200b`, false)
    .addField(`${LANG.lang === "ru" ? data2.nameRus : data2.name}`, `**${hm.level} ${Math.round(+eLevel)}**`, true)
    .addField(`❤ ${hm.health} ${Math.round(h1)}`, `**⚔ ${hm.damage} ${Math.round(d1)}**`, true)
    .setColor(main)

   
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
          const winCup = Rate(message).winRewardGenerator(league);
          await Rate(message).rateUpdate(message.author.id, winCup);
          await rpg.findOneAndUpdate({userID: winner.id}, {$inc: {wins: 1}})
          await bd.updateOne({userID: winner.id}, {$inc: {stars: value*2}});
          const WinData = await rpg.findOne({userID: winner.id});
          winData = WinData.heroes.find(x => x.name === WinData.item)
          let hero = heroes[winData.name]
          let it = heroes[item]
          let winEmb = new MessageEmbed()
          .setTitle(`${b.winner} ${winner.tag || winner.user.tag} (${LANG.lang === "ru" ? hero.nameRus : hero.name})`)
          .setDescription(`${b.between} ${message.member}, ${it.name}(A.I)`)
          .setImage(hero.url)
          .setColor(main)
          .addField(`❤ ${hm.health} ${winData.health}`, `**⚔ ${hm.damage} ${winData.damage}**`, true)
          .addField(`${hm.reward} ${value * 2} ${STAR} +${winCup} ${LEAGUE.cup}`, `**🏆 ${hm.winrate} ${roundFunc(WinData.wins / WinData.totalGames * 100) || '0'}%**`, true)
          msg.delete()
          return message.channel.send({embeds: [winEmb]})
        } else {
          await rpg.findOneAndUpdate({userID: message.author.id}, {$inc: {loses: 1}})
          await Rate(message).rateUpdate(message.author.id, -45);

          let hero = heroes[item]
          let winEmb = new MessageEmbed()
          .setTitle(`${b.winner} ${hero.name} A.I (${LANG.lang === "ru" ? hero.nameRus : hero.name})`)
          .setDescription(`${b.between} ${message.member}, ${hero.name}(A.I) -${45} ${LEAGUE.cup}`)
          .setImage(hero.url)
          .setColor(main)
          .addField(`❤ ${hm.health} ${Math.round(eHealth)}`, `**⚔ ${hm.damage} ${Math.round(eDamage)}**`, true)
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
