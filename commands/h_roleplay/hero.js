const heroes = require('../../JSON/heroes.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed } = require("discord.js");
const {error} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);

module.exports = {
  config: {
    name: "hero",
    aliases: ['герой'],
    category: 'h_roleplay'
  },
  run: async (bot, message, args) => {

    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {hero: h, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   
   
    let limited = rateLimiter.take(message.author.id)
      if(limited) return
       
    const user = message.member;
    let rp = await rpg.findOne({userID: user.id});
    if (rp && rp.item) {
    // if (rp.item === null && rp.heroes && rp.heroes.length !== 0) {
    //   await rpg.findOneAndUpdate({userID: user.id}, {$set: {item: rp.heroes[0]["name"]}});
    //   await rpg.findOneAndUpdate({userID: user.id}, {$set: {health: rp.heroes[0]["health"]}});
    //   await rpg.findOneAndUpdate({userID: user.id}, {$set: {damage: rp.heroes[0]["damage"]}});
    //   await rpg.findOneAndUpdate({userID: user.id}, {$set: {level: rp.heroes[0]["level"]}});
    // }
    // rp = await rpg.findOne({userID: user.id});
    // if(rp.item !== null) {
    //   if ((rp.heroes && rp.heroes.length === 1 && rp.item !== rp.heroes[0]["name"]) || ((rp.heroes && rp.heroes.length === 0) || !rp.heroes)) {
    //     await rp.heroes.push({
    //             name: rp.item,
    //             level: rp.level,
    //             health: rp.health,
    //             damage: rp.damage
    //         })
    //     rp.save()
    // }

    const get = rp.heroes.find(x => x.name === rp.item)
    
    const item = heroes[rp.item]
    let myHero = new MessageEmbed()
    .setAuthor(`${user.user.tag}`)
    .setTitle(`${item.name} (${item.nameRus})\n${hm.level} ${get.level}  ${h.journey}: ${rp.surviveLevel}`)
    .setDescription(LANG.lang === "ru" ? item.description : item.descriptionEN)
    .setThumbnail(item.url)
    .addField(`❤ ${hm.health}`, `${get.health}`, true)
    .addField(`⚔ ${hm.damage}`, `${get.damage}`, true)
    .addField(`🟡 ${h.all}`, `${rp.totalGames}`, false)
    .addField(`🟢 ${h.win}`, `${rp.wins}`, true)
    .addField(`🔴 ${h.lose}`, `${rp.loses}`, true)
    .addField(`🏆 ${hm.winrate}`, `${Math.trunc(rp.wins / rp.totalGames  * 100) || '0'}%`, true)
    .setColor(cyan)

    return message.channel.send({embeds: [myHero]}).then(msg => setTimeout(()=>msg.delete(), 30 * 1000))
  } else {
    return error(message, hm.noHero);
  }

  }
};
