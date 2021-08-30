const heroes = require('../../JSON/heroes.json');
const enemies = require('../../JSON/enemies.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const clan = require("../../models/clanSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { COIN, STAR, CLAN } = require("../../config");
const {error, embed, perms, firstUpperCase} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
const { update } = require('../../models/profileSchema');
let rateLimiter = new RateLimiter(1, 5000);
const devs = ['382906068319076372'];

module.exports = {
    config: {
      name: "кланы",
      aliases: ['clans'],
      category: 'h_roleplay',
      description: "Посмотреть все кланы сервера.",
      usage: "",
      accessableby: "Для всех"
    },
    run: async (bot, message, args, ops) => {
      let limited = rateLimiter.take(message.author.id)
      if(limited) return
  
      const data = await bd.findOne({userID: message.author.id})
      const user = message.author;
      let bag = await bd.findOne({userID: user.id})
      let rp = await rpg.findOne({userID: user.id});
  
      if (!rp) {
        let newData = await rpg.create({
          userID: user.id,
        })
        newData.save()
      }
      
      rp = await rpg.findOne({userID: user.id});

      // gettin all users docs, who have clan 
      let inS = await rpg.find({clanID: {$exists: true}}).exec()
      // gettin users who are now in current server
      let all = await inS.filter(asd => message.guild.members.cache.get(asd.userID));
      // gettin all their clans
      let getClans = await Promise.all(all.map(async (a) => await clan.findOne({ID: a.clanID})))
      // makin data unique
      let unique = getClans.filter(x => x !== null)
      //return console.log(unique)
      // Data To Text
      let textt = await Promise.all(unique.map(async (a) => {
          let users = await rpg.find({clanID: a.ID});
          return `**#${a.ID}** **${a.name}** (Ур. **${a.level}**)\n👑 ${message.guild.members.cache.get(a.owner) ? message.guild.members.cache.get(a.owner) : `**${bot.users.cache.get(a.owner).tag}**`}\nУчастники: **${users.length}/${a.space}** | Бюджет: **${a.budget} ${CLAN}**`;
        }))

       let text = textt.filter((x, y, z) => z.indexOf(x) === y)

      const em = new MessageEmbed()
      .setColor(cyan)
      .setTimestamp()
      .setThumbnail(message.guild.iconURL({dynamic: true}))
      .setTitle('Кланы сервера.')
      .setDescription(text && text.length !== 0 ? text.join("\n\n") : 'Не один клан не найден!\nСоздайте свой клан!')
      return message.channel.send({embeds: [em]});
      
    }
}