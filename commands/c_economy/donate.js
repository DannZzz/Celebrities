const {
    greenlight,
    redlight,
    cyan
  } = require('../../JSON/colours.json');

const {MessageEmbed} = require("discord.js");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "донат",
    description: "Поддерживать разработчика, и купить премиум доступ.",
    category: "c_economy",
    aliases: ["donate"],
    accessableby: "Для всех",
    usage: ""
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return
     
      let embed = new MessageEmbed()
      .setColor(cyan)
      .addFields(
        {name: `Поддерживать разработчика, и купить премиум доступ.`,
        value: '**[Ссылка на донат](https://www.donationalerts.com/r/danndevbot)**',
        inline: false},
        {name: `Всё, что нужно указать!`,
        value: '• Ваш ID\n• Что именно вы хотите, например **Vip 1** или **Vip 2**.',
        inline: false},
      )
      .setTimestamp()
      .setFooter("Отправьте ваши вопросы командой ?сообщение")

      message.channel.send({embeds: [embed]})
  }
}
