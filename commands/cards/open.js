const { main } = require('../../JSON/colours.json');
const Card = require("../../functions/cardClass");
const {error, firstUpperCase} = require("../../functions/functions");
const {serverFind} = require("../../functions/models");
const cards = require('../../JSON/cards.json');
const {MessageEmbed, MessageActionRow, MessageSelectMenu} = require("discord.js");

module.exports = {
  config: {
    name: "open",
    aliases: ['create', 'создать', "открыть"],
    category: 'cards'
  },
  run: async (bot, msg, args) => {
    const sd = await serverFind(msg.guild.id);
    const {cardClass: cc, cards: cd, open} = require(`../../languages/${sd.lang}`);
    
      
    const user = msg.author;

    const emb = new MessageEmbed()
        .setAuthor(user.tag)
        .setColor(main)
        .setThumbnail(user.displayAvatarURL({dynamic: true}))

    for (let data in cards) {
        const cardData = cards[data];
        if (cardData.name !== "VIP") {
            emb.addField(`${cardData.emoji} ${firstUpperCase(sd.lang === "ru" ? `${cardData.nameRus} карта` : `${cardData.name} card`)}`, `${cd.maxSpace} ${cardData.maxSpace}\n${cd.maxAmount} ${cardData.maxGiveAmount}\n${cd.perc} ${cardData.percentage}%`)
        }
    }    
    
    const row = await getCardMenu(msg, {custom: "opening", placeHolder: cc.choose});

        const message = await msg.channel.send({embeds: [emb], components: [row]})
        const collector = await message.createMessageComponentCollector({
            filter: i => i.isSelectMenu() && i.user.id === user.id,
            time: 45000,
            max: "1"
        })
        let bool = false;
        collector.on("collect", async (i) => {
            message.delete()
            bool = true;
            i.deferUpdate();
            collector.stop();
            let val = i.values[0];
            Card(msg).openCard(val)
            
        })

        collector.on("end", () => {
            if (!bool) {
                message.delete();
                return error(msg, cc.timeOut);
            };  
        })
    
    
    
    
    }
}

async function getCardMenu(msg, {
    custom,
    placeHolder,
}) {
    const ln = await serverFind(msg.guild.id);
    const {cardClass: cc, cards: cd, open } = require(`../../languages/${ln.lang}`);

    let options = [];
    for (let data in cards) {
        const cardName = cards[data];
        if (cardName.name !== "VIP") {
            options.push({
                label: `${ln.lang === "en" ? `${firstUpperCase(cardName.name)} Card` : `${firstUpperCase(cardName.nameRus)} Карта`} ${cardName.available === "yes" ? " " : "VIP 2"}`,
                value: cardName.name,
                description: `${open.cost} ${cardName.cost}`,
                emoji: cardName.emoji
            })
        }
    }
    
    return new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
            .setCustomId(custom)
            .setPlaceholder(placeHolder)
            .addOptions([options])
        )
}