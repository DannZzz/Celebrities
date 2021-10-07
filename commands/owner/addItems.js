const {rpg, rpgFind} = require("../../functions/models");
const {error, embed} = require("../../functions/functions");
const {STAR, AGREE, DISAGREE, devID} = require('../../config')
const ITEMS = require("../../JSON/items.js");
const {MessageActionRow, MessageSelectMenu} = require("discord.js");

module.exports = {
    config: {
        name: "additem",
        aliases: ''
    },
    run: async (bot, msg, args) => {
        if(!devID.includes(msg.author.id)) return
        if (!args[0]) return error(msg, "Укажите ID");
        const isData = await rpgFind(args[0]);
        if (!isData) return error(msg, "Не найден.");

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
            

            
            await rpg.updateOne({userID: args[0]}, {$inc: {[need.name]: count}});
                
            return msg.react(AGREE);
            

          }
        });

        newCollector.on("end", () => {
          if (!bool2) {
            req.delete();
            return error(message, "Время вышло")
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