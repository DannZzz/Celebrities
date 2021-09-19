const { MessageEmbed } = require("discord.js");
const { main } = require("../../JSON/colours.json");
const { serverFind } = require("../../functions/models");
const {PREFIX, DEV, botINVITE} = require("../../config");
const moment = require('moment');

module.exports = {
  config: {
    name: "botinfo",
    category: "b_info",
    aliases: ["bot", "бот"]
  },
  run: async (bot, message, args) => {

  const LANG = await serverFind(message.guild.id);
  const {botinfo} = require(`../../languages/${LANG.lang}`); 
    
  let botAvatar = bot.user.displayAvatarUrl;
  const embed = new MessageEmbed()

  .setAuthor(botinfo.title)
  .addFields(
  { name: botinfo.field1, value: bot.user.tag },
  { name: botinfo.create, value: moment(bot.user.createdAt).format('DD.MM.YYYY HH:mm') } )
  .addField(botinfo.dev, DEV, true)
  .addField(botinfo.prefix, PREFIX, true)
  .addField(botinfo.inv, `[${botinfo.link}](${botINVITE})`)
  .addField(botinfo.support, `[OnlyChill](https://discord.gg/OnlyChill)`)
  .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
  .setFooter("ID: " + bot.user.id)
  .setTimestamp()
  .setColor(main)

  message.channel.send({embeds: [embed]});
  }
}
