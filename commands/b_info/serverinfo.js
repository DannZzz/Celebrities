const { MessageEmbed } = require("discord.js");
const { cyan } = require("../../JSON/colours.json");
const omg = require("../../models/customSchema");
const moment = require('moment');
const {error, embed, perms, firstUpperCase} = require('../../functions');

module.exports = {
    config: {
        name: "server",
        category: "b_info",
        aliases: ['serverinfo']
    },
    run: async (bot, messageCreate, args) => {
      let message = messageCreate
      const getLang = require("../../models/serverSchema");
      const LANG = await getLang.findOne({serverID: message.guild.id});
      const {server: s} = require(`../../languages/${LANG.lang}`);
    
        try {
          let server = message.guild;
          let isItIn = function(val){
              if(val === true){
                return val;
              }
          }
          let agg = 0;

          let all =  server.members.cache.filter(m => m.presence?.status === "online").size + server.members.cache.filter(m => m.presence?.status === "dnd").size + server.members.cache.filter(m => m.presence?.status === "idle").size

          const serverembed = new MessageEmbed()

          .setAuthor(`${s.f1} 🌟 ${LANG.rep}`)
          .setTitle(server.name)
          .setThumbnail(server.iconURL({dynamic: true}))
          .addField(s.f2, `\`\`\`T: ${server.channels.cache.filter(t => t.type === "GUILD_TEXT").size}\nV: ${server.channels.cache.filter(v => v.type === "GUILD_VOICE").size}\`\`\``, true)
          .addField(s.f3, `\`\`\`${moment(message.member.joinedAt).format('DD.MM.YYYY HH:mm')}\`\`\``, true)
          .addField(s.f4, `\`\`\`${moment(server.createdAt).format('DD.MM.YYYY HH:mm')}\`\`\``, true)
          .addField(s.f5, `\`\`\`${bot.users.cache.get(server.ownerId).tag}\`\`\``, true)


          .addField(s.f6, `\`\`\`${server.memberCount}\`\`\``, true)
          .addField(s.f7, `\`\`\`${all}\`\`\``, true)
          // .addField('Онлайн:', `\`\`\`${server.members.cache.filter(m => m.presence.status === "online").size}\`\`\``, true)
          // .addField('Не беспокоить:', `\`\`\`${server.members.cache.filter(m => m.presence.status === "dnd").size}\`\`\``, true)
          // .addField('Неактивен:', `\`\`\`${server.members.cache.filter(m => m.presence.status === "idle").size}\`\`\``, true)
          .addField(s.f8, `\`\`\`${server.memberCount - all}\`\`\``, true)
          .addField(s.f9, `\`\`\`${server.channels.cache.filter(c => c.type === "GUILD_CATEGORY").size}\`\`\``, true)

          .addField(s.f10, `\`\`\`${booleanToUpperCase(server.verified, LANG.lang)}\`\`\``, true)
          .setFooter('ID: ' + server.id)

          .setTimestamp()
          .setColor(cyan)

          const data = await omg.find({serverID: message.guild.id});
          const filteredData = data.filter(function({command}) {
            return command
          }).map(({command}) => command).join(', ')
          if(filteredData.length !== 0) serverembed.addField(s.f11, '\`\`\`' + filteredData + '\`\`\`', false)
          return message.channel.send({embeds: [serverembed]});
        }
        catch (r ){
            console.log(r);
        }
    }
}

function booleanToUpperCase(val, lang){
  if(val === true && lang === "ru") {
    return "Да";
  } else if (val === true && lang === "en") {
    return "Yes"
  } else if(lang === 'en') {
    return "No"
  } else {
    return "Нет";
  }
}
