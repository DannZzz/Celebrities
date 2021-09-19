const Discord = require('discord.js');
const {greenlight, redlight, main} = require('../../JSON/colours.json');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);

module.exports = {
  config: {
    name: "smoke",
    aliases: ['курить'],
    category: 'd_reaction'
  },
  run: async (bot, message, args) => {
    
       
      const getLang = require("../../models/serverSchema");
      const LANG = await getLang.findOne({serverID: message.guild.id});
      const {smoke: s, specify} = require(`../../languages/${LANG.lang}`);   
   
    try {
      const gifs = [
        "https://cdn.discordapp.com/attachments/830878676336902194/830925987281764352/smoke1.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830925988787126292/smoke2.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830925995074650162/smoke6.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830926004569505803/smoke3.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830926009511051354/smoke11.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830926016016547850/smoke5.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830926016099647508/smoke4.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830926025188835368/smoke7.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830926032402907176/smoke9.gif",
        "https://cdn.discordapp.com/attachments/830878676336902194/830926035482574924/smoke8.gif",
        "https://i.gifer.com/Lb.gif",
        "https://i.pinimg.com/originals/ea/52/ef/ea52ef755ab4c550ad44b2d764699c1b.gif",
        "https://media1.tenor.com/images/04154b43f00b88043f87a2dc46cc2b86/tenor.gif",
        "https://68.media.tumblr.com/81212d24566180915ed9160c801bb1d3/tumblr_otplrfKWAt1vj5j9co1_500.gif"
      ]
        const random = Math.floor(Math.random() * gifs.length)
        const sembed = new Discord.MessageEmbed()
        .setColor(main)
        .setDescription(`<@${message.author.id}> ${s.done}`)
        .setImage(gifs[random])
        .setTimestamp()
        message.channel.send({embeds: [sembed]})
      } catch (e){
        console.log(e);
      }
  }
}
