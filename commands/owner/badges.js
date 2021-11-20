const {rpg, bag, botData} = require("../../functions/models");
const {error, embed} = require("../../functions/functions");
const {STAR, AGREE, DISAGREE, devID, adminID} = require('../../config')
const heroes = require("../../JSON/heroes.json");
const badges = require("../../JSON/badges.json");

module.exports = {
    config: {
        name: "badge",
        aliases: '',
        admin: true,
        cooldown: 15
    },
    run: async (bot, msg, args) => {
       
       if (!args[0]) return error(msg, "Укажите айди!");

       const user = bot.users.cache.get(args[0]);
        
       if (!user) return error(msg, "Участник не найден!");

       const c = await msg.channel.createMessageCollector({
           filter: m => m.author.id === msg.author.id,
           time: 15000
       });
       const text = [];
       for( let i in badges) {
           const badge = badges[i];

           text.push(`ID: \`${badge.id}\` | ${badge.emoji} | ${badge.desc}`)
       }

       const m1 = await embed(msg, text.join("\n\n"), false)
       let bool = false;
       c.on("collect", async message => {
            const m = message.content;
            const badge = badges[m];
            if (badge) {
                bool = true;
                c.stop();

                const botD = await botData.findOne({name: "main"});

                if(botD[badge.id] && botD[badge.id].includes(user.id)) {
                    const arr = botD[badge.id].filter(id => id !== user.id);
                    await botData.updateOne({name: "main"}, {$set: {[badge.id]: arr}});
                    return msg.react(AGREE);
                } else if (botD[badge.id] && !botD[badge.id].includes(user.id)) {
                    await botData.updateOne({name: "main"}, {$set: {[badge.id]: [...botD[badge.id], user.id] }});
                    return msg.react(AGREE);
                } else if (!botD[badge.id]) {
                    await botData.updateOne({name: "main"}, {$set: {[badge.id]: [user.id] }});
                    return msg.react(AGREE);
                }
                
            }
       });


       c.on("end", () => {
            m1.delete();
            if (!bool) return error(msg, "Время вышло!");
       });
       
    }
}