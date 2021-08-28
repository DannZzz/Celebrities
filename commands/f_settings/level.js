const begModel = require("../../models/begSchema");
const serverModel = require("../../models/serverSchema");
const {error, embed, perms} = require('../../functions');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { MessageEmbed, MessageAttachment, MessageButton, MessageActionRow } = require('discord.js');
const {MONGO} = require('../../config');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);
const Levels = require("discord-xp");
Levels.setURL(process.env.MONGO)

module.exports = {
  config: {
    name: "уровни",
    description: "Включить/отключить систему уровней.",
    category: "f_settings",
    aliases: ["levels"],
    accessableby: "Нужна права: Администратор.",
    usage: "[отключить || off || включить || on]"
  },
  run: async (bot, message, args, ops) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return
       
    let bag = await begModel.findOne({userID: message.author.id});
    let sd = await serverModel.findOne({serverID: message.guild.id});

    if(bag['vip1'] === false) return error(message, "Эта команда доступна только для **VIP 1** пользователей.");
    if (!perms(message, "ADMINISTRATOR")) return error(message, "У вас недостаточно прав.");
    if(!args[0]) return error(message, "Укажите действие.\nПример: \`\`?уровни отключить\`\`");
    if (args[0] === "отключить" || args[0] === 'off') {
      if(sd.rank) {
      const user = message.author;
      const current = ops.queue.get(user.id)
      if (current) return
      const del = ['delete', 'удалить'];
   
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
      .setTitle('Вы уверены, что хотите отключить и сбросить система уровней сервера?')

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
          Levels.deleteGuild(message.guild.id);
          await serverModel.findOneAndUpdate({serverID: message.guild.id}, {$set: {rank: false}})
          curPage.edit({
            embeds: [Emb.setTitle('Система уровней успешно сброшена и отключена.')],
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
      
        

        
      
      } else {
      return error(message, "Система уровней и так отключена.");
      }
    } else if (args[0] === "включить" || args[0] === 'on') {
      if(!sd.rank || sd.rank === null) {
        await serverModel.findOneAndUpdate({serverID: message.guild.id}, {$set: {rank: true}})
        embed(message, 'Система уровней успешно включена.');
      } else {
      return error(message, "Система уровней и так включена.");
      }
    } else  {
      return error(message, "Действие не найдено.");
    }

  }
}
