const { cardFind, bagFind, serverFind, card: cd, bag, addStar, rpgFind, profile, profileFind, addCrystal } = require("./models");
const { error, embed, firstUpperCase, randomRange, delay, sendToMail, pagination, formatNumber } = require("./functions");
const heroes = require("../JSON/heroes.json");
const { none, main } = require("../JSON/colours.json");
const { AGREE, DISAGREE, STAR, LEFT, RIGHT } = require("../config");
const { stripIndents } = require("common-tags");
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageCollector, MessageButton } = require("discord.js");
const levels = require("../JSON/levels.json");
const rewards = require("../rewards.json");

const Subs = require("./subscriptionClass");

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
        const sub = await Subs.getSubId(id);
        let subAdd = 1;
        if (sub == 2 || sub == 3) subAdd = sub;
        await profile.updateOne({userID: id}, {$inc: {xp: Math.round(xp * subAdd)}});
        const data = await profileFind(id);
        const nowLevel = this.getCurrentLevelByXp(data.xp || 0);
        if (nowLevel.current > (data.xpLevel || 1)) {
            const reward = Math.round(rewards.xpLevelUpdate * nowLevel.current);
            await Promise.all([
                profile.updateOne({userID: id}, {$inc: {xpLevel: 1}}),
                addCrystal(id, reward)
            ]);
        }
    }

    
}


module.exports = {LevelMethods};
