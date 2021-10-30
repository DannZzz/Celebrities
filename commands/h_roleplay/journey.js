const heroes = require('../../JSON/heroes.json');
const enemies = require('../../JSON/enemies.json');
const { main } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const { COIN, STAR } = require("../../config");
const {error, embed, perms, getHeroData} = require("../../functions/functions");
const { addPremiumStar } = require("../../functions/models");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);
const Canvas = require('canvas');

module.exports = {
  config: {
    name: "journey",
    aliases: ['аdventure', 'аdventures', 'приключения'],
    category: 'h_roleplay',
    cooldown: 20
  },
  run: async (bot, message, args) => {
    

    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {journey: j, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   
    

    const data = await bd.findOne({userID: message.author.id})
    const user = message.author;
    const bag = await bd.findOne({userID: user.id})
    let rp = await rpg.findOne({userID: user.id});
    if(!rp || rp.item === null) {
      return error(message, j.err1)
    }
    if (!rp.surviveLevel || rp.surviveLevel === null) await rpg.findOneAndUpdate({userID: user.id}, {$set: {surviveLevel: 1}});
    rp = await rpg.findOne({userID: user.id});
    const nowLevel = rp.surviveLevel;
    const levelRewardAdd = 46;
    const levelReward = levelRewardAdd * nowLevel
    const argsWords = ['info', 'инфо']

    const hero = heroes[rp.item];
    let enemy;
    if (nowLevel % 20 === 0) {
      enemy = enemies["Shibzdik's Dilan"]
    } else if (nowLevel % 10 === 0) {
      enemy = enemies["D'Lord"]
    } else if (nowLevel % 7 === 0) {
      enemy = enemies["D'Wolf"];
    } else if (nowLevel % 6 === 0) {
      enemy = enemies["Orga"];
    } else if (nowLevel % 5 === 0) {
      enemy = enemies["Arthas"];
    } else if (nowLevel % 4 === 0) {
      enemy = enemies["Cousin"];
    } else {
      enemy = enemies["Jorj"];
    }

    const getTime = await pd.findOne({userID: user.id})
    const author = getTime.survive || 0;



    let enemyHealth = Math.floor((enemy.health || 1198) * nowLevel);
    let enemyDamage = Math.floor((enemy.damage || 156) * nowLevel);

    const get = rp.heroes.find(x => x.name === rp.item)
    
    let myHealth = await getHeroData(bot, user.id, rp).then(x => x.h);
    let myDamage = await getHeroData(bot, user.id, rp).then(x => x.d);
    let win;
   
    

    if (args[0] && argsWords.includes(args[0])) {
      const levMes = new MessageEmbed()
      .setColor(main)
      .setAuthor(`${user.username}, ${j.now} ${nowLevel}`)
      .setTitle(`${j.enemy} — ${enemy.name} (${enemy.nameRus})`)
      .setDescription(enemy.description)
      .addField(`❤ ${hm.health} ${enemyHealth}`, `**⚔ ${hm.damage} ${enemyDamage}**`, false)
      .addField(`${hm.reward} ${levelReward} ${STAR}`, `** **`, false)
      .setImage(enemy.url)

      return message.channel.send({embeds: [levMes]});
    } 
    let damn = await message.channel.send(`<a:dannloading:876008681479749662> Ищем противника...`);
    const CC = await makeCanvas(hero.path, enemy.path)
    const att = new MessageAttachment(CC.toBuffer(), 'fight.png')
    
    const lonely = new MessageEmbed()
    .setColor(main)
    .setTimestamp()//
    .setTitle(hm.battle)
    .addField(`${user.username}`, `(${hero.nameRus})`, true)
    .addField(`❤ ${hm.health} ${myHealth}`, `**⚔ ${hm.damage} ${myDamage}**`, true)
    .addField(`\u200b`, `\u200b`, false)
    .addField(`${enemy.name}`, `(${enemy.nameRus})`, true)
    .addField(`❤ ${hm.health} ${enemyHealth}`, `**⚔ ${hm.damage} ${enemyDamage}**`, true)
    .setThumbnail(`https://media.giphy.com/media/SwUwZMPpgwHNQGIjI7/giphy.gif`)
    .setImage('attachment://fight.png')
    
      
      let timeoutt;
        if (bag["vip2"] === true) { timeoutt = 300000; } else {
          timeoutt = 600000;
        }
        if (author !== null && timeoutt - (Date.now() - author) > 0) {
            let time = new Date(timeoutt - (Date.now() - author));
            damn.delete()
            return error(message, j.time(time));
        }
      let rand = Math.floor(Math.random() * 32)
      if (rand < 16) {
        while (true) {
          myHealth -= enemyDamage;
          enemyHealth -= myDamage;
          if(myHealth <= 0) {
            win = false;
            break;
          } else if (enemyHealth <= 0) {
            win = true;
            break;
          }
        }
      } else {
        while (true) {
          enemyHealth -= myDamage;
          myHealth -= enemyDamage;
          if(enemyHealth <= 0) {
            win = true;
            break;
          } else if (myHealth <= 0) {
            win = false;
            break;
          }
        }
      }
    
      


    let winner;
    win ? winner = hero : winner = enemy

    if(hero.name === "Clarity" && enemy.name === "Shibzdik's Dilan") {
      winner = hero
    }

    if(hero.name === "Eragon" && enemy.name === "D'Lord") {
      winner = hero
    }

    if(hero.name === "Ariel" && enemy.name === "D'Wolf") {
      winner = hero
    }
    
    
    let msgozv = new MessageEmbed()
    .setColor(main)
    .setTitle("Сценарий.")
    .setDescription(`**${enemy.nameRus}:** Эй! **${user.username}**, мой лорд ждёт тебя.`)
    let emb = new MessageEmbed()
    .setColor(main)
    .setTimestamp()
    const att1 = new MessageAttachment(enemy.path, `${enemy.name}.png`);
    const att2 = new MessageAttachment(hero.path, `${hero.name}.png`);
    await pd.findOneAndUpdate({userID: user.id}, {$set: {survive: Date.now()}})

    if(winner === hero){
      

      
      emb
      .setTitle(j.done)
      .setDescription(`${j.rew} ${await addPremiumStar(bot, user.id, levelReward, true)} ${STAR}`)
      .setThumbnail(`attachment://${enemy.name}.png`)
      .setImage(`attachment://${hero.name}.png`)

      await addPremiumStar(bot, user.id, levelReward);
      await rpg.findOneAndUpdate({userID: user.id}, {$inc: {surviveLevel: 1}});

    } else {
      
      
      emb
      .setTitle(`${enemy.nameRus} ${j.he}`)
      .setDescription(j.err)
      .setImage(enemy.url)

    }
    let msg = await message.channel.send({embeds: [lonely], files: [att]});
    damn.delete()
    setTimeout(function(){
      msg.delete()
      return message.channel.send({embeds: [emb], files: winner === hero ? [att2] : []})
    }, 15000)
    // message.channel.send(msgozv).then(
    //   (msg) => {
    //     setTimeout(function(){
    //       msg.edit(msgozv.setDescription(`**${user.username}:** Мерзкая тварь, твой лорд ещё заплатит за всё!`)).then(
    //         (msgg) => {
    //           setTimeout(function(){
    //             msgg.edit(msgozv.setDescription(`**${enemy.nameRus}:** Твои последние слова...?`)).then(
    //               (ccc) => {
    //                 setTimeout(function(){
    //                   ccc.edit(lonely)
    //                 }, 8000)
    //               }
    //             )
    //           }, 8000)
    //         }
    //       )
    //     }, 8000)
    //
    // }
    // )

  }
};

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