const heroes = require('../../JSON/heroes.json');
const { main } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed } = require("discord.js");
const { COIN, STAR } = require("../../config");
const { checkValue } = require("../../functions/functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);
const {error} = require("../../functions/functions");

module.exports = {
  config: {
    name: "upgrade",
    aliases: ['update', 'прокачать'],
    category: 'h_roleplay'
  },
  run: async (bot, message, args, ops) => {

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

    const resp = ['info', 'инфо']
    
    const getIndex = rp.heroes.findIndex(x => x.name === rp.item)

    let addH = 500;
    let addD = 40;

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
    }

    ops.cards.set(user.id, {Card: "on"});
    setTimeout(() => ops.cards.delete(user.id), 30000);
    
    if (bal < requiredValue) return error(message, `${u.err} — **${requiredValue}** ${STAR}.`)
    let a = rp.heroes.indexOf(rp.heroes.filter(a => a["name"] === rp.item))
    let b = rp.heroes[a];
  
    await rpg.findOneAndUpdate({userID: message.author.id}, {$inc: {[`heroes.${getIndex}.health`]: addH}});
    await rpg.findOneAndUpdate({userID: message.author.id}, {$inc: {[`heroes.${getIndex}.level`]: 1}});
    await rpg.findOneAndUpdate({userID: message.author.id}, {$inc: {[`heroes.${getIndex}.damage`]: addD}});
    
    await bd.findOneAndUpdate({userID: message.author.id}, {$inc: {stars: -requiredValue}});


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
