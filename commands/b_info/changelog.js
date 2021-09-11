const { MessageEmbed, MessageButton } = require("discord.js");
const { cyan } = require("../../JSON/colours.json");
const heroes = require("../../JSON/heroes.json");
const enemies = require("../../JSON/enemies.json");
const {error, pagination} = require('../../functions');
const { VERSION, STAR } = require('../../config');

module.exports = {
    config: {
        name: "changelog",
        category: "b_info",
        aliases: ''
    },
    run: async (bot, message, args) => {
        try {
   
        const getLang = require("../../models/serverSchema");
        const LANG = await getLang.findOne({serverID: message.guild.id});
        const {changelog: cl, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`); 
               
        return message.channel.send({embeds: [cl.get(VERSION)]});

          const timeout = '100000'
          const userids = [message.author.id]
          //const pages = [page1, page2, page3]
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
          //pagination(message, pages, buttonList, timeout, userids)
      
          
        }
        catch (r ){
            console.log(r);
        }
    }
}

