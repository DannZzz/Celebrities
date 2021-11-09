const {MessageEmbed} = require('discord.js');
const { main, none } = require("../../JSON/colours.json");
const { profile, profileFind, serverFind } = require("../../functions/models");
const {error, embed, perms, missingArgument} = require("../../functions/functions");

module.exports = {
  config: {
    name: 'message',
    aliases: ["bug", 'сообщение'],
    category: 'b_info',
    examples: ["bug I have found a bug!"]
  },
  run: async function (bot, message, args) {
    const LANG = await serverFind(message.guild.id);
    const {message: m} = require(`../../languages/${LANG.lang}`);
    
    let {member, channel} = message
    const profileData = await profileFind(member.id);
    const emb = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
    .setColor(none)
    .setTimestamp()

    let toGuild = bot.guilds.cache.get('731032795509686332');
    let toChannel = toGuild.channels.cache.get('870408356723052655');

    let timeout = 1000 * 10 * 60;
    let author = profileData.bug;
    if (author !== null && timeout - (Date.now() - author) > 0) {

      let time = new Date(timeout - (Date.now() - author));
      return error(message, m.time(time));
    } else {
      if(!args[0]) return await missingArgument(message, m.error, `${this.config.name} ${m.usage}`, this.config.examples);
      embed(message, m.done)
      toChannel.send({embeds: [emb.setDescription(
        `
        **Получено от: **\`${member.user.tag}(${member.id})\`\n**Из сервера: **\`${message.guild.name}(${message.guild.id})\`\n\n**Сообщение:**\n\`${args.join(" ")}\`
        `
      )]})

      await profile.updateOne({userID: member.id}, {$set: {bug: Date.now()}})
    }
  }
}
