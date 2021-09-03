const { MessageEmbed, MessageButton } = require("discord.js");
const { cyan } = require("../../JSON/colours.json");
const heroes = require("../../JSON/heroes.json");
const enemies = require("../../JSON/enemies.json");
const {error, pagination} = require('../../functions');
const { VERSION, STAR } = require('../../config');

module.exports = {
    config: {
        name: "журнал",
        description: "Журнал изменений бота.",
        usage: "",
        category: "b_info",
        accessableby: "Для всех",
        aliases: ['changelog']
    },
    run: async (bot, message, args) => {
        try {
   
          const page1 = new MessageEmbed()
          .setAuthor('Последние изменения бота.')
          .setTitle(`Новые команды!\nВерсия: ${VERSION}`)
          .setColor(cyan)
          .setDescription(`Новые команды: афк, рандом\nТеперь отображается герой и уровень героя участника в команде **?клан**!\n\nНовые вопросы для викторины.`)

          return message.channel.send({embeds: [page1]});

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

