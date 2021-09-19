const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const marry = require("../../models/marry");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const {error, embed, perms} = require("../../functions/functions");
const { RateLimiter } = require('discord.js-rate-limiter');
const { STAR } = require('../../config');
let rateLimiter = new RateLimiter(1, 3000);
const { main } = require('../../JSON/colours.json');

module.exports = {
    config: {
        name: "break-up",
        aliases: ['развестись'],
        category: 'h_roleplay',
      },
    run: async (bot, message, args, ops) => {
        let limited = rateLimiter.take(message.author.id)
          if(limited) return
          
        const getLang = require("../../models/serverSchema");
        const LANG = await getLang.findOne({serverID: message.guild.id});
        const {"break-up": bu, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   
            
        const user = message.author;
        const noww = ops.queue.get(user.id);
        if (noww) return
        let mar1 = await pd.findOne({userID: user.id});
        let mar2 = await marry.findOne({id: mar1.marryID});
        if (!mar2) return error(message, bu.err);

        let bag = await bd.findOne({ userID: user.id });

        if (bag.stars < 150) return error(message, `${bu.err1} ${STAR}`)
        
        const button1 = new MessageButton()
      .setCustomId('previousbtn')
      .setLabel(buttonNo)
      .setStyle('DANGER');

      const button2 = new MessageButton()
      .setCustomId('nextbtn')
      .setLabel(buttonYes)
      .setStyle('SUCCESS');

      let buttonList = [
          button1,
          button2
      ]

      const Emb = new MessageEmbed()
      .setColor(main)
      .setTimestamp()
      .setAuthor(user.username, user.displayAvatarURL({dynamic: true}))
      .setDescription(`${bu.sure} ${STAR}`)

      ops.queue.set(user.id, {name: "deleting"})

      const row = new MessageActionRow().addComponents(buttonList);
      const curPage = await message.channel.send({
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
              embeds: [Emb.setDescription(bu.action)],
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
          if (now.marryID) {
            await pd.updateMany({marryID: mar2.id}, {$set: {marryID: null}});
            await bd.updateOne({userID: user.id}, {$inc: {stars: -150}});
            await marry.deleteOne({id: mar2.id});
          }
            
          curPage.edit({
            embeds: [Emb.setDescription(`${message.guild.members.cache.get(user.id)} ${bu.done}`)],
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