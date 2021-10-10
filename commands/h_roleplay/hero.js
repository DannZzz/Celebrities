const heroes = require('../../JSON/heroes.json');
const { main } = require('../../JSON/colours.json');
const {rpgFind, serverFind} = require("../../functions/models");
const {heroType} = require("../../config");
const { MessageEmbed } = require("discord.js");
const {error, roundFunc} = require("../../functions/functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);

module.exports = {
  config: {
    name: "hero",
    aliases: ['герой'],
    category: 'h_roleplay'
  },
  run: async (bot, message, args) => {

    const LANG = await serverFind(message.guild.id);
    const {hero: h, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   
   
    
       
    const user = message.member;
    let rp = await rpgFind(user.id)
    if (rp && rp.item) {
    if (rp.item === null && rp.heroes && rp.heroes.length !== 0) await rpg.findOneAndUpdate({userID: user.id}, {$set: {item: rp.heroes[0]["name"]}});

    rp = await rpgFind(user.id);
    

    const get = rp.heroes.find(x => x.name === rp.item)
    
    const item = heroes[rp.item]
    let myHero = new MessageEmbed()
    .setAuthor(`${user.user.tag}`)
    .setTitle(`${heroType[item.type]} ${item.name} (${item.nameRus})\n${hm.level} ${get.level}`)
    .setDescription(LANG.lang === "ru" ? item.description : item.descriptionEN)
    .setThumbnail(item.url)
    .addField(`❤ ${hm.health}`, `${get.health}`, true)
    .addField(`⚔ ${hm.damage}`, `${get.damage}`, true)
    .setColor(main)

    return message.channel.send({embeds: [myHero]}).then(msg => setTimeout(()=>msg.delete(), 30 * 1000))
  } else {
    return error(message, hm.noHero);
  }

  }
};
