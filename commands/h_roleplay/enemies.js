const enemies = require('../../JSON/enemies.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const { MessageEmbed, MessageButton } = require("discord.js");
const { COIN, STAR } = require("../../config");
const {error, pagination} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "enemies",
    aliases: '',
    category: 'h_roleplay',
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return

      const getLang = require("../../models/serverSchema");
      const LANG = await getLang.findOne({serverID: message.guild.id});
      const {enemies: e, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`); 
      
       
    let allEnemies = []

    const jorj = enemies["Jorj"]
    const enemy1 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${jorj.name} (${jorj.nameRus})`)
    .setThumbnail(jorj.url)
    .setDescription(LANG.lang === "en" ? jorj.descriptionEN : jorj.description)
    .addField(`❤ ${hm.health} ${jorj.health} х ${hm.level}`, `⚔ **${hm.damage} ${jorj.damage} х ${hm.level}**`, true)
    allEnemies.push(enemy1)

    const cousin = enemies["Cousin"]
    const enemy2 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${cousin.name} (${cousin.nameRus})`)
    .setThumbnail(cousin.url)
    .setDescription(LANG.lang === "en" ? cousin.descriptionEN : cousin.description)
    .addField(`❤ ${hm.health} ${cousin.health} х ${hm.level}`, `⚔ **${hm.damage} ${cousin.damage} х ${hm.level}**`, true)
    allEnemies.push(enemy2)

    const arthas = enemies["Arthas"]
    const enemy3 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${arthas.name} (${arthas.nameRus})`)
    .setThumbnail(arthas.url)
    .setDescription(LANG.lang === "en" ? arthas.descriptionEN : arthas.description)
    .addField(`❤ ${hm.health} ${arthas.health} х ${hm.level}`, `⚔ **${hm.damage} ${arthas.damage} х ${hm.level}**`, true)
    allEnemies.push(enemy3)

    const dwolf = enemies["D'Wolf"]
    const enemyWolf = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${dwolf.name} (${dwolf.nameRus})`)
    .setThumbnail(dwolf.url)
    .setDescription(LANG.lang === "en" ? dwolf.descriptionEN : dwolf.description)
    .addField(`❤ ${hm.health} ${dwolf.health} х ${hm.level}`, `⚔ **${hm.damage} ${dwolf.damage} х ${hm.level}**`, true)
    allEnemies.push(enemyWolf)

    const dLord = enemies["D'Lord"]
    const enemy4 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${dLord.name} (${dLord.nameRus})`)
    .setThumbnail(dLord.url)
    .setDescription(LANG.lang === "en" ? dLord.descriptionEN : dLord.description)
    .addField(`❤ ${hm.health} ${dLord.health} х ${hm.level}`, `⚔ **${hm.damage} ${dLord.damage} х ${hm.level}**`, true)
    allEnemies.push(enemy4)

    const eaterSkull = enemies["EaterSkull"]
    const enemy5 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${e.boss} ${eaterSkull.name} (${eaterSkull.nameRus})`)
    .setThumbnail(eaterSkull.url)
    .setDescription(LANG.lang === "en" ? eaterSkull.descriptionEN : eaterSkull.description)
    .addField(`❤ ${hm.health} ${eaterSkull.health}`, `⚔ **${hm.damage} ${eaterSkull.damage}**\n**Награда: ${eaterSkull.reward}** ${STAR}`, true)
    allEnemies.push(enemy5)

    const fireWalker = enemies["FireWalker"]
    const enemy6 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${e.boss} ${fireWalker.name} (${fireWalker.nameRus})`)
    .setThumbnail(fireWalker.url)
    .setDescription(LANG.lang === "en" ? fireWalker.descriptionEN : fireWalker.description)
    .addField(`❤ ${hm.health} ${fireWalker.health}`, `⚔ **${hm.damage} ${fireWalker.damage}**\n**Награда: ${fireWalker.reward}** ${STAR}`, true)
    allEnemies.push(enemy6)

    const emojies = ['⏪', '◀️', '⏹️', '▶️', '⏩']
    const timeout = '100000'
    const userids = [message.author.id]
    const pages = allEnemies
    const button1 = new MessageButton()
          .setCustomId('previousbtn')
          .setLabel(e.t1)
          .setStyle('DANGER');

          const button2 = new MessageButton()
          .setCustomId('nextbtn')
          .setLabel(e.t2)
          .setStyle('SUCCESS');

    let buttonList = [
        button1,
        button2
    ]
    pagination(message, pages, buttonList, timeout, userids)


  }
};
