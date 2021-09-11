const { MessageEmbed } = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);

module.exports = {
    config: {
        name: "status",
        category: "b_info",
        aliases: ""
    },
    run: async (bot, message, args) => {
      let limited = rateLimiter.take(message.author.id)
      if(limited) return

      const getLang = require("../../models/serverSchema");
      const LANG = await getLang.findOne({serverID: message.guild.id});
      const {status: s} = require(`../../languages/${LANG.lang}`);

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;

        if (!user.presence.activities.length) {
            const sembed = new MessageEmbed()
                .setAuthor(user.user.username, user.user.displayAvatarURL({ dynamic: true }))
                .setColor(redlight)
                .setThumbnail(user.user.displayAvatarURL())
                .addField(s.error1, s.error2)
                .setFooter(message.guild.name, message.guild.iconURL())
                .setTimestamp()
            message.channel.send({embeds: [sembed]})
            return undefined;
        }

        user.presence.activities.forEach((activity) => {

            if (activity.type === 'CUSTOM') {
                const embed = new MessageEmbed()
                    .setAuthor(user.user.username, user.user.displayAvatarURL({ dynamic: true }))
                    .setColor(cyan)
                    .addField("** **", `${s.custom} -\n${activity.state}`)
                    .setThumbnail(user.user.displayAvatarURL())
                    .setFooter(message.guild.name, message.guild.iconURL())
                    .setTimestamp()
                message.channel.send({embeds: [embed]})
            }
            else if (activity.type === 'PLAYING') {
                let name1 = activity.name
                let details1 = activity.details
                let state1 = activity.state
                let image = user.user.displayAvatarURL({ dynamic: true })

                const sembed = new MessageEmbed()
                    .setAuthor(`${user.user.username}'s Activity`)
                    .setColor(cyan)
                    .setThumbnail(image)
                    .addField(s.type, s.playing)
                    .addField(s.game, `${name1}`)
                    .addField(s.details, `${details1 || s.not}`)
                    .addField(s.working, `${state1 || s.not}`)
                message.channel.send({embeds: [sembed]});
            }
            else if (activity.type === 'LISTENING' && activity.name === 'Spotify' && activity.assets !== null) {

                let trackIMG = `https://i.scdn.co/image/${activity.assets.largeImage.slice(8)}`;
                let trackURL = `https://open.spotify.com/track/${activity.syncID}`;

                let trackName = activity.details;
                let trackAuthor = activity.state;
                let trackAlbum = activity.assets.largeText;

                trackAuthor = trackAuthor.replace(/;/g, ",")

                const embed = new MessageEmbed()
                    .setAuthor(s.title, 'https://cdn.discordapp.com/emojis/408668371039682560.png')
                    .setColor("GREEN")
                    .setTimestamp()
                    .setThumbnail(trackIMG)
                    .addField(s.name, trackName, true)
                    .addField(s.album, trackAlbum, true)
                    .addField(s.author, trackAuthor, false)
                    .addField('** **', `[${s.listen}](${trackURL})`, false)
                    .setFooter(user.displayName, user.user.displayAvatarURL({ dynamic: true }))
                message.channel.send({embeds: [embed]});
            }
        })
    }
}
