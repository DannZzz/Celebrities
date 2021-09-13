const heroes = require('../../JSON/heroes.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const { MessageEmbed, MessageButton } = require("discord.js");
const { COIN, STAR } = require("../../config");
const {error, pagination} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "heroes",
    aliases: '',
    category: 'h_roleplay',
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return
      const getLang = require("../../models/serverSchema");
      const LANG = await getLang.findOne({serverID: message.guild.id});
      const {heroes: hh, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`); 
         

    let newdr = []
    for (let key in heroes) {
      var obj = heroes[key];

        newdr.push(
        new MessageEmbed()
        .setColor(cyan)
        .setTitle(`${obj.name} (${obj.nameRus}) ${cMar(obj.marry)} ${cVip(obj.vip)}`)
        .setThumbnail(obj.url)
        .setDescription(LANG.lang === "en" ? obj.descriptionEN : obj.description)
        .addField(`${hh.cost} ${cCost(obj.cost)} ${cType(obj.costType)}`, `**${hh.avail} ${cAv(obj.available)}**`, true)
        .addField(`${hm.health} ${obj.health} ❤`, `**${hm.damage} ${obj.damage}** ⚔`, true)
        )
      
    }

    
    
    const timeout = '100000'
    const userids = [message.author.id]
    const button1 = new MessageButton()
          .setCustomId('previousbtn')
          .setLabel(hh.t1)
          .setStyle('DANGER');

          const button2 = new MessageButton()
          .setCustomId('nextbtn')
          .setLabel(hh.t2)
          .setStyle('SUCCESS');

    let buttonList = [
        button1,
        button2
    ]
    pagination(message, newdr, buttonList, timeout, userids)
    function cAv(av) {
      if (av === "Да") {
        return hh.yes
      } else if (av === "Донат") {
        return hh.donate
      } else if (av === "Под") {
        return hh.noavail
      }
    }
    function cCost(cost) {
      if (!isNaN(cost)) {
        return cost
      } else if (cost.endsWith("₽") && LANG.lang === "ru") {
        return cost
      } else if (cost.endsWith("₽") && LANG.lang === "en") {
        return "2,73$"
      } else {
        return hh.nocost
      }
    }
    function cMar(bool) {
      let res = bool ? '💞' : ''
      return res;
    }
    function cVip(bool) {
      let res = bool ? '-VIP-' : ''
      return res;
    }
    function cType(type) {
      if(type === 'star') {return STAR}
       else if (type === 'dev'){
        return ''
      }
    }
  }
};
