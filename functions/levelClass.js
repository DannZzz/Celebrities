const { cardFind, bagFind, serverFind, card: cd, bag, addStar, rpgFind, profile, profileFind } = require("./models");
const { error, embed, firstUpperCase, randomRange, delay, sendToMail, pagination, formatNumber } = require("./functions");
const heroes = require("../JSON/heroes.json");
const { none, main } = require("../JSON/colours.json");
const { AGREE, DISAGREE, STAR, LEFT, RIGHT } = require("../config");
const { stripIndents } = require("common-tags");
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageCollector, MessageButton } = require("discord.js");
const levels = require("../JSON/levels.json");

class LevelMethods {
    static getCurrentLevelByXp(xp) {
        for (let i in levels) {
            if (levels[i] > xp) {
                return {
                    currentLevelXp: levels[(parseInt(i) - 1)+""],
                    current: parseInt(i) - 1,
                    xpForNextLevel: levels[i]
                };
            }
        }
    };

    static async addXp(id, xp = 1) {
        const pd = await profile.findOneAndUpdate({userID: id}, {$inc: {xp: Math.round(xp)}});
        return pd;
    }

    
}


module.exports = {LevelMethods};
