const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { main } = require("../../JSON/colours.json");
const { serverFind } = require("../../functions/models");
const { makeTimestamp } = require("../../functions/functions");
const {PREFIX, DEV, botINVITE, devID} = require("../../config");
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
  const devs = devID.map(i => bot.users.cache.get(i).tag).join("\n")
  
    
  const button2 = new MessageButton()
      .setStyle("LINK")
      .setLabel("Commands")
      .setURL("https://adanabot.github.io/pages/commands.html")

  const button1 = new MessageButton()
      .setStyle("LINK")
      .setLabel("Support Server")
      .setURL("https://discord.gg/Q6Guf7MmsT")

  const button3 = new MessageButton()
      .setStyle("LINK")
      .setLabel("Invite")
      .setURL("https://discord.com/api/oauth2/authorize?client_id=726784476377514045&permissions=275952036961&scope=bot")     

    const row = new MessageActionRow().addComponents([button1, button2, button3]);
  
  const embed = new MessageEmbed()
  .setAuthor(botinfo.title)
  .addFields(
  { name: botinfo.field1, value: bot.user.tag },
  { name: botinfo.create, value: `<t:${(makeTimestamp(bot.user.createdAt.getTime()))}:D> (<t:${(makeTimestamp(bot.user.createdAt.getTime()))}:R>)` } )
  .addField(botinfo.dev, devs, true)
  .addField(botinfo.prefix, PREFIX, true)
  .addField(botinfo.inv, `**[boosty.to/iamdann](https://boosty.to/iamdann)**`)
  .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
  .setFooter("ID: " + bot.user.id)
  .setTimestamp()
  .setColor(main)

  message.channel.send({embeds: [embed], components: [row]});
  }
}
