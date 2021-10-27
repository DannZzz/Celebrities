const {rpg, rpgFind, event} = require("../../functions/models");
const {error, embed} = require("../../functions/functions");
const EVENT = require("../../functions/eventClass");
const {STAR, AGREE, DISAGREE, devID, adminID} = require('../../config')
const ITEMS = require("../../JSON/items.js");
const {MessageActionRow, MessageSelectMenu, MessageEmbed} = require("discord.js");
const {main} = require('../../JSON/colours.json');

module.exports = {
    config: {
        name: "additem",
        aliases: ''
    },
    run: async (bot, msg, args) => {
        if(!devID.includes(msg.author.id) && !adminID.includes(msg.author.id)) return
        if (!args[0]) return error(msg, "Укажите ID");
        const isData = await rpgFind(args[0]);
        if (!isData) return error(msg, "Не найден.");
        await EVENT(args[0]).checkDocument();
        const menuArray = [];
   
      for (let itemm in ITEMS) {
        const item = ITEMS[itemm]
        menuArray.push({
          label: item.NAME,
          description: `Цена: ${item.cost || "—"}`,
          value: item.name,
          emoji: item.emoji
        });
    
      }

      let toGuild = bot.guilds.cache.get('731032795509686332');
      let toChannel = toGuild.channels.cache.get('898495393560674334');
  
      const emb = new MessageEmbed()
      .setAuthor(`${msg.author.tag} (${msg.author.id})`, msg.author.displayAvatarURL({dynamic: true}))
      .setColor(main)
      .setTimestamp()

      const row = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
         .setCustomId("gettingItem")
         .setPlaceholder("Укажите предмет...")
         .addOptions([menuArray])
      );

      const first = await msg.channel.send({content: "ㅤ", components: [row]})

      const collector = msg.channel.createMessageComponentCollector({
        filter: i => i.isSelectMenu() && i.user.id === msg.author.id,
        time: 30000,
        max: "1"
      })
      let bool = false;
      collector.on("collect", async i => {
        bool = true;
        first.delete();
        collector.stop();

        const need = ITEMS[i.values[0]];
        
        const req = await msg.channel.send("Кол-во?");
        const newCollector = msg.channel.createMessageCollector({
          filter: m => m.author.id === msg.author.id,
          time: 20000
        });
        let bool2 = false;
        newCollector.on("collect", async m => {
          if (!isNaN(m.content) && Math.round(m.content) >= 1) {
            m.delete();
            req.delete()
            bool2 = true;
            newCollector.stop();
            const count = Math.round(m.content);
            
            if(need.name === "halloween") {
              await event.updateOne({userID: args[0]}, {$inc: {candyBox: count}});
              msg.react(AGREE);
              const item = ITEMS[need.name];
              toChannel.send({embeds: [emb.setDescription(`Из сервера **${msg.guild.name}**\`(${msg.guild.id})\`\n\nПредмет: ${item.emoji} \`${count}\`\nКому: \`${bot.users.cache.get(args[0]).tag}(${bot.users.cache.get(args[0]).id})\``)]})
              return;
            }

            
            await rpg.updateOne({userID: args[0]}, {$inc: {[need.name]: count}}).then(() => {
              const item = ITEMS[need.name];
              msg.react(AGREE);
              toChannel.send({embeds: [emb.setDescription(`Из сервера **${msg.guild.name}**\`(${msg.guild.id})\`\n\nПредмет: ${item.emoji} \`${count}\`\nКому: \`${bot.users.cache.get(args[0]).tag}(${bot.users.cache.get(args[0]).id})\``)]})
            }).catch(() => msg.react(DISAGREE))
                
            return 
            

          }
        });

        newCollector.on("end", () => {
          if (!bool2) {
            req.delete();
            return error(msg, "Время вышло")
        }
        })

      })

      collector.on("end", () => {
        if (!bool) {
          first.delete();
          return error(message, "Время вышло")}
      })

    }
}