const Discord = require('discord.js');
const superagent = require('superagent');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const {error} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "погладить",
    aliases: ['pat'],
    category: 'd_reaction',
    description: "Погладить участника.",
    usage: "[ник участника | упоминание | ID]",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return
      
    try {

        if(!args[0]) return error(message, "Укажи участника чтобы погладить его/ее.");
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
        if (!member) return error(message, "Укажи участника чтобы погладить его/ее.");
        if (member.id === message.author.id) return error(message, 'Ты не сможешь погладить себя.');
        const { body } = await superagent
        .get("https://nekos.life/api/pat");

        const sembed = new Discord.MessageEmbed()
        .setColor(cyan)
        .setDescription(`UwU, <@${message.author.id}> погладил(а) <@${member.user.id}>`)
        .setImage(body.url)
        .setTimestamp()
        message.channel.send({embeds: [sembed]})
      } catch (e){
        console.log(e);
      }
  }
}
