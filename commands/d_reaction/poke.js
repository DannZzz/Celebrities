const Discord = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const {error} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);

module.exports = {
  config: {
    name: "poke",
    aliases: '',
    category: 'd_reaction'
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return
        
      const getLang = require("../../models/serverSchema");
      const LANG = await getLang.findOne({serverID: message.guild.id});
      const {poke: p, specify} = require(`../../languages/${LANG.lang}`);   
   
    try {
      const gifs = [
        "https://i.kym-cdn.com/photos/images/original/000/674/446/346.gif",
        "https://i2.wp.com/media1.tenor.com/images/68a4dd239a1103ae266f4197e8a40c01/tenor.gif",
        "https://i.gifer.com/JTSO.gif",
        "https://i.kym-cdn.com/photos/images/newsfeed/000/943/107/c7e.gif",
        "https://1.bp.blogspot.com/-0cu-3g3bio4/Vx_hCIRUcYI/AAAAAAAAcE8/mcV22O8uolst5z3Rd-reMOPhxoLLMeXaACKgB/s1600/Omake%2BGif%2BAnime%2B-%2BKuma%2BMiko%2B-%2BEpisode%2B4%2B-%2BMachi%2BCheek%2BPoke.gif",
        "https://i.imgur.com/MuHTLun.gif",
        "https://media.tenor.com/images/d07762ab2f5fc5d1d43525d2b3db7de8/tenor.gif",
        "https://i.pinimg.com/originals/40/54/5c/40545c887023ba16e26f094bdb335271.gif",
        "https://monophy.com/media/aZSMD7CpgU4Za/monophy.gif",
        "https://i.gifer.com/Rd88.gif",
        "https://i.pinimg.com/originals/ae/62/32/ae62324b1de9d2422a45557ac0551e48.gif",
      ]
        const random = Math.floor(Math.random() * gifs.length)
        if(!args[0]) return error(message, specify);
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
        if (!member) return error(message, specify);
        if (member.id === message.author.id) return error(message, p.error);

        const sembed = new Discord.MessageEmbed()
        .setColor(cyan)
        .setDescription(`<@${message.author.id}> ${p.done} <@${member.user.id}>`)
        .setImage(gifs[random])
        message.channel.send({embeds: [sembed]})
      } catch (e){
        console.log(e);
      }
  }
}
