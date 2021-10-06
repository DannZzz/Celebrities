const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { main } = require("../../JSON/colours.json");
const { serverFind } = require("../../functions/models");
const {PREFIX, DEV, botINVITE} = require("../../config");
const moment = require('moment');

module.exports = {
  config: {
    name: "botinfo",
    category: "b_info",
    aliases: ["bot", "бот"],
  },
  run: async (bot, message, args) => {

  const LANG = await serverFind(message.guild.id);
  const {botinfo} = require(`../../languages/${LANG.lang}`); 
    
  let botAvatar = bot.user.displayAvatarUrl;

  const button2 = new MessageButton()
      .setStyle("LINK")
      .setLabel("Commands")
      .setURL("https://adanabot.github.io/pages/commands.html")

  const button1 = new MessageButton()
      .setStyle("LINK")
      .setLabel("Main Site")
      .setURL("https://adanabot.github.io/")

  const button3 = new MessageButton()
      .setStyle("LINK")
      .setLabel("Invite")
      .setURL("https://discord.com/api/oauth2/authorize?client_id=726784476377514045&permissions=275952036961&scope=bot")     

    const row = new MessageActionRow().addComponents([button1, button2, button3]);
  
  const embed = new MessageEmbed()
  .setAuthor(botinfo.title)
  .addFields(
  { name: botinfo.field1, value: bot.user.tag },
  { name: botinfo.create, value: moment(bot.user.createdAt).format('DD.MM.YYYY HH:mm') } )
  .addField(botinfo.dev, DEV, true)
  .addField(botinfo.prefix, PREFIX, true)
  .addField(botinfo.inv, `[${botinfo.link}](${botINVITE})`)
  .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
  .setFooter("ID: " + bot.user.id)
  .setTimestamp()
  .setColor(main)

  message.channel.send({embeds: [embed], components: [row]});
  }
}
