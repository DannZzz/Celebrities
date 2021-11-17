const { rpg, clan } = require("../../functions/models");
const { AGREE } = require("../../config");
const { formatNumber, embed, error, firstUpperCase } = require("../../functions/functions");
const bosses = require("../../JSON/guild-bosses.json");

module.exports = {
    config: {
        name: "guild-boss",
        dev: true
    },
    run: async (bot, msg, args) => {
        if (!args[0]) {
            return error(msg, "Укажите действие [update | remove] (Название босса)")
        } else if (args[0].toLowerCase() === "update") {
            if (!args[1]) return error(msg, "А название босса?");
            const boss = bosses[firstUpperCase(args[1].toLowerCase())];
            if (!boss) return error(msg, "Босс не найден");
            const allClans = await clan.find().exec();
            allClans.forEach(async clanObj => {
                const level = clanObj.level || 1;
                
                await clan.updateOne({ID: clanObj.ID}, {$set: {boss: {
                    name: boss.name,
                    health: Math.round(boss.health * level),
                    damage: Math.round(boss.damage * level),
                    date: new Date(Date.now() + 86400000 * 5)
                } }})
            })
            return msg.react(AGREE);
        } else if (args[0].toLowerCase() === "remove") {
            await clan.updateMany({}, {$set: {boss: undefined}});
            return msg.react(AGREE);
        }
        
    }
}