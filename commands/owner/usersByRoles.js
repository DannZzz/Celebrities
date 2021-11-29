const { MessageEmbed } = require("discord.js");
const { main } = require("../../JSON/colours.json");
const moment = require('moment');
const {error, embed, perms, firstUpperCase, makeTimestamp} = require('../../functions/functions');
const {memberFind} = require('../../functions/models');
const ms = require("ms");
const { stripIndents } = require("common-tags");

module.exports = {
    config: {
        name: "отчет",
        aliases: ["отчёт"],
        permissions: ["MANAGE_ROLES"],
        validServers: ["839462072970641419"]
    },
    run: async (bot, message, args, ops, tr) => {

      const getLang = require("../../models/serverSchema");
      const LANG = await getLang.findOne({serverID: message.guild.id});
      const {user: u, notUser} = require(`../../languages/${LANG.lang}`);

      if (!args[0]) return error(message, await tr("Укажите роль!"));
      const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
      if (!role) return error(message, await tr("Роль не найдена!"));

      const filteredMembers = message.guild.members.cache.filter(member => member.roles.cache.has(role.id));

      if (filteredMembers.size > 50) return error(message, await tr("Участников с этой ролью больше чем 10!"));
      let arr = filteredMembers.map(m => m);
      let UIembed = new MessageEmbed()
        .setTimestamp()
        .setColor(main)
        .setAuthor("Участников: " + filteredMembers.size)

      
      const texted = await Promise.all(arr.map(async (member, i) => {
       
        const data = await memberFind(member.user.id, message.guild.id)
        
        return `${i+1}. ${member.user.tag} | ${data.messages || 0}`;
      }));

      UIembed.setDescription(texted && texted.length > 0 ? stripIndents`\`\`\`dts\n# Тег | Сообщения\n=================\n${texted.join("\n")}\`\`\`` : "Участников с этой ролью не найдены!")
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
