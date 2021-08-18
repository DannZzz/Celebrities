const Discord = require("discord.js");
const { AME_API } = require('../../config')
const ameClient = require('amethyste-api')
const AmeAPI = new ameClient(AME_API)
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
    config: {
      name: "триггер",
      aliases: ['trigger', 'triggered', 'trg', 'трг'],
      category: "e_fun",
      description: "Показывает триггер участника.",
      usage: "[ник участника | упоминание | ID] (По желанию)",
      accessableby: "Для всех"
    },

    run: async (bot, message, args) => {
      let limited = rateLimiter.take(message.author.id)
      if(limited) return
       
        let user = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;
        let m = await message.channel.send("**Ждите...**");
        let buffer = await AmeAPI.generate("triggered", { url: user.user.displayAvatarURL({ format: "png", size: 512 }), sepia: "true", invert: "true" });
        let attachment = new Discord.MessageAttachment(buffer, "triggered.gif");
        m.delete();
        message.channel.send({files: [attachment]});
    }
};
