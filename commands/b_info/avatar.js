
module.exports = {
  config: {
    name: "avatar",
    aliases: ["av"],
    category: "b_info"
  },
  run: async (bot, message, args) => {
    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {avatar} = require(`../../languages/${LANG.lang}`);

    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;

    if (args[0]) {
      message.channel.send({ embeds: [
        {

          title: `${avatar.AVATAR} — ${user.user.username}'`,

          color: 0x00deff,

          image: {
            url: `${user.user.displayAvatarURL({dynamic: true})}` + '?size=4096'
          },

          timestamp: new Date(),

          footer: {
            text: message.guild.name,
            icon_url: message.guild.iconURL()
          }
        }
      ]})
    }
    else if (!args[0]) {
      message.channel.send({embeds: [
        {

          title: `${avatar.AVATAR} — ${user.user.username}`,

          color: 0x00deff,

          image: {
            url: `${user.user.displayAvatarURL({ dynamic: true })}` + '?size=4096'
          },

          timestamp: new Date(),

          footer: {
            text: message.guild.name,
            icon_url: message.guild.iconURL()
          }

        }
      ]})
    }
  }
}
