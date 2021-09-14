const heroes = require('../../JSON/heroes.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed, MessageButton } = require("discord.js");
const {error, pagination} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);

module.exports = {
  config: {
    name: "my",
    aliases: ['мои'],
    category: 'h_roleplay'
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
    if (limited) return

    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {my: m, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   
   
    
    const rp = await rpg.findOne({userID: message.author.id});
    if (!rp) return error(message, hm.noHero)

    // if ((rp.heroes && rp.heroes.length === 0 && rp.item !== rp.heroes[0]["name"]) && rp.item !== null) {
    //     await rp.heroes.push({
    //             name: rp.item,
    //             level: rp.level,
    //             health: rp.health,
    //             damage: rp.damage
    //         })
    //     rp.save()
    // }
    
    const item = rp.heroes[0]
    const h = heroes[item.name];
    const hero = new MessageEmbed()
    .setThumbnail(h.url)
    .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
    .setTitle(`${h.name} (${h.nameRus})`)
    .setDescription(h.description)
    .setColor(cyan)
    .addField(`💯 ${hm.level} ${item.level}\n❤ ${hm.health} ${item.health}\n⚔ ${hm.damage} ${item.damage}`, `** **`)
    .setFooter(`1 / 1`)

    if (rp.heroes.length === 1) {
        return message.channel.send({embeds: [hero]})
    } else {
      let arr = rp.heroes.map((i) => {
        const h1 = heroes[i.name];
        return new MessageEmbed()
        .setThumbnail(h1.url)
        .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
        .setTitle(`${h1.name} (${h1.nameRus})`)
        .setDescription(h1.description)
        .setColor(cyan)
        .addField(`💯 ${hm.level} ${i.level}\n❤ ${hm.health} ${i.health}\n⚔ ${hm.damage} ${i.damage}`, `** **`)
        
      })
    

    // const item1 = rp.heroes[0]
    // const h1 = heroes[item1.name];
    // const hero1 = new MessageEmbed()
    // .setThumbnail(h1.url)
    // .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
    // .setTitle(`${h1.name} (${h1.nameRus})`)
    // .setDescription(h1.description)
    // .setColor(cyan)
    // .addField(`💯 ${hm.level} ${item1.level}\n❤ ${hm.health} ${item1.health}\n⚔ ${hm.damage} ${item1.damage}`, `** **`)
    
    // const item2 = rp.heroes[1]
    // const h2 = heroes[item2.name];
    // const hero2 = new MessageEmbed()
    // .setThumbnail(h2.url)
    // .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
    // .setTitle(`${h2.name} (${h2.nameRus})`)
    // .setDescription(h2.description)
    // .setColor(cyan)
    // .addField(`💯 ${hm.level} ${item2.level}\n❤ ${hm.health} ${item2.health}\n⚔ ${hm.damage} ${item2.damage}`, `** **`)

    const button1 = new MessageButton()
                .setCustomId('previousbtn')
                .setLabel(m.b1)
                .setStyle('DANGER');

                const button2 = new MessageButton()
                .setCustomId('nextbtn')
                .setLabel(m.b2)
                .setStyle('SUCCESS');

          let buttonList = [
              button1,
              button2
          ]

          const userids = [message.author.id]

          pagination(message, arr, buttonList, 100000, userids)
    }   
  }
}