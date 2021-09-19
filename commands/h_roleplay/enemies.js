const enemies = require('../../JSON/enemies.json');
const { main } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const { MessageEmbed, MessageButton } = require("discord.js");
const { COIN, STAR, LEFT, RIGHT, DLEFT, DRIGHT, CANCEL } = require("../../config");
const {error, paginationBig} = require("../../functions/functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "enemies",
    aliases: ['враги'],
    category: 'h_roleplay',
  },
  run: async (bot, message, args) => {
    

      const getLang = require("../../models/serverSchema");
      const LANG = await getLang.findOne({serverID: message.guild.id});
      const {enemies: e, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`); 
      const asdd = hm.level.substring(0, hm.level.length-1)
    let allEnemies = []
    let newdr = [];
    for (let key in enemies) {
      var obj = enemies[key];
        newdr.push(
        new MessageEmbed()
        .setColor(main)
        .setTitle(`${obj.name} (${obj.nameRus})`)
        .setThumbnail(obj.url)
        .setDescription(`${obj.boss ? "<:monsterboss:887750235646996570> Boss\n" : ""}${LANG.lang === "en" ? obj.descriptionEN : obj.description}`)
        .addField(`❤ ${hm.health} ${obj.boss ? obj.health : `${obj.health} x ${asdd}`}`, `⚔ **${hm.damage} ${obj.boss ? obj.damage : `${obj.damage} x ${asdd}`}**`, true)
        )
      
    }

    const jorj = enemies["Jorj"]
    const enemy1 = new MessageEmbed()
    .setColor(main)
    .setTitle(`${jorj.name} (${jorj.nameRus})`)
    .setThumbnail(jorj.url)
    .setDescription(LANG.lang === "en" ? jorj.descriptionEN : jorj.description)
    .addField(`❤ ${hm.health} ${jorj.health} х ${hm.level}`, `⚔ **${hm.damage} ${jorj.damage} х ${hm.level}**`, true)
    allEnemies.push(enemy1)

    const cousin = enemies["Cousin"]
    const enemy2 = new MessageEmbed()
    .setColor(main)
    .setTitle(`${cousin.name} (${cousin.nameRus})`)
    .setThumbnail(cousin.url)
    .setDescription(LANG.lang === "en" ? cousin.descriptionEN : cousin.description)
    .addField(`❤ ${hm.health} ${cousin.health} х ${hm.level}`, `⚔ **${hm.damage} ${cousin.damage} х ${hm.level}**`, true)
    allEnemies.push(enemy2)

    const arthas = enemies["Arthas"]
    const enemy3 = new MessageEmbed()
    .setColor(main)
    .setTitle(`${arthas.name} (${arthas.nameRus})`)
    .setThumbnail(arthas.url)
    .setDescription(LANG.lang === "en" ? arthas.descriptionEN : arthas.description)
    .addField(`❤ ${hm.health} ${arthas.health} х ${hm.level}`, `⚔ **${hm.damage} ${arthas.damage} х ${hm.level}**`, true)
    allEnemies.push(enemy3)

    const dwolf = enemies["D'Wolf"]
    const enemyWolf = new MessageEmbed()
    .setColor(main)
    .setTitle(`${dwolf.name} (${dwolf.nameRus})`)
    .setThumbnail(dwolf.url)
    .setDescription(LANG.lang === "en" ? dwolf.descriptionEN : dwolf.description)
    .addField(`❤ ${hm.health} ${dwolf.health} х ${hm.level}`, `⚔ **${hm.damage} ${dwolf.damage} х ${hm.level}**`, true)
    allEnemies.push(enemyWolf)

    const dLord = enemies["D'Lord"]
    const enemy4 = new MessageEmbed()
    .setColor(main)
    .setTitle(`${dLord.name} (${dLord.nameRus})`)
    .setThumbnail(dLord.url)
    .setDescription(LANG.lang === "en" ? dLord.descriptionEN : dLord.description)
    .addField(`❤ ${hm.health} ${dLord.health} х ${hm.level}`, `⚔ **${hm.damage} ${dLord.damage} х ${hm.level}**`, true)
    allEnemies.push(enemy4)

    const eaterSkull = enemies["EaterSkull"]
    const enemy5 = new MessageEmbed()
    .setColor(main)
    .setTitle(`${e.boss} ${eaterSkull.name} (${eaterSkull.nameRus})`)
    .setThumbnail(eaterSkull.url)
    .setDescription(LANG.lang === "en" ? eaterSkull.descriptionEN : eaterSkull.description)
    .addField(`❤ ${hm.health} ${eaterSkull.health}`, `⚔ **${hm.damage} ${eaterSkull.damage}**\n**Награда: ${eaterSkull.reward}** ${STAR}`, true)
    allEnemies.push(enemy5)

    const fireWalker = enemies["FireWalker"]
    const enemy6 = new MessageEmbed()
    .setColor(main)
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
          .setEmoji(LEFT)
          .setStyle('SECONDARY');

          const button0 = new MessageButton()
          .setCustomId('0btn')
          .setEmoji(DLEFT)
          .setStyle('SECONDARY');

          const buttonlast = new MessageButton()
          .setCustomId('lastbtn')
          .setEmoji(DRIGHT)
          .setStyle('SECONDARY');

          const button2 = new MessageButton()
          .setCustomId('nextbtn')
          .setStyle('SECONDARY')
          .setEmoji(RIGHT);

          const cancel = new MessageButton()
          .setCustomId('cancel')
          .setStyle('SECONDARY')
          .setEmoji(CANCEL);

    let buttonList = [
        button0,
        button1,
        cancel,
        button2,
        buttonlast
    ]
    paginationBig(message, newdr, buttonList, timeout, userids)


  }
};
