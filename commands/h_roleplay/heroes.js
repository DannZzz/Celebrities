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
         
    let allDrags = []

    const zeenou = heroes["Zeenou"]
    const dragon1 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${zeenou.name} (${zeenou.nameRus}) ${cVip(zeenou.vip)}`)
    .setThumbnail(zeenou.url)
    .setDescription(LANG.lang === "en" ? zeenou.descriptionEN : zeenou.description)
    .addField(`${hh.cost} ${zeenou.cost} ${cType(zeenou.costType)}`, `**${hh.avail} ${zeenou.available === "Да" ? hh.yes : hh.noavail}**`, true)
    .addField(`${hm.health} ${zeenou.health} ❤`, `**${hm.damage} ${zeenou.damage}** ⚔`, true)
    allDrags.push(dragon1)

    const dilan = heroes["Dilan"]
    const dragon2 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${dilan.name} (${dilan.nameRus}) ${cVip(dilan.vip)}`)
    .setThumbnail(dilan.url)
    .setDescription(LANG.lang === "en" ? dilan.descriptionEN : dilan.description)
    .addField(`${hh.cost} ${dilan.cost} ${cType(dilan.costType)}`, `**${hh.avail} ${dilan.available === "Да" ? hh.yes : hh.noavail}**`, true)
    .addField(`${hm.health} ${dilan.health} ❤`, `**${hm.damage} ${dilan.damage}** ⚔`, true)
    allDrags.push(dragon2)

    const Archangel = heroes["Archangel"]
    const arch = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${Archangel.name} (${Archangel.nameRus}) ${cVip(Archangel.vip)}`)
    .setThumbnail(Archangel.url)
    .setDescription(LANG.lang === "en" ? Archangel.descriptionEN : Archangel.description)
    .addField(`${hh.cost} ${Archangel.cost} ${cType(Archangel.costType)}`, `**${hh.avail} ${Archangel.available === "Да" ? hh.yes : hh.noavail}**`, true)
    .addField(`${hm.health} ${Archangel.health} ❤`, `**${hm.damage} ${Archangel.damage}** ⚔`, true)
    allDrags.push(arch)

    const darius = heroes["Darius"]
    const dragon3 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${darius.name} (${darius.nameRus}) ${cVip(darius.vip)}`)
    .setThumbnail(darius.url)
    .setDescription(LANG.lang === "en" ? darius.descriptionEN : darius.description)
    .addField(`${hh.cost} ${hh.nocost} ${cType(darius.costType)}`, `**${hh.avail} ${darius.available === "Да" ? hh.yes : hh.noavail}**`, true)
    .addField(`${hm.health} ${darius.health} ❤`, `**${hm.damage} ${darius.damage}** ⚔`, true)
    allDrags.push(dragon3)

    const selena = heroes["Selena"]
    const dragon4 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${selena.name} (${selena.nameRus}) ${cVip(selena.vip)}`)
    .setThumbnail(selena.url)
    .setDescription(LANG.lang === "en" ? selena.descriptionEN : selena.description)
    .addField(`${hh.cost} ${selena.cost} ${cType(selena.costType)}`, `**${hh.avail} ${selena.available === "Да" ? hh.yes : hh.noavail}**`, true)
    .addField(`${hm.health} ${selena.health} ❤`, `**${hm.damage} ${selena.damage}** ⚔`, true)
    allDrags.push(dragon4)

    const kumb = heroes["Kumbhakarna"]
    const Kumbhakarna = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${kumb.name} (${kumb.nameRus}) ${cVip(kumb.vip)}`)
    .setThumbnail(kumb.url)
    .setDescription(LANG.lang === "en" ? kumb.descriptionEN : kumb.description)
    .addField(`${hh.cost} ${kumb.cost} ${cType(kumb.costType)}`, `**${hh.avail} ${kumb.available === "Да" ? hh.yes : hh.noavail}**`, true)
    .addField(`${hm.health} ${kumb.health} ❤`, `**${hm.damage} ${kumb.damage}** ⚔`, true)
    allDrags.push(Kumbhakarna)

    const cthulhu = heroes["Cthulhu"]
    const dragon5 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${cthulhu.name} (${cthulhu.nameRus}) ${cVip(cthulhu.vip)}`)
    .setThumbnail(cthulhu.url)
    .setDescription(LANG.lang === "en" ? cthulhu.descriptionEN : cthulhu.description)
    .addField(`${hh.cost} ${cthulhu.cost} ${cType(cthulhu.costType)}`, `**${hh.avail} ${cthulhu.available === "Да" ? hh.yes : hh.noavail}**`, true)
    .addField(`${hm.health} ${cthulhu.health} ❤`, `**${hm.damage} ${cthulhu.damage}** ⚔`, true)
    allDrags.push(dragon5)

    const zeus = heroes["Zeus"]
    const dragon6 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${zeus.name} (${zeus.nameRus}) ${cVip(zeus.vip)}`)
    .setThumbnail(zeus.url)
    .setDescription(LANG.lang === "en" ? zeus.descriptionEN : zeus.description)
    .addField(`${hh.cost} ${LANG.lang === "ru" ? zeus.cost : zeus.costUSD} ${cType(zeus.costType)}`, `**${hh.avail} ${hh.donate}**`, true)
    .addField(`${hm.health} ${zeus.health} ❤`, `**${hm.damage} ${zeus.damage}** ⚔`, true)
    allDrags.push(dragon6)

    const perfectDuo = heroes["Perfect-Duo"]
    const dragon7 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${perfectDuo.name} (${perfectDuo.nameRus}) ${cVip(perfectDuo.vip)}`)
    .setThumbnail(perfectDuo.url)
    .setDescription(LANG.lang === "en" ? perfectDuo.descriptionEN : perfectDuo.description)
    .addField(`${hh.cost} ${perfectDuo.cost} ${cType(perfectDuo.costType)}`, `**${hh.avail} ${perfectDuo.available === "Да" ? hh.yes : hh.noavail}**`, true)
    .addField(`${hm.health} ${perfectDuo.health} ❤`, `**${hm.damage} ${perfectDuo.damage}** ⚔`, true)
    allDrags.push(dragon7)

    const eragon = heroes["Eragon"]
    const dragon8 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${eragon.name} (${eragon.nameRus}) 💞 ${cVip(eragon.vip)}`)
    .setThumbnail(eragon.url)
    .setDescription(LANG.lang === "en" ? eragon.descriptionEN : eragon.description)
    .addField(`${hh.cost} ${eragon.cost} ${cType(eragon.costType)}`, `**${hh.avail} ${eragon.available === "Да" ? hh.yes : hh.noavail}**`, true)
    .addField(`${hm.health} ${eragon.health} ❤`, `**${hm.damage} ${eragon.damage}** ⚔`, true)
    allDrags.push(dragon8)
    
    const ariel = heroes["Ariel"]
    const dragon9 = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${ariel.name} (${ariel.nameRus}) ${cVip(ariel.vip)}`)
    .setThumbnail(ariel.url)
    .setDescription(LANG.lang === "en" ? ariel.descriptionEN : ariel.description)
    .addField(`${hh.cost} ${ariel.cost} ${cType(ariel.costType)}`, `**${hh.avail} ${ariel.available === "Да" ? hh.yes : hh.noavail}**`, true)
    .addField(`${hm.health} ${ariel.health} ❤`, `**${hm.damage} ${ariel.damage}** ⚔`, true)
    allDrags.push(dragon9)

    const Darkangel = heroes["Darkangel"]
    const dark = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${Darkangel.name} (${Darkangel.nameRus}) ${cVip(Darkangel.vip)}`)
    .setThumbnail(Darkangel.url)
    .setDescription(LANG.lang === "en" ? Darkangel.descriptionEN : Darkangel.description)
    .addField(`${hh.cost} ${Darkangel.cost} ${cType(Darkangel.costType)}`, `**${hh.avail} ${Darkangel.available === "Да" ? hh.yes : hh.noavail}**`, true)
    .addField(`${hm.health} ${Darkangel.health} ❤`, `**${hm.damage} ${Darkangel.damage}** ⚔`, true)
    allDrags.push(dark)

    const Atalanta = heroes["Atalanta"]
    const at = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${Atalanta.name} (${Atalanta.nameRus}) ${cVip(Atalanta.vip)}`)
    .setThumbnail(Atalanta.url)
    .setDescription(LANG.lang === "en" ? Atalanta.descriptionEN : Atalanta.description)
    .addField(`${hh.cost} ${Atalanta.cost} ${cType(Atalanta.costType)}`, `**${hh.avail} ${Atalanta.available === "Да" ? hh.yes : hh.noavail}**`, true)
    .addField(`${hm.health} ${Atalanta.health} ❤`, `**${hm.damage} ${Atalanta.damage}** ⚔`, true)
    allDrags.push(at)
    
    const Countess = heroes["Athena"]
    const ct = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${Countess.name} (${Countess.nameRus}) ${cVip(Countess.vip)}`)
    .setThumbnail(Countess.url)
    .setDescription(LANG.lang === "en" ? Countess.descriptionEN : Countess.description)
    .addField(`${hh.cost} ${Countess.cost} ${cType(Countess.costType)}`, `**${hh.avail} ${Countess.available === "Да" ? hh.yes : hh.noavail}**`, true)
    .addField(`${hm.health} ${Countess.health} ❤`, `**${hm.damage} ${Countess.damage}** ⚔`, true)
    allDrags.push(ct)

    const bl = heroes["Blazer"]
    const ctt = new MessageEmbed()
    .setColor(cyan)
    .setTitle(`${bl.name} (${bl.nameRus}) ${cVip(bl.vip)}`)
    .setThumbnail(bl.url)
    .setDescription(LANG.lang === "en" ? bl.descriptionEN : bl.description)
    .addField(`${hh.cost} ${bl.cost} ${cType(bl.costType)}`, `**${hh.avail} ${bl.available === "Да" ? hh.yes : hh.noavail}**`, true)
    .addField(`${hm.health} ${bl.health} ❤`, `**${hm.damage} ${bl.damage}** ⚔`, true)
    allDrags.push(ctt)
    
    const timeout = '100000'
    const userids = [message.author.id]
    const pages = allDrags
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
    pagination(message, pages, buttonList, timeout, userids)


    function cVip(bool) {
      let res = bool ? '-VIP-' : ''
      return res;
    }
    function cType(type) {
      if(type === 'star') {return STAR}
      else if (type === "coin") {
        return COIN
      } else if (type === 'dev'){
        return ''
      }
    }
  }
};
