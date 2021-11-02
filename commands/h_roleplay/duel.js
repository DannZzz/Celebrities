const heroes = require('../../JSON/heroes.json');
const { main, reddark } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed, MessageAttachment, MessageActionRow, MessageButton } = require("discord.js");
const { COIN, LEAGUE } = require("../../config");
const {error, embed, perms, roundFunc, getHeroData} = require("../../functions/functions");
const Canvas = require('canvas');
const Rate = require("../../functions/rateClass");
const {rpgFind, addCount} = require("../../functions/models");

module.exports = {
  config: {
    name: "duel",
    aliases: ['fight', "pvp", 'дуэл', 'бой'],
    category: 'h_roleplay',
    cooldown: 17
  },
  run: async (bot, message, args) => {

    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {ERROR, interError, duel: d, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   
   
       
    const bag = await bd.findOne({ userID: message.author.id });
    const profileData = await pd.findOne({ userID: message.author.id });

    let author = profileData.rpg;
    let timeout;
    if (bag["vip2"] === true) { timeout = 180 * 1000; } else {
      timeout = 360 * 1000;
    }
    if (author !== null && timeout - (Date.now() - author) > 0) {
        let time = new Date(timeout - (Date.now() - author));

        return error(message, d.time(time));
    }
    if (!args[0]) return error(message, specify);
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
    if(!user) return error(message, notUser);
    if(user.user.bot) return error(message, d.bot);
    const mUser = message.author;
    if(user.id === mUser.id) return error(message, d.error1);

    const rp = await rpg.findOne({userID: user.id});
    const mrp = await rpg.findOne({userID: mUser.id});

    if (!mrp || mrp.item === null) return error(message, d.error2);
    if (!rp || rp.item === null) return error(message, d.error3);

    const get1 = mrp.heroes.find(x => x.name === mrp.item)
    const get2 = rp.heroes.find(x => x.name === rp.item)

    let h1 = await getHeroData (bot, user.id, rp).then(x => x.h);
    let h2 = await getHeroData (bot, mUser.id, mrp).then(x => x.h);
    let d1 = await getHeroData (bot, user.id, rp).then(x => x.d);
    let d2 = await getHeroData (bot, mUser.id, mrp).then(x => x.d);

    await addCount(mUser.id, "duel")
    
    let winner;
    let loser;

    const item = rp.item
    const mItem = mrp.item

    const data1 = heroes[mItem];
    const data2 = heroes[item];
      
    const button1 = new MessageButton()
    .setCustomId('previousbtn')
    .setLabel(d.buttonReject)
    .setStyle('DANGER');

    const button2 = new MessageButton()
    .setCustomId('nextbtn')
    .setLabel(d.buttonAccept)
    .setStyle('SUCCESS');

let buttonList = [
  button1,
  button2
]

const Emb = new MessageEmbed()
.setColor(main)
.setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
.setDescription(`<@${user.user.id}> ${d.invite}`)


const row = new MessageActionRow().addComponents(buttonList);
const wait = await message.channel.send({
embeds: [Emb],
components: [row],
})

const filter = (i) => { if (
(i.customId === buttonList[0].customId ||
i.customId === buttonList[1].customId) &&
i.user.id === user.id) {
  return true;
}else if(i.user.id !== user.id) {
  const intEmbed = new MessageEmbed()
  .setColor(reddark)
  .setTitle(ERROR)
  .setDescription(interError)

return i.reply({embeds: [intEmbed], ephemeral: true})
}};

const collector = await wait.createMessageComponentCollector({
filter,
time: 15000,
});


collector.on("collect", async (i) => {
if(i.customId === buttonList[0].customId) {
  await i.deferUpdate()
  if (!wait.deleted) {
    const disabledRow = new MessageActionRow().addComponents(
      buttonList[0].setDisabled(true),
      buttonList[1].setDisabled(true)
    );
    wait.edit({components: [disabledRow]})
    return error(message, `${user} ${d.refused}`)
  }
  collector.stop()
} else if (i.customId === buttonList[1].customId) {
    await i.deferUpdate()
    const disabledRow = new MessageActionRow().addComponents(
      buttonList[0].setDisabled(true),
      buttonList[1].setDisabled(true)
    );
    wait.edit({components: [disabledRow]})
    let damn = await message.channel.send(`<a:dannloading:876008681479749662> ${d.find}`);
   const CC = await makeCanvas(data1.path, data2.path)
    const att = new MessageAttachment(CC.toBuffer(), 'fight.png')
    

    //return message.reply({embeds: [eamb], files: [att]})
    
    let myHero = new MessageEmbed()
    .setTitle(hm.battle)
    .setImage('attachment://fight.png')
    .setThumbnail('https://media.giphy.com/media/SwUwZMPpgwHNQGIjI7/giphy.gif')
    .addField(`${mUser.username} (${LANG.lang === "ru" ? data1.nameRus : data1.name})`, `**${hm.level} ${get1.level}**`, true)
    .addField(`❤ ${hm.health} ${h2}`, `**⚔ ${hm.damage} ${d2}**`, true)
    .addField(`\u200b`, `\u200b`, false)
    .addField(`${user.user.username} (${LANG.lang === "ru" ? data2.nameRus : data2.name})`, `**${hm.level} ${get2.level}**`, true)
    .addField(`❤ ${hm.health} ${h1}`, `**⚔ ${hm.damage} ${d1}**`, true)
    .setColor(main)
  

    
  await pd.findOneAndUpdate({userID: message.author.id}, {$set: {rpg: Date.now()}})
  let msg = await message.channel.send({embeds: [myHero], files: [att]});
  damn.delete()
  let rand = Math.floor(Math.random() * 32)
  if (rand < 16) {
    while (true) {
      h1 -= d2
      h2 -= d1
      if(h1 <= 0) {
        winner = message.author;
        loser = user;
        break;
      } else if (h2 <= 0) {
        winner = user;
        loser = message.author;
        break;
      }
    }
  } else {
    while (true) {
      h2 -= d1
      h1 -= d2
      if(h2 <= 0) {
        winner = user;
        loser = message.author;
        break;
      } else if (h1 <= 0) {
        winner = message.author;
        loser = user;
        break;
      }
    }
  }


  await rpg.findOneAndUpdate({userID: winner.id}, {$inc: {totalGames: 1}})
  await rpg.findOneAndUpdate({userID: loser.id}, {$inc: {totalGames: 1}})


  setTimeout(async() => {
    const us1 = await rpgFind(winner.id);
    const us2 = await rpgFind(loser.id);

    const member1 = message.guild.members.cache.get(winner.id);
    const member2 = message.guild.members.cache.get(loser.id);
        
    const winCup = Rate(message).winRewardGenerator(us1.league.id || 0);
    await Rate(message).rateUpdate(winner.id, winCup);
    await Rate(message).rateUpdate(loser.id, -45);

    await rpg.findOneAndUpdate({userID: winner.id}, {$inc: {wins: 1}})
    await rpg.findOneAndUpdate({userID: loser.id}, {$inc: {loses: 1}})

    let winData = await rpg.findOne({userID: winner.id})
    const DATA = await getHeroData(bot, winner.id, winData);
    const get = winData.heroes.find(x => x.name === winData.item)
    let hero = heroes[winData.item];

    const att2 = new MessageAttachment(hero.path, `${hero.name}.png`);
    
    let winEmb = new MessageEmbed()
    .setTitle(`${d.winner} ${winner.tag || winner.user.tag} (${LANG.lang === "ru" ? hero.nameRus : hero.name})`)
    .setDescription(`${d.among} ${user}, ${mUser}\n${member1}: +${winCup} ${LEAGUE.cup}\n${member2}: -45 ${LEAGUE.cup}`)
    .setImage(`attachment://${hero.name}.png`)
    .setColor(main)
    .addField(`❤ ${hm.health} ${DATA.h}`, `**⚔ ${hm.damage} ${DATA.d}**`, true)
    .addField(`🏆 ${hm.winrate}`, `**${roundFunc(winData.wins / winData.totalGames * 100) || '0'}%**`, true)
    msg.delete()
    return message.channel.send({embeds: [winEmb], files: [att2]})
  }, 25000)

  collector.stop()
}
})

collector.on("end", () => {
if (wait) {
  wait.delete()
}
});

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