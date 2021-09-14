const Discord = require('discord.js');
const {cyan} = require('../../JSON/colours.json');
const nekoclient = require('nekos.life');
const neko = new nekoclient();
const { error } = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);


module.exports = {
  config: {
    name: "tickle",
    aliases: ['щекотать'],
    category: 'd_reaction'
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
    if(limited) return
    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {tickle: t, specify} = require(`../../languages/${LANG.lang}`);   
 
    try {
      
        if(!args[0]) return error(message, specify);
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
        if (!member) return error(message, specify);
        if (member.id === message.author.id) return error(message, t.error);
        const GIF = await neko.sfw.tickle();

        const sembed = new Discord.MessageEmbed()
        .setColor(cyan)
        .setDescription(`<@${message.author.id}> ${t.done} <@${member.user.id}>!`)
        .setImage(GIF.url)
        message.channel.send({embeds: [sembed]})
      } catch (e){
        console.log(e);
      }
  }
}
