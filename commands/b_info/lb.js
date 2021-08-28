const { MessageEmbed, MessageAttachment, MessageButton, MessageActionRow } = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR } = require('../../config');
const serverModel = require("../../models/serverSchema");
const {error, pagination} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);
const Levels = require("discord-xp");
Levels.setURL(process.env.MONGO);


module.exports = {
  config: {
    name: 'ранги',
    aliases: ['ranks'],
    category: 'b_info',
    description: 'Посмотреть топ активных участников.',
    usage: '(delete | удалить) [ранг]',
    acessableby: 'Для всех'
  },
  run: async (bot, message, args, ops) => {
    let limited = rateLimiter.take(message.author.id)
    if(limited) return

    let server = await serverModel.findOne({serverID: message.guild.id})

    let embed = new MessageEmbed()
    .setTimestamp()
    .setAuthor(`${message.guild.name}\nТоп 10 активных участников!`)
    .setColor(cyan)

    if (!server.rank) return error(message, `**Система уровней для этого сервера отключена!**`);

    const led = await Levels.fetchLeaderboard(message.guild.id, 30)
    if (led.length <1) return error(message, `**Тут пока никого нет.**`);

    if (args[0]) {
      const user = message.author;
      const current = ops.queue.get(user.id)
      if (current) return
      const del = ['delete', 'удалить'];
      if(!message.member.permissions.has("ADMINISTRATOR")) return error(message, "У вас недостаточно прав.");

      if(del.includes(args[0])) {
        if (!args[1] || isNaN(args[1]) || Math.round(args[1]) <= 0 || Math.round(args[1]) > 30) return error(message, 'Укажите ранг участника(до 30).');
        const a = led[Math.round(args[1])-1]
        const button1 = new MessageButton()
      .setCustomId('previousbtn')
      .setLabel('Отменить')
      .setStyle('DANGER');

      const button2 = new MessageButton()
      .setCustomId('nextbtn')
      .setLabel('Удалить')
      .setStyle('SUCCESS');

      let buttonList = [
          button1,
          button2
      ]

      

      const Emb = new MessageEmbed()
      .setColor(cyan)
      .setTimestamp()
      .setAuthor(user.username, user.displayAvatarURL({dynamic: true}))
      .setTitle('Вы уверены, что хотите удалить данные участника?')

      ops.queue.set(user.id, {name: "deleting"})

      const row = new MessageActionRow().addComponents(buttonList);
      const curPage = await message.reply({
        embeds: [Emb],
        components: [row],
      })

      const filter = (i) =>
      (i.customId === buttonList[0].customId ||
      i.customId === buttonList[1].customId) &&
      i.user.id === user.id;

      const collector = await curPage.createMessageComponentCollector({
      filter,
      time: 15000,
      });

      collector.on("collect", async (i) => {
        if(i.customId === buttonList[0].customId) {
          await i.deferUpdate()
          if (!curPage.deleted) {
            const disabledRow = new MessageActionRow().addComponents(
              buttonList[0].setDisabled(true),
              buttonList[1].setDisabled(true)
            );
            curPage.edit({
              embeds: [Emb.setTitle('Дейстие успешно отклонено.')],
              components: [disabledRow],
            });
          }
          ops.queue.delete(user.id)
          collector.stop()
        } else if (i.customId === buttonList[1].customId) {
          await i.deferUpdate()
          const disabledRow = new MessageActionRow().addComponents(
            buttonList[0].setDisabled(true),
            buttonList[1].setDisabled(true)
          );
          
          await Levels.deleteUser(a.userID, message.guild.id)
          
          curPage.edit({
            embeds: [Emb.setTitle('Вы успешно удалили данные участника.')],
            components: [disabledRow],
          });//
          ops.queue.delete(user.id)
          collector.stop()
        }
      })
      
      collector.on("end", () => {
        if (!curPage.deleted) {
          const disabledRow = new MessageActionRow().addComponents(
            buttonList[0].setDisabled(true),
            buttonList[1].setDisabled(true)
          );
          curPage.edit({
            components: [disabledRow],
          });
        }
        ops.queue.delete(user.id)
      });
      
        

        
      }
    } else {
    const gg = await Levels.computeLeaderboard(bot, led, true);

    const lb = gg.map(e => `**${e.position === 1 ? `🏆 #${e.position}` : `#${e.position}`}**. **${e.username}**#${e.discriminator}\n**Уровень:** ${e.level} | **Опыт:** ${e.xp.toLocaleString()}`);

    let as;
    let page1;
    let page2;
    let page3;
    if(led.length <= 10) {
      as = lb.slice(0, 10).join("\n\n")
      message.channel.send({embeds: [embed.setDescription(as).setThumbnail(message.guild.iconURL({dynamic: true}))]})
    } else {
      if (led.length <= 20){
        page1 =  new MessageEmbed()
        .setDescription(lb.slice(0, 10).join("\n\n"))
        .setColor(cyan)
        .setTimestamp()
        page2 =  new MessageEmbed()
        .setDescription(lb.slice(10, 20).join("\n\n"))
        .setColor(cyan)
        .setTimestamp()
      } else if (led.length <= 30) {
        page1 =  new MessageEmbed()
        .setDescription(lb.slice(0, 10).join("\n\n"))
        .setColor(cyan)
        .setTimestamp()
        page2 =  new MessageEmbed()
        .setDescription(lb.slice(10, 20).join("\n\n"))
        .setColor(cyan)
        .setTimestamp()
        page3 =  new MessageEmbed()
        .setDescription(lb.slice(20, 30).join("\n\n"))
        .setColor(cyan)
        .setTimestamp()
      }
      let pages = [page1, page2, page3]
      if(!page3) { pages = [
        page1.setAuthor(`${message.guild.name}\nТоп 20 активных участников!`).setThumbnail(message.guild.iconURL({dynamic: true})),
        page2.setAuthor(`${message.guild.name}\nТоп 20 активных участников!`).setThumbnail(message.guild.iconURL({dynamic: true}))
      ] } else { pages = [page1.setAuthor(`${message.guild.name}\nТоп 30 активных участников!`, message.guild.iconURL({dynamic: true})),
        page2.setAuthor(`${message.guild.name}\nТоп 30 активных участников!`).setThumbnail(message.guild.iconURL({dynamic: true})),
        page3.setAuthor(`${message.guild.name}\nТоп 30 активных участников!`).setThumbnail(message.guild.iconURL({dynamic: true}))] }

      const emojies = ['⏪', '◀️', '⏹️', '▶️', '⏩']

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

      pagination(message, pages, buttonList, timeout, userids)
    }

    }
  }
}
