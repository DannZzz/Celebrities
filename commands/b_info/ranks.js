const { MessageEmbed, MessageAttachment, MessageButton, MessageActionRow } = require('discord.js');
const Levels = require("discord-xp");
Levels.setURL(process.env.MONGO);
const { main, none } = require("../../JSON/colours.json");
const { profile, profileFind, serverFind, vipFind } = require("../../functions/models");
const {error, embed, perms} = require("../../functions/functions");

module.exports = {
  config: {
    name: 'ranks',
    aliases: ['ранги'],
    category: 'b_info'
  },
  run: async (bot, message, args, ops) => {
  const LANG = await serverFind(message.guild.id);
  const {ranks, next, previous, clanModel: cm} = require(`../../languages/${LANG.lang}`); 
    
    
    let server = await serverModel.findOne({serverID: message.guild.id})

    let embed = new MessageEmbed()
    .setTimestamp()
    .setAuthor(`${message.guild.name}\n${ranks.f1}`)
    .setColor(main)

    if (!server.rank) return error(message, ranks.f2);

    const led = await Levels.fetchLeaderboard(message.guild.id, 30)
    if (led.length <1) return error(message, ranks.f3);

    if (args[0]) {
      const user = message.author;
      const current = ops.queue.get(user.id)
      if (current) return
      let del;
      if (LANG.lang === "ru") {
        del = ['удалить'];
      } else {
        del = ['delete'];
      }
       
      if(!message.member.permissions.has("ADMINISTRATOR")) return error(message, perm);

      if(del.includes(args[0])) {
        if (!args[1] || isNaN(args[1]) || Math.round(args[1]) <= 0 || Math.round(args[1]) > 30) return error(message, cm.specN);
        const a = led[Math.round(args[1])-1]
        const button1 = new MessageButton()
      .setCustomId('previousbtn')
      .setLabel(ranks.buttonName1)
      .setStyle('DANGER');

      const button2 = new MessageButton()
      .setCustomId('nextbtn')
      .setLabel(ranks.buttonName2)
      .setStyle('SUCCESS');

      let buttonList = [
          button1,
          button2
      ]

      

      const Emb = new MessageEmbed()
      .setColor(main)
      .setTimestamp()
      .setAuthor(user.username, user.displayAvatarURL({dynamic: true}))
      .setTitle(ranks.serious)

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
              embeds: [Emb.setTitle(ranks.canceled)],
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
            embeds: [Emb.setTitle(ranks.done)],
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

    const lb = gg.map(e => `**${e.position === 1 ? `🏆 №${e.position}` : `№${e.position}`}**. **${e.username}**#${e.discriminator}\n**${ranks.level}** ${e.level} | **${ranks.xp}** ${e.xp.toLocaleString()}`);

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
        .setColor(main)
        .setTimestamp()
        page2 =  new MessageEmbed()
        .setDescription(lb.slice(10, 20).join("\n\n"))
        .setColor(main)
        .setTimestamp()
      } else if (led.length <= 30) {
        page1 =  new MessageEmbed()
        .setDescription(lb.slice(0, 10).join("\n\n"))
        .setColor(main)
        .setTimestamp()
        page2 =  new MessageEmbed()
        .setDescription(lb.slice(10, 20).join("\n\n"))
        .setColor(main)
        .setTimestamp()
        page3 =  new MessageEmbed()
        .setDescription(lb.slice(20, 30).join("\n\n"))
        .setColor(main)
        .setTimestamp()
      }
      let pages = [page1, page2, page3]
      if(!page3) { pages = [
        page1.setAuthor(`${message.guild.name}\n${ranks.top20}`).setThumbnail(message.guild.iconURL({dynamic: true})),
        page2.setAuthor(`${message.guild.name}\n${ranks.top20}`).setThumbnail(message.guild.iconURL({dynamic: true}))
      ] } else { pages = [page1.setAuthor(`${message.guild.name}\n${ranks.top30}`).setThumbnail(message.guild.iconURL({dynamic: true})),
        page2.setAuthor(`${message.guild.name}\n${ranks.top30}`).setThumbnail(message.guild.iconURL({dynamic: true})),
        page3.setAuthor(`${message.guild.name}\n${ranks.top30}`).setThumbnail(message.guild.iconURL({dynamic: true}))] }

      const emojies = ['⏪', '◀️', '⏹️', '▶️', '⏩']

      const timeout = '100000'

      const button1 = new MessageButton()
            .setCustomId('previousbtn')
            .setLabel(previous)
            .setStyle('DANGER');

            const button2 = new MessageButton()
            .setCustomId('nextbtn')
            .setLabel(next)
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
