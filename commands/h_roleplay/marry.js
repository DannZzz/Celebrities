const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const marry = require("../../models/marry");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
const { STAR } = require('../../config');
let rateLimiter = new RateLimiter(1, 5000);
const { cyan } = require('../../JSON/colours.json');

module.exports = {
    config: {
        name: "жениться",
        aliases: ['marry'],
        category: 'h_roleplay',
        description: "Пожениться...",
        usage: "",
        accessableby: "Для всех"
      },
    run: async (bot, message, args, ops) => {
        let limited = rateLimiter.take(message.author.id)
          if(limited) return
        
        const user = message.author;
        const noww = ops.queue.get(user.id);
        if (noww) return
        let bag = await bd.findOne({ userID: user.id });

        let mar1 = await pd.findOne({userID: user.id});
        let mar2 = await marry.findOne({id: mar1.marryID});
        if (mar2) return error(message, "Вы уже женаты.");
        let author = mar1.marry;
        let timeout;
        if (bag["vip2"] === true) { timeout =  86400000 * 7 / 2; } else {
          timeout = 86400000 * 7;
        }
        if (author !== null && timeout - (Date.now() - author) > 0) {
            let time = new Date(timeout - (Date.now() - author));
    
            return error(message, `Попробуй еще раз через **${Math.round(Math.abs(time) / 86400000)} дней**.`);
        }
        if (!args[0]) return error(message, "Укажите участника.")
      
        const member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        let mard1 = await pd.findOne({userID: member.id});
        let mard2 = await marry.findOne({id: mard1.marryID});
        if (mard2) return error(message, "Этот участник уже имеет партнёра.");

        if (bag.stars < 150) return error(message, `У вас недостатачно звёзд — 150 ${STAR}`)
        
        const button1 = new MessageButton()
      .setCustomId('previousbtn')
      .setLabel('Нет')
      .setStyle('DANGER');

      const button2 = new MessageButton()
      .setCustomId('nextbtn')
      .setLabel('Да')
      .setStyle('SUCCESS');

      let buttonList = [
          button1,
          button2
      ]

      const Emb = new MessageEmbed()
      .setColor(cyan)
      .setTimestamp()
      .setAuthor(user.username, user.displayAvatarURL({dynamic: true}))
      .setDescription(`Предлагает вам свою руку и сердце ${member}`)

      ops.queue.set(user.id, {name: "deleting"})

      const row = new MessageActionRow().addComponents(buttonList);
      const curPage = await message.channel.send({
        embeds: [Emb],
        components: [row],
      })

      const filter = (i) =>
      (i.customId === buttonList[0].customId ||
      i.customId === buttonList[1].customId) &&
      i.user.id === member.id;

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
              embeds: [Emb.setDescription(`${member} отказался(-ась).`)],
              components: [disabledRow],
            });
          }
          ops.queue.delete(user.id)
          collector.stop()
        } else if (i.customId === buttonList[1].customId) {
          await i.deferUpdate()
          let ID = 1
          while (true) {
          let get = await marry.findOne({id: ID});
          if(get) {
            ID += 1
            continue;
          } else {
            break;
          }
        }
          const disabledRow = new MessageActionRow().addComponents(
            buttonList[0].setDisabled(true),
            buttonList[1].setDisabled(true)
          );
          const now = await pd.findOne({userID: user.id})
          const now1 = await pd.findOne({userID: member.id})
          if (!now.marryID && !now1.marryID) {
            const newData = await marry.create({
              first: user.id,
              second: member.id,
              date: Date.now(),
              id: ID   
            })
            await bd.updateOne({userID: user.id}, {$inc: {stars: -150}});
  
            await pd.updateOne({userID: user.id}, {$set: {marryID: ID}});
            await pd.updateOne({userID: member.id}, {$set: {marryID: ID}});
            newData.save()
          }
         
          curPage.edit({
            embeds: [Emb.setDescription(`${message.guild.members.cache.get(user.id)} и ${member} поженились.`)],
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
}