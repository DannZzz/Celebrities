const heroes = require('../../JSON/heroes.json');
const { main } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const { MessageEmbed, MessageButton } = require("discord.js");
const { COIN, STAR, LEFT, RIGHT, DLEFT, DRIGHT, CANCEL, heroType } = require("../../config");
const {error, paginationBig} = require("../../functions/functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "heroes",
    aliases: ['герои'],
    category: 'h_roleplay',
  },
  run: async (bot, message, args) => {
    
      const getLang = require("../../models/serverSchema");
      const LANG = await getLang.findOne({serverID: message.guild.id});
      const {heroes: hh, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`); 
         

    let newdr = []
    for (let key in heroes) {
      var obj = heroes[key];

      let ccost = `${cCost(obj.cost)} ${cType(obj.costType)}`;
      if (!isNaN(obj.cost) && obj.cost <= 0) ccost = LANG.lang === "ru" ? "Бесплатно" : "Free";

        newdr.push(
        new MessageEmbed()
        .setColor(main)
        .setTitle(`${heroType[obj.type]} ${obj.name} (${obj.nameRus}) ${cMar(obj.marry)} ${cVip(obj.vip)}`)
        .setThumbnail(obj.url)
        .setDescription(LANG.lang === "en" ? obj.descriptionEN : obj.description)
        .addField(`${hh.cost} ${ccost}`, `**${hh.avail} ${cAv(obj.available)}**`, true)
        .addField(`${hm.health} ${obj.health} ❤`, `**${hm.damage} ${obj.damage}** ⚔`, true)
        )
      
    }

    
    
    const timeout = 100000;
    const userids = [message.author.id]
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
    function cAv(av) {
      if (av === "Да") {
        return hh.yes
      } else if (av === "Донат") {
        return hh.donate
      } else if (av === "Под") {
        return hh.noavail
      } else if (av === "пак") {
        return hh.pack
      }
    }
    function cCost(cost, obj) {
      if (!isNaN(cost)) {
        return cost
      } else if (cost.endsWith("₽") && LANG.lang === "ru") {
        return cost
      } else if (cost.endsWith("₽") && LANG.lang === "en") {
        return obj.costUSD;
      } else {
        return hh.nocost
      }
    }
    function cMar(bool) {
      let res = bool ? '💞' : ''
      return res;
    }
    function cVip(bool) {
      let res = bool ? '-PREMIUM-' : ''
      return res;
    }
    function cType(type) {
      if(type === 'star') {return STAR}
       else {
        return ''
      } 
    }
  }
};
