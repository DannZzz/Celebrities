const heroes = require('../../JSON/heroes.json');
const enemies = require('../../JSON/enemies.json');
const { main } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed, MessageAttachment, MessageButton, MessageActionRow } = require("discord.js");
const { COIN, STAR, AGREE } = require("../../config");
const { checkValue } = require("../../functions/functions");
;
const {error, embed, perms} = require("../../functions/functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);
const Canvas = require("canvas")
const items = require('../../JSON/items');

module.exports = {
  config: {
    name: "boss",
    aliases: ['босс'],
    category: 'h_roleplay'
  },
  run: async (bot, message, args) => {
   
    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {boss: b, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and} = require(`../../languages/${LANG.lang}`);   
 
       
    const bag = await bd.findOne({ userID: message.author.id });
    const profileData = await pd.findOne({ userID: message.author.id });

    let author = profileData.boss;
    let timeout;
    if (bag["vip2"] === true) { timeout = 43200 * 1000; } else {
      timeout = 86400 * 1000;
    }
    if (author !== null && timeout - (Date.now() - author) > 0) {
        let time = new Date(timeout - (Date.now() - author));

        return error(message, b.time(time));
    }
    if (!args[0]) return error(message, b.error);
    const user1 = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!user1) return error(message, notUser);
    if(user1.user.bot) return error(message, b.error1);
    const mUser = message.author;
    if(user1.id === mUser.id) return error(message, b.error1);
    let count = 0;

    if(!args[1]) return error(message, specify);
    const user2 = message.mentions.members.last() || message.guild.members.cache.get(args[1]);
    if(!user2) return error(message, notUser);
    if(user2.id === user1.id) return error(message, b.error1)


    if(user2.id === mUser.id) return error(message, b.error1);

    const rp1 = await rpg.findOne({userID: user1.id});
    const rp2 = await rpg.findOne({userID: user2.id});

    const mrp = await rpg.findOne({userID: mUser.id});

    if (!mrp || mrp.item === null) return error(message, hm.noHero);
    if (!rp1 || rp1.item === null) return error(message, b.secondH);
    if (!rp2 || rp2.item === null) return error(message, b.thirdH);

    const get1 = mrp.heroes.find(x => x.name === mrp.item)
    const get2 = rp1.heroes.find(x => x.name === rp1.item)
    const get3 = rp2.heroes.find(x => x.name === rp2.item)
    
    let allHealth = get1.health + get2.health + get3.health
    let allDamage = get1.damage + get2.damage + get3.damage

    let boss = enemies["FireWalker"]

    let allLevel = (get1.level + get2.level + get3.level) / 3

    if(allLevel <= 27) boss = enemies["EaterSkull"]
    if(allLevel >= 50) boss = enemies["Flor"]

    let bossHealth = boss.health
    let bossDamage = boss.damage

    let winner;
    let loser;

    const item1 = rp1.item
    const item2 = rp2.item
    const mItem = mrp.item
    const data1 = heroes[mItem]
    const data2 = heroes[item1]
    const data3 = heroes[item2]

    let msg1;
    let msg2;
    let TIME = true;

    const button1 = new MessageButton()
        .setCustomId('previousbtn')
        .setLabel(user1.user.username)
        .setStyle('PRIMARY')
        .setEmoji(AGREE)
  
        const button2 = new MessageButton()
        .setCustomId('nextbtn')
        .setLabel(user2.user.username)
        .setStyle('PRIMARY')
        .setEmoji(AGREE)
  
        

    
    
    let fight = new MessageEmbed()
    .setTitle(hm.battle)
    .setThumbnail('https://media.giphy.com/media/SwUwZMPpgwHNQGIjI7/giphy.gif')
    .addField(`${mUser.username} [${get1.level}] (${data1.nameRus})\n${user1.user.username} [${get2.level}] (${data2.nameRus})\n${user2.user.username} [${get3.level}] (${data3.nameRus})`, `** **`, true)
    .addField(`❤ ${hm.health}: ${allHealth}`, `**⚔ ${hm.damage}: ${allDamage}**`, true)
    .addField(`\u200b`, `\u200b`, false)
    .addField(`${boss.name} (${boss.nameRus})`, `** **`, false)
    .addField(`❤ ${hm.health}: ${bossHealth}`, `**⚔ ${hm.damage}: ${bossDamage}**`, false)
    .setColor(main)
    .setTimestamp()
    .setImage('attachment://fight.png')

    

    let trues = [false, false]
    const filter1 = (i) => i.customId === button1.customId && i.user.id === user1.id;

    const filter2 = (i) => i.customId === button2.customId && i.user.id === user2.id;
    
    const row1 = new MessageActionRow().addComponents([button1]);
    const row2 = new MessageActionRow().addComponents([button2]);

    const newEmbed = new MessageEmbed()
    .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
    .setDescription(`${user1} ${and} ${user2} ${b.invite}`)
    .setColor(main)

    const waitingMsg = await message.channel.send({embeds: [newEmbed], components: [row1, row2]});
    const collector1 = await waitingMsg.createMessageComponentCollector({
      filter: filter1,
      time: 20000,
      });
    const collector2 = await waitingMsg.createMessageComponentCollector({
      filter: filter2,
      time: 20000,
      });  


    collector1.on("collect", async (i) => {
      switch (i.customId) {
        case button1.customId:
          trues[0] = true;
          embed(message, b.got1)
          break;
        default:
          break;  
      }
    });


    collector2.on("collect", async (i) => {
      switch (i.customId) {
        case button2.customId:
          trues[1] = true;
          embed(message, b.got2)
          break;
        default:
          break;  
      }
    });
    let asd = false
    collector1.on("end", () => {
      if (!waitingMsg.deleted) {
        const disabledRow = new MessageActionRow().addComponents(
          button2.setDisabled(true),
          button1.setDisabled(true)
        );
        waitingMsg.edit({
          components: [disabledRow],
        });
      }
      asd = true
    });
    // let boolean = false;
    // setTimeout(() => boolean = true, 60*1000)

    while ((trues[0] === false || trues[1] === false) && asd !== true) {await delay(1000)}
    if (asd && !(trues[0] == true && trues[1] === true)) return error(message, b.timeError)
      if(trues[0] == true && trues[1] === true) {
        waitingMsg.delete()
        const damn = await message.channel.send(`<a:dannloading:876008681479749662> ${b.connect}..`)
        const CC = await makeCanvas(data1.url, data2.url, data3.url, boss.url)
        const att = new MessageAttachment(CC.toBuffer(), 'fight.png')
        damn.delete()
        
        let newmsg = await message.channel.send({embeds: [fight.setImage('attachment://fight.png')], files: [att]});
        setTimeout(async function() {
          let rand = Math.floor(Math.random() * 32)
          if (rand < 16) {
            while (true) {
              allHealth -= bossDamage
              bossHealth -= allDamage
              if(allHealth <= 0) {
                winner = false;
                break;
              } else if (bossHealth <= 0) {
                winner = true;
                break;
              }
            }
          } else {
            while (true) {
              bossHealth -= allDamage
              allHealth -= bossDamage
              if(bossHealth <= 0) {
                winner = true;
                break;
              } else if (allHealth <= 0) {
                winner = false;
                break;
              }
            }
          }

          let endEmbed = new MessageEmbed()
          .setColor(main)
          .setTimestamp()
          .setAuthor(`${boss.name} ${b.turned}`)
          .setTitle(`${message.author.username}, ${user1.user.username} ${and} ${user2.user.username} ${b.lost}.`)
          .setThumbnail(boss.url)

          let winEmbed = new MessageEmbed()
          .setColor(main)
          .setTimestamp()
          .setAuthor(`${boss.name} ${b.gaveUp}`)
          .setTitle(`${message.author.username}, ${user1.user.username} ${and} ${user2.user.username} ${b.won}.`)
          .setDescription(`${b.gets} ${boss.reward} ${STAR}, 1 ${items.meat.emoji}`)
          .setThumbnail(boss.url)

          if (winner){
            await bd.findOneAndUpdate({userID: mUser.id}, {$inc: {stars: boss.reward}})
            await bd.findOneAndUpdate({userID: user1.id}, {$inc: {stars: boss.reward}})
            await bd.findOneAndUpdate({userID: user2.id}, {$inc: {stars: boss.reward}})

            await rpg.findOneAndUpdate({userID: mUser.id}, {$inc: {meat: 1}})
            await rpg.findOneAndUpdate({userID: user1.id}, {$inc: {meat: 1}})
            await rpg.findOneAndUpdate({userID: user2.id}, {$inc: {meat: 1}})
            
            await pd.findOneAndUpdate({userID: mUser.id}, {$set: {boss: Date.now()}})
            await pd.findOneAndUpdate({userID: user1.id}, {$set: {boss: Date.now()}})
            await pd.findOneAndUpdate({userID: user2.id}, {$set: {boss: Date.now()}})

            newmsg.delete()
            return message.channel.send({embeds: [winEmbed]})
          } else {
            newmsg.delete()
            return message.channel.send({embeds: [endEmbed]})
          }

        }, 20000)
      } else {
        return error(message, b.timeError);
      }
    

  }
};

