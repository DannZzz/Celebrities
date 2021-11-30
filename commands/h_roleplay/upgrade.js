const heroes = require('../../JSON/heroes.json');
const { main } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed } = require("discord.js");
const { COIN, STAR, AGREE } = require("../../config");
const { checkValue, heroStarsGenerator } = require("../../functions/functions");

const levels = require("../../JSON/starLevels.json");

const {error} = require("../../functions/functions");

module.exports = {
  config: {
    name: "upgrade",
    aliases: ['update', 'прокачать'],
    category: 'h_roleplay',
    cooldown: 7
  },
  run: async (bot, message, args, ops, tr) => {

    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {upgrade: u, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   
         
    const rp = await rpg.findOne({userID: message.author.id});
    const data = await bd.findOne({userID: message.author.id});
    const bal = data.stars;

    if(!rp || rp.item === null) {
    return error(message, hm.noHero)
    };
    const user = message.author;
    let hero = heroes[rp.item]
    let firstLevel = 1;
    let levelCost = hero.upgradeCost;
    const get = rp.heroes.find(x => x.name === rp.item)
    let requiredValue = get.level * levelCost;

    const resp = ['info', 'инфо'];
    const stars = ["star", "stars", "звезда", "звезды", "звёзды"];
    
    const getIndex = rp.heroes.findIndex(x => x.name === rp.item);
    
    const heroType = heroes[rp.item];

    let addH = getUpgrade(heroType.type);
    let addD = getUpgrade(heroType.type) / 10;

    if(args[0] && resp.includes(args[0].toLowerCase())) {
      const newEmb = new MessageEmbed()
      .setColor(main)
      .setTimestamp()
      .setAuthor(`${u.info} ${get.level+1}`)
      .setTitle(`${hero.name} (${hero.nameRus})`)
      .setDescription(`**${u.cost} ${requiredValue} ${STAR}**`)
      .addField(`❤ ${hm.health}`, `${get.health} + ${addH}`, true)
      .addField(`⚔ ${hm.damage}`, `${get.damage} + ${addD}`, true)
      .setThumbnail(hero.url)

      return message.channel.send({embeds: [newEmb]})
    } else if (args[0] && stars.includes(args[0].toLowerCase())) {
      let toAdd = 1;
      if (args[1] && !isNaN(args[1]) && Math.round(args[1]) > 0) toAdd = Math.round(args[1]);

      const starData = await heroStarsGenerator("get", {
        rpg: rp,
        item: rp.item
      });

      if (starData.stars >= levels.max) return error(message, await tr(`${levels.max} пока что самый максимальный!`))

      const did = await heroStarsGenerator("update", {
        rpg: rp,
        item: rp.item,
        countToAdd: toAdd
      });

      if (did) {
        return message.react(AGREE)
      } else {
        return error(message, await tr("В хранилище не нашлись такие герои!"));
      }



    }

    if (bal < requiredValue) return error(message, `${u.err} — **${requiredValue}** ${STAR}.`)
    let a = rp.heroes.indexOf(rp.heroes.filter(a => a["name"] === rp.item))
    let b = rp.heroes[a];
    
    await Promise.all([
      rpg.findOneAndUpdate({userID: message.author.id}, {$inc: {[`heroes.${getIndex}.health`]: addH}}),
      rpg.findOneAndUpdate({userID: message.author.id}, {$inc: {[`heroes.${getIndex}.level`]: 1}}),
      rpg.findOneAndUpdate({userID: message.author.id}, {$inc: {[`heroes.${getIndex}.damage`]: addD}}),
      bd.findOneAndUpdate({userID: message.author.id}, {$inc: {stars: -requiredValue}}),
      ])
    


    let Embed = new MessageEmbed()
    .setAuthor(`${u.done} ${get.level + 1}`)
    .setTitle(`${hero.name} (${hero.nameRus})`)
    .addField(`❤ ${hm.health}`, `${get.health + addH}`, true)
    .addField(`⚔ ${hm.damage}`, `${get.damage + addD}`, true)
    .setColor(main)
    .setThumbnail(hero.url)

    return message.channel.send({embeds: [Embed]})
  }
};

function getUpgrade (type) {
  switch (type) {
    case "common":
      return 150;
    case "elite":
      return 250;
    case "furious":
      return 320;
    case "mythical":
      return 500;
    case "private":
      return 400;
    default:
      return;
  }
}
