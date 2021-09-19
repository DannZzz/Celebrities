const Discord = require('discord.js');
const {greenlight, redlight, main} = require('../../JSON/colours.json');
const nekoclient = require('nekos.life');
const neko = new nekoclient();
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);
const {error} = require("../../functions/functions");

module.exports = {
  config: {
    name: "feed",
    aliases: ['nom', 'кормить'],
    category: 'd_reaction',
  },
  run: async (bot, message, args) => {
    
    
      const getLang = require("../../models/serverSchema");
      const LANG = await getLang.findOne({serverID: message.guild.id});
      const {feed: f, specify} = require(`../../languages/${LANG.lang}`);  
        
      
    try {
        if(!args[0]) return error(message, specify);
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
        if (!member) return error(message, specify);
        if (member.id === message.author.id) return error(message, f.error);
        const GIF = await neko.sfw.feed();

        const sembed = new Discord.MessageEmbed()
        .setColor(main)
        .setDescription(`<@${message.author.id}> ${f.done} <@${member.user.id}>`)
        .setImage(GIF.url)
        message.channel.send({embeds: [sembed]})
      } catch (e){
        console.log(e);
      }
  }
}