async function makeCanvas (data1, data2, data3, data4) {
  const canvas = Canvas.createCanvas(1110, 520);
  const ctx = canvas.getContext('2d');
  const background = await Canvas.loadImage('https://png.pngtree.com/thumb_back/fh260/background/20200729/pngtree-game-battle-versus-vs-background-image_373230.jpg');
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
  const h = 200;
  const enemyH = 110;
  const firstH = 160;
  const secondH = 60;
  const thirdH = 280;
  
  const firstW = 20;
  const secW = 240;
  const thW = 240;
  const foW = 750;
  
  const first = await Canvas.loadImage(data1);
  const second = await Canvas.loadImage(data2);
  const third = await Canvas.loadImage(data3);
  const fourth = await Canvas.loadImage(data4);
  
  ctx.drawImage(first, firstW, firstH, h, h);
  ctx.drawImage(second, secW, secondH, h, h);
  ctx.drawImage(third, thW, thirdH, h, h);
  ctx.drawImage(fourth, foW, enemyH, 300, 300);

  ctx.lineWidth = 3;
  ctx.strokeStyle = "GRAY";
  ctx.strokeRect(firstW, firstH, h, h)
  
  ctx.lineWidth = 3;
  ctx.strokeStyle = "GRAY";
  ctx.strokeRect(secW, secondH, h, h)

  ctx.lineWidth = 3;
  ctx.strokeStyle = "GRAY";
  ctx.strokeRect(thW, thirdH, h, h)

  ctx.lineWidth = 3;
  ctx.strokeStyle = "ORANGE";
  ctx.strokeRect(foW, enemyH, 300, 300)
  
  return canvas
}
