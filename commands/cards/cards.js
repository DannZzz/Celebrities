const { main } = require('../../JSON/colours.json');
const Card = require("../../functions/cardClass");
const { MessageEmbed } = require("discord.js");
const {error, firstUpperCase} = require("../../functions/functions");
const {serverFind} = require("../../functions/models");
const cards = require('../../JSON/cards.json');

module.exports = {
  config: {
    name: "cards",
    aliases: ['card', 'карты'],
    category: 'cards'
  },
  run: async (bot, msg, args) => {
    const sd = await serverFind(msg.guild.id);
    const {cardClass: cc, cards: cd} = require(`../../languages/${sd.lang}`);
    
    const user = msg.author;
      const arr = await Card(msg).getCards();
      if (!arr) return error(msg, cc.noCard);
      const emb = new MessageEmbed()
        .setAuthor(user.tag)
        .setColor(main)
        .setThumbnail(user.displayAvatarURL({dynamic: true}))
      const text = arr.forEach( card => {
        const cardData = cards[card.name]
        emb.addField(`${cardData.emoji} ${firstUpperCase(sd.lang === "ru" ? `${cardData.nameRus} карта` : `${cardData.name} card`)}\n${cd.number} ${card.code}`, `${cd.balance} \`${card.amount}\` | ${cd.createdAt} ${card.createdAt.toLocaleDateString("ru-ru", {timeZone: "Europe/Moscow"})}\n${cd.maxSpace} ${cardData.maxSpace}\n${cd.maxAmount} ${cardData.maxGiveAmount}\n${cd.perc} ${cardData.percentage}%`)
      })
      
      return msg.channel.send({embeds: [emb]})
    
  }
}