const heroes = require('../../JSON/heroes.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed } = require("discord.js");
const {error} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "герой",
    aliases: ['hero'],
    category: 'h_roleplay',
    description: "Посмотреть статистику своего героя.",
    usage: "(участник)",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return
       
    const user = message.member;
    if(user.user.bot) return error(message, 'Бот не может иметь героя.');
    const rp = await rpg.findOne({userID: user.id});
    if (!rp) return error(message, 'Вы не имеете героя.');
    if(rp.item !== null) {
    const item = heroes[rp.item]
    let myHero = new MessageEmbed()
    .setAuthor(`Герой ${user.user.tag}`)
    .setTitle(`${item.name} (${item.nameRus})\nУровень: ${rp.level}  Приключения: ${rp.surviveLevel}-й`)
    .setDescription(item.description)
    .setThumbnail(item.url)
    .addField(`❤ Общая жизнь:`, `${rp.health}`, true)
    .addField(`⚔ Общая атака:`, `${rp.damage}`, true)
    .addField(`🟡 Сыграно игр:`, `${rp.totalGames}`, false)
    .addField(`🟢 Выиграно игр:`, `${rp.wins}`, true)
    .addField(`🔴 Проиграно игр:`, `${rp.loses}`, true)
    .addField(`🏆 Процент побед:`, `${Math.trunc(rp.wins / rp.totalGames  * 100) || '0'}%`, true)
    .setColor(cyan)

    return message.channel.send({embeds: [myHero]}).then(msg => setTimeout(()=>msg.delete(), 30 * 1000))
  } else {
    return error(message, 'Вы не имеете героя.');
  }

  }
};
