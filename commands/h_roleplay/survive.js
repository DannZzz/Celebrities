const heroes = require('../../JSON/heroes.json');
const enemies = require('../../JSON/enemies.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const { COIN, STAR } = require("../../config");
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);
const Canvas = require('canvas');

module.exports = {
  config: {
    name: "приключения",
    aliases: ['journey', 'аdventures'],
    category: 'h_roleplay',
    description: "Посмотреть статистику своего героя.",
    usage: "(инфо | info)",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
    if(limited) return

    const data = await bd.findOne({userID: message.author.id})
    const user = message.author;
    const bag = await bd.findOne({userID: user.id})
    let rp = await rpg.findOne({userID: user.id});
    if(!rp || rp.item === null) {
      return error(message, `Сначала купите героя...\`\`?получить\`\``)
    }
    if (!rp.surviveLevel || rp.surviveLevel === null) await rpg.findOneAndUpdate({userID: user.id}, {$set: {surviveLevel: 1}});
    rp = await rpg.findOne({userID: user.id});
    const nowLevel = rp.surviveLevel;
    const levelRewardAdd = 10;
    const levelReward = levelRewardAdd * nowLevel
    const argsWords = ['info', 'инфо']

    const hero = heroes[rp.item];
    let enemy;
    if (nowLevel % 10 === 0) {
      enemy = enemies["D'Lord"]
    } else if (nowLevel % 7 === 0) {
      enemy = enemies["D'Wolf"];
    } else if (nowLevel % 5 === 0) {
      enemy = enemies["Arthas"];
    } else if (nowLevel % 4 === 0) {
      enemy = enemies["Cousin"];
    } else {
      enemy = enemies["Jorj"];
    }

    const getTime = await pd.findOne({userID: user.id})
    const author = getTime.survive || 0;



    let enemyHealth = Math.floor(enemy.health * nowLevel);
    let enemyDamage = Math.floor(enemy.damage * nowLevel);

    let myHealth = rp.health;
    let myDamage = rp.damage;
    let win;
   
    

    if (args[0] && argsWords.includes(args[0])) {

      const levMes = new MessageEmbed()
      .setColor(cyan)
      .setAuthor(`${user.username}, ваш текущий уровень приключений: ${nowLevel}`)
      .setTitle(`Враг — ${enemy.name} (${enemy.nameRus})`)
      .setDescription(enemy.description)
      .addField(`❤ Общая жизнь: ${enemyHealth}`, `**⚔ Общая атака: ${enemyDamage}**`, false)
      .addField(`Награда: ${levelReward} ${STAR}`, `** **`, false)
      .setImage(enemy.url)

      return message.channel.send({embeds: [levMes]});
    } 
    let damn = await message.channel.send(`<a:dannloading:876008681479749662> Ищем противника...`);
    const CC = await makeCanvas(hero.url, enemy.url)
    const att = new MessageAttachment(CC.toBuffer(), 'fight.png')
    
    const lonely = new MessageEmbed()
    .setColor(cyan)
    .setTimestamp()//
    .setTitle(`Бой начался.`)
    .addField(`${user.username}`, `(${hero.nameRus})`, true)
    .addField(`❤ Общая жизнь: ${myHealth}`, `**⚔ Общая атака: ${myDamage}**`, true)
    .addField(`\u200b`, `\u200b`, false)
    .addField(`${enemy.name}`, `(${enemy.nameRus})`, true)
    .addField(`❤ Общая жизнь: ${enemyHealth}`, `**⚔ Общая атака: ${enemyDamage}**`, true)
    .setThumbnail(`https://media.giphy.com/media/SwUwZMPpgwHNQGIjI7/giphy.gif`)
    .setImage('attachment://fight.png')
      
      let timeoutt;
        if (bag["vip2"] === true) { timeoutt = 1800000; } else {
          timeoutt = 3559000;
        }
        if (author !== null && timeoutt - (Date.now() - author) > 0) {
            let time = new Date(timeoutt - (Date.now() - author));
            damn.delete()
            return error(message, `Вы недавно вернулись из приключений. Отдыхай **${time.getMinutes()} минут ${time.getSeconds()} секунд.**.`);
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

    if(hero.name === "Eragon" && enemy.name === "D'Lord") {
      winner = hero
    }

    if(hero.name === "Ariel" && enemy.name === "D'Wolf") {
      winner = hero
    }
    
    let msgozv = new MessageEmbed()
    .setColor(cyan)
    .setTitle("Сценарий.")
    .setDescription(`**${enemy.nameRus}:** Эй! **${user.username}**, мой лорд ждёт тебя.`)
    let emb = new MessageEmbed()
    .setColor(cyan)
    .setTimestamp()
    if(winner === hero){
      emb
      .setTitle(`Вы оказались сильнее.`)
      .setDescription(`Награда за уровень: ${levelReward} ${STAR}`)
      .setThumbnail(enemy.url)
      .setImage(hero.url)

      await bd.findOneAndUpdate({userID: user.id}, {$inc: {stars: levelReward}});
      await rpg.findOneAndUpdate({userID: user.id}, {$inc: {surviveLevel: 1}});

    } else {
      emb
      .setTitle(`${enemy.nameRus} оказался сильнее.`)
      .setDescription(`Вернитесь через некоторое время.`)
      .setThumbnail(hero.url)
      .setImage(enemy.url)
      await pd.findOneAndUpdate({userID: user.id}, {$set: {survive: Date.now()}})

    }
    let msg = await message.channel.send({embeds: [lonely], files: [att]});
    damn.delete()
    setTimeout(function(){
      msg.delete()
      return message.channel.send({embeds: [emb]})
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