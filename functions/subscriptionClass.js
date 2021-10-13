const { cardFind, bagFind, serverFind, card: cd, bag, addStar } = require("./models");
const { error, embed, firstUpperCase, randomRange, delay } = require("./functions");
const {none, main} = require("../JSON/colours.json");
const {AGREE, DISAGREE, STAR} = require("../config");
const {MessageEmbed, MessageActionRow, MessageSelectMenu, MessageCollector} = require("discord.js");
const heroes = require("../JSON/heroes.json");

const boosterRoleIds = {
    classic: "897172766929858601",
    premium: "897172906021371926",
    premiumPlus: "897172954411053098"
};

const subId = {
    none: 0,
    classic: 1,
    average: 2,
    max: 3
}

const serverId = "882589567377637408";

class SubClass {
    constructor(bot, msg, heroName) {
        this.bot = bot;
        this.msg = msg;
        this.user = msg.author;
        this.server = msg.guild;
        this.hero = heroes[heroName];
    };

    async getStringById (id) {
        const sd = await serverFind(this.server.id);
        const lang = sd.lang || "ru";
        
        const langData = {
        en: {
            classic: "Classic Boost 💛",
            average: "Average Boost 💚",
            max: "Maximum Boost 💜"
        },
        ru: {
            classic: "Классический Буст 💛",
            average: "Средний Буст 💚",
            max: "Максимальный Буст 💜"
        }
        };

        if (id == 1) {
            return langData[lang].classic;
        } else if (id == 2) {
            return langData[lang].average;
        } else if (id == 3) {
            return langData[lang].max;
        } 
        
    };

    async getSubString() {
        const server = this.bot.guilds.cache.get(serverId);

        const sd = await serverFind(this.server.id);
        const lang = sd.lang || "ru";
        
        const langData = {
        en: {
            classic: "Classic Boost 💛",
            average: "Average Boost 💚",
            max: "Maximum Boost 💜"
        },
        ru: {
            classic: "Классический Буст 💛",
            average: "Средний Буст 💚",
            max: "Максимальный Буст 💜"
        }
        };
        
        
        if (server) {
        const member = server.members.cache.get(this.user.id);
        if (member) {
            if (member.roles.cache.get(boosterRoleIds.premiumPlus)) {
            return langData[lang].max;
            } else if (member.roles.cache.get(boosterRoleIds.premium)) {
            return langData[lang].average;
            } else if (member.roles.cache.get(boosterRoleIds.classic)) {
            return langData[lang].classic;
            } else {
            return "—";
            }
        }
        } else {
        return "—";
        };

    };

    getSubId () {
        const server = this.bot.guilds.cache.get(serverId);

        if (server) {
            const member = server.members.cache.get(this.user.id);
            if (member) {
                if (member.roles.cache.get(boosterRoleIds.premiumPlus)) {
                return 3;
                } else if (member.roles.cache.get(boosterRoleIds.premium)) {
                return 2;
                } else if (member.roles.cache.get(boosterRoleIds.classic)) {
                return 1;
                } else {
                return -1;
                }
            }
            } else {
            return -1;
            };

    };

    heroHighSubLevel () {
        if (!this.hero.subLevel) return true;

        const mySubLevel = SubId(this.bot, this.user.id) || 0;
        const hl = this.hero.subLevel;

        if (mySubLevel < hl) return false;
        
    };

};

const func = function (bot, msg, name) {
    return new SubClass(bot, msg, name);
}

module.exports = func;


function SubId (bot, id) {
    const server = bot.guilds.cache.get(serverId);

    if (server) {
        const member = server.members.cache.get(id);
        if (member) {
            if (member.roles.cache.get(boosterRoleIds.premiumPlus)) {
            return 3;
            } else if (member.roles.cache.get(boosterRoleIds.premium)) {
            return 2;
            } else if (member.roles.cache.get(boosterRoleIds.classic)) {
            return 1;
            } else {
            return -1;
            }
        }
        } else {
        return -1;
        };

};