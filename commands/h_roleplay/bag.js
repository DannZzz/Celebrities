const heroes = require('../../JSON/heroes.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed } = require("discord.js");
const { COIN, AGREE } = require("../../config");
const { checkValue } = require("../../functions");
const {error, embed, perms, firstUpperCase} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);
const items = require('../../JSON/items');

module.exports = {
  config: {
    name: "bag",
    aliases: '',
    category: 'h_roleplay'
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
    if(limited) return

    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {use: u, buy: b, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   

    const user = message.author;
    const profile = await pd.findOne({userID: user.id});
    const rp = await rpg.findOne({userID: user.id});

    const emb = new MessageEmbed()
    .setAuthor(user.tag)
    .setColor(cyan)
    .setThumbnail(user.displayAvatarURL({dynamic: true}))
    .setDescription(`
**#1** ${items.box.emoji} : ${rp["box"] || 0}

**#2** ${items.hlt.emoji} : ${rp["hlt"] || 0}

**#3** ${items.dmg.emoji} : ${rp["dmg"] || 0}

**#4** ${items.lvl.emoji} : ${rp["lvl"] || 0}

**#5** ${items.meat.emoji} : ${rp["meat"] || 0}

**#6** ${items.pack1.emoji} : ${rp["pack1"] || 0}

**#7** ${items.pack2.emoji} : ${rp["pack2"] || 0}

**#8** ${items.pack3.emoji} : ${rp["pack3"] || 0}
    `)

    return message.channel.send({embeds: [emb]})
  }
}