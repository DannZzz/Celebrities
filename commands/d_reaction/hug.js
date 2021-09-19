const Discord = require('discord.js');
const superagent = require('superagent');
const {greenlight, redlight, main} = require('../../JSON/colours.json');
const {error} = require("../../functions/functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);

module.exports = {
  config: {
    name: "hug",
    aliases: ['cuddle', 'обнять'],
    category: 'd_reaction'
  },
  run: async (bot, message, args) => {
    

      const getLang = require("../../models/serverSchema");
      const LANG = await getLang.findOne({serverID: message.guild.id});
      const {hug: h, specify} = require(`../../languages/${LANG.lang}`);     
    try {

        if(!args[0]) return error(message, specify);
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
        if (!member) return error(message, specify);
        if (member.id === message.author.id) return error(message, h.error);
        const { body } = await superagent
        .get("https://nekos.life/api/hug");

        const sembed = new Discord.MessageEmbed()
        .setColor(main)
        .setDescription(`<@${message.author.id}> ${h.done} <@${member.user.id}>`)
        .setImage(body.url)
        message.channel.send({embeds: [sembed]})
      } catch (e){
        console.log(e);
      }
  }
}
