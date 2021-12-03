const heroes = require('../../JSON/heroes.json');
const { main } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed } = require("discord.js");
const { COIN, AGREE } = require("../../config");
const {error, embed, perms, firstUpperCase, makeTimestamp} = require("../../functions/functions");
const {eventFind} = require("../../functions/models");
const items = require('../../JSON/items');

module.exports = {
  config: {
    name: "bag",
    aliases: ['сумка'],
    category: 'h_roleplay'
  },
  run: async (bot, message, args, ops) => {
    

    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {use: u, buy: b, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   

    const user = message.author;

    const ev = await eventFind(user.id)
    
    const profile = await pd.findOne({userID: user.id});
    const rp = await rpg.findOne({userID: user.id});

    const emb = new MessageEmbed()
    .setAuthor(user.tag)
    .setColor(main)
    .setThumbnail(user.displayAvatarURL({dynamic: true}))
    
    .addField(`${items.box.emoji} ${LANG.lang === "en" ? items.box.NAMEEN : items.box.NAME}:`, `${rp["box"] || 0}`, true)
    .addField(`${items.megabox.emoji} ${LANG.lang === "en" ? items.megabox.NAMEEN : items.megabox.NAME}:`, `${rp["megabox"] || 0}`, true)
    .addField(`${items.hlt.emoji} ${LANG.lang === "en" ? items.hlt.NAMEEN : items.hlt.NAME}:`, `${rp["hlt"] || 0}`, true)
    .addField(`${items.dmg.emoji} ${LANG.lang === "en" ? items.dmg.NAMEEN : items.dmg.NAME}:`, `${rp["dmg"] || 0}`, true)
    .addField(`${items.lvl.emoji} ${LANG.lang === "en" ? items.lvl.NAMEEN : items.lvl.NAME}:`, `${rp["lvl"] || 0}`, true)
    .addField(`${items.meat.emoji} ${LANG.lang === "en" ? items.meat.NAMEEN : items.meat.NAME}:`, `${rp["meat"] || 0}`, true)
    .addField(`${items.pack1.emoji} ${LANG.lang === "en" ? items.pack1.NAMEEN : items.pack1.NAME}:`, `${rp["pack1"] || 0}`, true)
    .addField(`${items.pack2.emoji} ${LANG.lang === "en" ? items.pack2.NAMEEN : items.pack2.NAME}:`, `${rp["pack2"] || 0}`, true)
    .addField(`${items.pack3.emoji} ${LANG.lang === "en" ? items.pack3.NAMEEN : items.pack3.NAME}:`, `${rp["pack3"] || 0}`, true)
    .addField(`${items.tempPack.emoji} ${LANG.lang === "en" ? items.tempPack.NAMEEN : items.tempPack.NAME}:`, `${rp["tempPack"] || 0}`, true)
    .addField(`${items.donateBox.emoji} ${LANG.lang === "en" ? items.donateBox.NAMEEN : items.donateBox.NAME}:`, `${rp["donateBox"] || 0}`, true)
    .addField(`${items.goldBox.emoji} ${LANG.lang === "en" ? items.goldBox.NAMEEN : items.goldBox.NAME}:`, `${rp["goldBox"] || 0}`, true)
    .addField(`${items.halloween.emoji} ${LANG.lang === "en" ? items.halloween.NAMEEN : items.halloween.NAME}:`, `${ev["candyBox"] || 0}`, true)
      

    return message.channel.send({embeds: [emb]})
  }
}