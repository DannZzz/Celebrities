const heroes = require('../../JSON/heroes.json');
const { main } = require('../../JSON/colours.json');
const elements = require('../../JSON/elements.json');
const {rpgFind, serverFind} = require("../../functions/models");
const {heroType, FORCE} = require("../../config");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const {error, roundFunc, forceGenerator, formatNumber, heroStarsGenerator} = require("../../functions/functions");

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
    
    const starData = await heroStarsGenerator("get", {
      rpg: rp,
      item: rp.item
    })



    const get = rp.heroes.find(x => x.name === rp.item)
    
    const item = heroes[rp.item];

    const need = await heroStarsGenerator("need", {
      stars: starData.stars,
      type: item.type
    })

    const att = new MessageAttachment(item.path, `${item.name}.png`)
    let textedElements = item.elements.map(el => elements[el].emoji).join(" ")
    
    let myHero = new MessageEmbed()
    .setAuthor(`${user.user.tag}`)
    .setTitle(`${heroType[item.type]} ${item.name} (${item.nameRus})\n${"🌟".repeat(starData.stars)}  ${starData.added} / ${need}\n${hm.level} ${get.level}\n ${FORCE} ${hm.force} ${forceGenerator(get.health, get.level, get.damage)}\n${LANG.lang === "en" ? "Elements:" : "Стихия:"} ${textedElements}`)
    .setThumbnail(`attachment://${item.name}.png`)
    .addField(`❤ ${hm.health}`, `${formatNumber(get.health)}`, true)
    .addField(`⚔ ${hm.damage}`, `${formatNumber(get.damage)}`, true)
    .setColor(main)

    return message.channel.send({embeds: [myHero], files: [att]}).then(msg => setTimeout(()=>msg.delete(), 30 * 1000))
  } else {
    return error(message, hm.noHero);
  }

  }
};
