const Discord = require("discord.js");
let ownerID = '382906068319076372';
const { MessageEmbed, MessageAttachment, MessageButton, MessageActionRow } = require('discord.js');
const {greenlight, redlight, main} = require('../../JSON/colours.json');
const {error, pagination} = require("../../functions/functions");

module.exports = {
  config: {
    name: "сервера",
    aliases: ["servers", 'лист'],
    category: "",
    description: "Показывает все сервера где находится бот!",
    usage: "",
    accessableby: "Для разработчика"
  },
  run: async (bot, message, args) => {
    if (message.author.id == ownerID) {

      let array = []
      function asd(arr, count = 0) {
        while (arr.size > count) {
        let description =
        `Все сервера - ${bot.guilds.cache.size} | Все участники - ${bot.users.cache.size}\n\n` +
        arr
          .sort((a, b) => b.memberCount - a.memberCount)
          .map(r => r)
          .map((r, i) => `**${i + 1} - ${r.name} | ${r.memberCount} Участники**\nID - ${r.id}\n👑 \`${bot.users.cache.get(r.ownerId).tag || "Неизвестный"}\`\n\n`)
          .slice(count, count + 10)
          .join("\n");

      let embed = new MessageEmbed()
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setColor(main)
        .setFooter(bot.user.username)
        .setDescription(description);

        array.push(embed)
        
        count += 10;
        }
      }
      asd(bot.guilds.cache)

      const timeout = '100000'

      const button1 = new MessageButton()
            .setCustomId('previousbtn')
            .setLabel('Предыдущая')
            .setStyle('DANGER');

            const button2 = new MessageButton()
            .setCustomId('nextbtn')
            .setLabel('Следующая')
            .setStyle('SUCCESS');

      let buttonList = [
          button1,
          button2
      ]

      const userids = [message.author.id]

      pagination(message, array, buttonList, timeout, userids)
      
      return 
      let description =
        `Все сервера - ${bot.guilds.cache.size} | Все участники - ${bot.users.cache.size}\n\n` +
        bot.guilds.cache
          .sort((a, b) => b.memberCount - a.memberCount)
          .map(r => r)
          .map((r, i) => `**${i + 1} - ${r.name} | ${r.memberCount} Участники**\nID - ${r.id}`)
          .slice(0, 10)
          .join("\n");

      let embed = new Discord.MessageEmbed()
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setColor(main)
        .setFooter(bot.user.username)
        .setTitle(`Page - ${page}/${Math.ceil(bot.guilds.cache.size / 10)}`)
        .setDescription(description);

      let msg = await message.channel.send({embeds: [embed]});

      await msg.react("⬅");
      await msg.react("➡");
      await msg.react("❌");

      let collector = msg.createReactionCollector(
        (reaction, user) => user.id === message.author.id
      );

      collector.on("collect", async (reaction, user) => {
        if (reaction._emoji.name === "⬅") {
          // Updates variables
          i0 = i0 - 10;
          i1 = i1 - 10;
          page = page - 1;

          // if there is no guild to display, delete the message
          if (i0 + 1 < 0) {
            console.log(i0)
            return msg.delete();
          }
          if (!i0 || !i1) {
            return msg.delete();
          }

          description =
            `Все сервера - ${bot.guilds.cache.size} | Все участники - ${bot.users.cache.size}\n\n` +
            bot.guilds.cache
              .sort((a, b) => b.memberCount - a.memberCount)
              .map(r => r)
              .map(
                (r, i) => `**${i + 1}** - ${r.name} | ${r.memberCount} Участники**`
              )
              .slice(i0, i1)
              .join("\n");

          // Update the embed with new informations
          embed
            .setTitle(
              `Страница - ${page}/${Math.round(bot.guilds.cache.size / 10 + 1)}`
            )
            .setDescription(description);

          // Edit the message
          msg.edit({embeds: [embed]});
        }

        if (reaction._emoji.name === "➡") {
          // Updates variables
          i0 = i0 + 10;
          i1 = i1 + 10;
          page = page + 1;

          // if there is no guild to display, delete the message
          if (i1 > bot.guilds.cache.size + 10) {
            return msg.delete();
          }
          if (!i0 || !i1) {
            return msg.delete();
          }

          description =
            `Все сервера - ${bot.guilds.cache.size} | Все участники - ${bot.users.cache.size}\n\n` +
            bot.guilds.cache
              .sort((a, b) => b.memberCount - a.memberCount)
              .map(r => r)
              .map(
                (r, i) => `**${i + 1} - ${r.name} | ${r.memberCount} Участники**`
              )
              .slice(i0, i1)
              .join("\n");

          // Update the embed with new informations
          embed
            .setTitle(
              `Страница - ${page}/${Math.round(bot.guilds.cache.size / 10 + 1)}`
            )
            .setDescription(description);

          // Edit the message
          msg.edit({embeds: [embed]});
        }

        if (reaction._emoji.name === "❌") {
          return msg.delete();
        }

        // Remove the reaction when the user react to the message
        await reaction.users.remove(message.author.id);
      });
    } else {
      let embed = new Discord.MessageEmbed()
      .setColor(redlight)
      .setTimestamp()
      .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL({dynamic: true}))
      return message.channel.send(embed.setDescription("❌ К сожалению вы не мой разработчик."))
    }
  }
};
