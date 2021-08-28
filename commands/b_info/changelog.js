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
          .setTitle(`Большое обновление!\nВерсия: ${VERSION}`)
          .setColor(cyan)
          .setDescription(`Новые герои, враг, баффы, нерфы, и команды!`)
          .setImage("https://i.ibb.co/ZVXTL5T/2-4-0.png")

          const page2 = new MessageEmbed()
          .setAuthor(`Новые герои!`)
          .addField(`Archangel (Архангел)`, heroes["Archangel"].description ,false)
          .addField(`Darkangel (Даркангел)`, heroes["Darkangel"].description ,false)
          .setImage("https://i.ibb.co/4fbbqBb/darkangel-archangel.gif")
          .setColor(cyan)

          const page3 = new MessageEmbed()
          .setAuthor(`Новая система кланов!`)
          .setTitle(`Кланы теперь доступны, ?клан хелп!`)
          .setColor(cyan)
          .setDescription(`
            **Все доступные команды!**
            \`\`клан (число)\`\` — Скинуть звёзды в бюджет клана.
            \`\`клан создать [название]\`\` — Создать свой клан (цена 5000 ${STAR})
            \`\`клан выгнать [номер участника]\`\` — Выгнать участника из клана.
            \`\`клан повысить [номер участника]\`\` — Повысить участника.
            \`\`клан понизить [номер участника]\`\` — Понизить участника.
            \`\`клан заявки\`\` — Посмотреть заявки клана.
            \`\`клан заявки очистить\`\` — Удалить все заявки.
            \`\`клан заявки включить\`\` — Включить заявки для вступлении в клан.
            \`\`клан заявки отключить\`\` — Отключить заявки для вступлении в клан.
            \`\`клан отклонить [номер заявки]\`\` — Отклонить заявку участника.
            \`\`клан принять [номер заявки]\`\` — Принять участника в клан.
            \`\`клан улучшить (инфо)\`\` — Улучшить клан.
            \`\`клан описание [текст]\`\` — Описание для клана.
            \`\`клан логотип [ссылка на лого]\`\` — Логотип для клана.
            \`\`клан награда\`\` — Получить ежедневные звёзды.
            \`\`клан выйти\`\` — Выйти из клана.
            \`\`клан удалить\`\` — Удалить клан.
            `)
          

          const timeout = '100000'
          const userids = [message.author.id]
          const pages = [page1, page2, page3]
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
          pagination(message, pages, buttonList, timeout, userids)
      
          
        }
        catch (r ){
            console.log(r);
        }
    }
}

