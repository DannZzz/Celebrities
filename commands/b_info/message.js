const {MessageEmbed} = require('discord.js');
const profileModel = require("../../models/profileSchema")
const {cyan} = require('../../JSON/colours.json');
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);

module.exports = {
  config: {
    name: 'message',
    aliases: ["bug", 'сообщение'],
    category: 'b_info'
  },
  run: async (bot, message, args) => {
    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {message: m} = require(`../../languages/${LANG.lang}`);

    let limited = rateLimiter.take(message.author.id)
    if(limited) return

    let {member, channel} = message
    const profileData = await profileModel.findOne({userID: member.id});
    const emb = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
    .setColor(cyan)
    .setTimestamp()

    let toGuild = bot.guilds.cache.get('731032795509686332');
    let toChannel = toGuild.channels.cache.get('870408356723052655');

    let timeout = 1000 * 10 * 60;
    let author = profileData.bug;
    if (author !== null && timeout - (Date.now() - author) > 0) {

      let time = new Date(timeout - (Date.now() - author));
      return error(message, m.time(time));
    } else {
      if(!args[0]) return error(message, m.error);
      embed(message, m.done)
      toChannel.send({embeds: [emb.setDescription(
        `
        **Получено от: **\`${member.user.tag}(${member.id})\`\n**Из сервера: **\`${message.guild.name}(${message.guild.id})\`\n\n**Сообщение:**\n\`${args.join(" ")}\`
        `
      )]})

      await profileModel.findOneAndUpdate({userID: member.id}, {$set: {bug: Date.now()}})
    }
  }
}
