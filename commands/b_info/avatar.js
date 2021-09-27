const { main } = require("../../JSON/colours.json");
const {  } = require("../../functions/models");


module.exports = {
  config: {
    name: "avatar",
    aliases: ["av", "аватар"],
    category: "b_info"
  },
  run: async (bot, message, args) => {
    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {avatar} = require(`../../languages/${LANG.lang}`);

    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;

    if (args[0]) {
      message.reply({ embeds: [
        {

          title: `${avatar.AVATAR} — ${user.user.username}'`,

          color: main,

          image: {
            url: `${user.user.displayAvatarURL({dynamic: true})}` + '?size=4096'
          },

        }
      ]})
    }
    else if (!args[0]) {
      message.reply({embeds: [
        {

          title: `${avatar.AVATAR} — ${user.user.username}`,

          color: main,

          image: {
            url: `${user.user.displayAvatarURL({ dynamic: true })}` + '?size=4096'
          },


        }
      ]})
    }
  }
}
