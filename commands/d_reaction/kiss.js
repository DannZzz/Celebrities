const Discord = require('discord.js');
const {MessageActionRow, MessageEmbed, MessageButton} = require('discord.js');
const superagent = require('superagent');
const pd = require("../../models/profileSchema");
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const {error} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "поцеловать",
    aliases: ['поц', 'kiss'],
    category: 'd_reaction',
    description: "Поцелуй, давай!",
    usage: "[ник участника | упоминание | ID]",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return
       
    try {
        const user = message.author
        if(!args[0]) return error(message, "Укажи участника чтобы поцеловать его/ее.");
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
        if (!member) return error(message, "Укажи участника чтобы поцеловать его/ее.");
        if (member.id === message.author.id) return error(message, 'Ты не сможешь поцеловать себя.');
        const { body } = await superagent
        .get("https://nekos.life/api/kiss");

        const sembed = new Discord.MessageEmbed()
        .setColor(cyan)
        .setDescription(`<@${message.author.id}> поцеловал(-а) <@${member.user.id}>`)
        .setImage(body.url)
        .setTimestamp()

        const my = await pd.findOne({userID: message.author.id});
        const his = await pd.findOne({userID: member.id});
        if (my.marryID && his.marryID && my.marryID === his.marryID) {
        return message.channel.send({embeds: [sembed]})
        }
        const button1 = new MessageButton()
        .setCustomId('previousbtn')
        .setLabel('Отказаться')
        .setStyle('DANGER');
  
        const button2 = new MessageButton()
        .setCustomId('nextbtn')
        .setLabel('Согласиться')
        .setStyle('SUCCESS');
  
        let buttonList = [
            button1,
            button2
        ]
  
        const Emb = new MessageEmbed()
        .setColor(cyan)
        .setTimestamp()
        .setAuthor(user.username, user.displayAvatarURL({dynamic: true}))
        .setDescription(`Хочет с вами поцеловаться ${member}`)
  
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
            collector.stop()
          } else if (i.customId === buttonList[1].customId) {
            await i.deferUpdate()

            const disabledRow = new MessageActionRow().addComponents(
              buttonList[0].setDisabled(true),
              buttonList[1].setDisabled(true)
            );
           
            curPage.edit({
              embeds: [sembed],
              components: [disabledRow],
            });//
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
        });
        
      } catch (e){
        console.log(e);
      }
  }
}
