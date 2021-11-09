const { MessageEmbed } = require("discord.js");
const { main, none } = require("../../JSON/colours.json");
const { profile, profileFind, serverFind, bagFind } = require("../../functions/models");
const {error, embed, perms, makeTimestamp} = require("../../functions/functions");
const moment = require('moment');

module.exports = {
    config: {
        name: "server",
        category: "b_info",
        aliases: ['serverinfo', 'сервер']
    },
    run: async (bot, messageCreate, args) => {
      let message = messageCreate

      const LANG = await serverFind(message.guild.id);
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
          .addField(s.f2, `T: ${server.channels.cache.filter(t => t.type === "GUILD_TEXT").size}\nV: ${server.channels.cache.filter(v => v.type === "GUILD_VOICE").size}`, true)
          .addField(s.f3, `<t:${makeTimestamp(message.member.joinedAt.getTime())}:R>`, true)
          .addField(s.f4, `<t:${makeTimestamp(server.createdAt.getTime())}:D>`, true)
          .addField(s.f5, `${bot.users.cache.get(server.ownerId).tag}`, true)


          .addField(s.f6, `${server.memberCount}`, true)
          .addField(s.f7, `${all}`, true)
          // .addField('Онлайн:', `${server.members.cache.filter(m => m.presence.status === "online").size}`, true)
          // .addField('Не беспокоить:', `${server.members.cache.filter(m => m.presence.status === "dnd").size}`, true)
          // .addField('Неактивен:', `${server.members.cache.filter(m => m.presence.status === "idle").size}`, true)
          .addField(s.f8, `${server.memberCount - all}`, true)
          .addField(s.f9, `${server.channels.cache.filter(c => c.type === "GUILD_CATEGORY").size}`, true)

          .addField(s.f10, `${booleanToUpperCase(server.verified, LANG.lang)}`, true)
          .setFooter('ID: ' + server.id)

          .setTimestamp()
          .setColor(main)

          
          if (server.banner) serverembed.setImage(server.bannerURL({dynamic: true}) + "?size=4096")
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
