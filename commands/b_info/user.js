const { MessageEmbed } = require("discord.js");
const { main } = require("../../JSON/colours.json");
const moment = require('moment');
const {error, embed, perms, firstUpperCase} = require('../../functions/functions');
const {memberFind} = require('../../functions/models');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);

module.exports = {
    config: {
        name: "user",
        category: "b_info",
        aliases: ["userinfo", "info", 'участник']
    },
    run: async (bot, message, args) => {

      const getLang = require("../../models/serverSchema");
      const LANG = await getLang.findOne({serverID: message.guild.id});
      const {user: u, notUser} = require(`../../languages/${LANG.lang}`);
        let member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;
        let UIembed = new MessageEmbed()
        .setTimestamp()
        .setColor(main)
        if(!member) return error(message, notUser);
        const data = await memberFind(member.user.id, message.guild.id)
        function statusToRus(ups){
          if(ups === "dnd"){
            return ups = "Не беспокоить";
          } else if(ups === "idle"){
            return ups = 'Неактивен';
          } else if (ups === "online") {
            return ups = "Онлайн";
          } else {
            return ups = "Оффлайн";
          }

        }

        const activities = [];
    for (const activity of member.presence.activities.values()) {
      switch (activity.type) {
        case 'CUSTOM':
        activities.push(activity.state)
          UIembed.addField(`**${u.custom}**`, activity.state)
          break;
        case 'PLAYING':
          UIembed.addField("**"+u.playing+" **", `${activity.name}`, false);
          break;
        case 'LISTENING':
          if (member.bot) {UIembed.addField("**"+u.listening+" **", `${activity.name}`, false);}
          else {UIembed.addField("**"+u.listening+" **", `${activity.state} -- ${activity.details}`, false)};
          break;//
        case 'WATCHING':
            UIembed.addField("**"+u.watching+" **", `${activity.name}`, false);
          break;
        case 'STREAMING':
            UIembed.addField("**"+u.streaming+" **", `${activity.name}`, false);
          break;
      }}



        UIembed.setTitle(u.name + ' ' + member.user.tag + '')
        UIembed.setAuthor(u.author)
        UIembed.setDescription(`
        **${u.f1}** ${moment(member.user.createdAt).format('DD.MM.YYYY HH:mm')}
**${u.f2}** ${moment(member.joinedAt).format('DD.MM.YYYY HH:mm')}
**${u.f3}** ${member.roles.cache.size-1}
**${u.f4}** ${member.roles.highest.name}
**${u.f5}** \`${data.messages || 0}\``)
        // UIembed.addField('Бот ли?:', `${booleanToRus(member.user.bot)}`, true)
        // UIembed.addField('Статус:', `${statusToRus(member.user.presence.status)}`, true)
        // UIembed.addField('\u200B', '\u200B', true);


        UIembed.setFooter(`ID: ${member.user.id}`)

        UIembed.setThumbnail(member.user.displayAvatarURL({dynamic: true}))

        // user.presence.activities.forEach((activity) => {
        //       if (activity.type === 'CUSTOM_STATUS') {
        //           UIembed.addField('Currently playing',`\n**${activity.name}**`)
        //       } //
        //           })


        message.channel.send({embeds: [UIembed]});
    }
}

function booleanToRus(val){
  if(val === true) {
    return "Да";
  } else {
    return "Нет";
  }
}
