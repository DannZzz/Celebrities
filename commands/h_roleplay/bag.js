const heroes = require('../../JSON/heroes.json');
const { main } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed } = require("discord.js");
const { COIN, AGREE } = require("../../config");
const { checkValue } = require("../../functions/functions");
const {error, embed, perms, firstUpperCase} = require("../../functions/functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);
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

    
    
    const profile = await pd.findOne({userID: user.id});
    const rp = await rpg.findOne({userID: user.id});

    const emb = new MessageEmbed()
    .setAuthor(user.tag)
    .setColor(main)
    .setThumbnail(user.displayAvatarURL({dynamic: true}))
    
    .addField(`**#1** ${items.box.emoji} :`, `${rp["box"] || 0}`, true)
    .addField(`**#2** ${items.hlt.emoji} :`, `${rp["hlt"] || 0}`, true)
    .addField(`**#3** ${items.dmg.emoji} :`, `${rp["dmg"] || 0}`, true)
    .addField(`**#4** ${items.lvl.emoji} :`, `${rp["lvl"] || 0}`, true)
    .addField(`**#5** ${items.meat.emoji}:`, `${rp["meat"] || 0}`, true)
    .addField(`**#6** ${items.pack1.emoji} :`, `${rp["pack1"] || 0}`, true)
    .addField(`**#7** ${items.pack2.emoji} :`, `${rp["pack2"] || 0}`, true)
    .addField(`**#8** ${items.pack3.emoji} :`, `${rp["pack3"] || 0}`, true)
    .addField(`**#9** ${items.tempPack.emoji} :`, `${rp["tempPack"] || 0}`, true)
    .addField(`**#10** ${items.donateBox.emoji} :`, `${rp["donateBox"] || 0}`, true)
    .addField(`**#11** ${items.goldBox.emoji} :`, `${rp["goldBox"] || 0}`, true)
      

    return message.channel.send({embeds: [emb]})
  }
}