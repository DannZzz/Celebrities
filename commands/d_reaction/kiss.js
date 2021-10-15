const Discord = require('discord.js');
const {MessageActionRow, MessageEmbed, MessageButton} = require('discord.js');
const superagent = require('superagent');
const pd = require("../../models/profileSchema");
const {greenlight, redlight, reddark, main} = require('../../JSON/colours.json');
const {error} = require('../../functions/functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);

module.exports = {
  config: {
    name: "kiss",
    aliases: ['поцеловать'],
    category: 'd_reaction'
  },
  run: async (bot, message, args) => {
      const getLang = require("../../models/serverSchema");
      const LANG = await getLang.findOne({serverID: message.guild.id});
      const {kiss: k, specify, interError, ERROR} = require(`../../languages/${LANG.lang}`);   
    try {
        const user = message.author
        if(!args[0]) return error(message, specify);
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
        if (!member) return error(message, specify);
        if (member.id === message.author.id) return error(message, k.error);
        const { body } = await superagent
        .get("https://nekos.life/api/kiss");

        const sembed = new Discord.MessageEmbed()
        .setColor(main)
        .setDescription(`<@${message.author.id}> ${k.done} <@${member.user.id}>`)
        .setImage(body.url)

        const my = await pd.findOne({userID: message.author.id});
        const his = await pd.findOne({userID: member.id});
        if (my.marryID && his.marryID && my.marryID === his.marryID) {
        return message.channel.send({embeds: [sembed]})
        } else if (my.marryID && my.marryID !== his.marryID) {return error(message, k.fidelity)}
        else if (!my.marryID && his.marryID) return error(message, k.already)
        const button1 = new MessageButton()
        .setCustomId('previousbtn')
        .setLabel(k.button1)
        .setStyle('DANGER');
  
        const button2 = new MessageButton()
        .setCustomId('nextbtn')
        .setLabel(k.button2)
        .setStyle('SUCCESS');
  
        let buttonList = [
            button1,
            button2
        ]
  
        const Emb = new MessageEmbed()
        .setColor(main)
        .setAuthor(user.username, user.displayAvatarURL({dynamic: true}))
        .setDescription(`${k.question} ${member}`)
  
        const row = new MessageActionRow().addComponents(buttonList);
        const curPage = await message.channel.send({
          embeds: [Emb],
          components: [row],
        })
  
        const filter = (i) => {
          if ( (i.customId === buttonList[0].customId ||
          i.customId === buttonList[1].customId) &&
          i.user.id === member.id) return true;

          const intEmbed = new MessageEmbed()
            .setColor(reddark)
            .setTitle(ERROR)
            .setDescription(interError)
          
          return i.reply({embeds: [intEmbed], ephemeral: true})
              
            
        } 

  
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
                embeds: [Emb.setDescription(`${member} ${k.refused}.`)],
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
