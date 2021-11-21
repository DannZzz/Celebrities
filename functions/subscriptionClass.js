const { cardFind, bagFind, serverFind, card: cd, bag, addStar } = require("./models");
const {none, main} = require("../JSON/colours.json");
const {AGREE, DISAGREE, STAR} = require("../config");
const {MessageEmbed, MessageActionRow, MessageSelectMenu, MessageCollector} = require("discord.js");
const heroes = require("../JSON/heroes.json");

const ms = require("ms");

const subData = require("../models/subscription");

const subIds = ["1", "2", "3"];

class SubClass {
    static async addSubscription(msg, id, level, time) {
        if (!id || !level || !subIds.includes(level) || !time || !ms(time)) return;

        const data = await subData.findOne({userID: id});
        if (!data) {
            const newd = await subData.create({
                userID: id,
                level: +level,
                date: new Date(Date.now() + ms(time))
            });
            await newd.save();
            return msg.react(AGREE);
        } else {
            await subData.updateOne({userID: id}, {$set: {
                level: +level,
                date: new Date(Date.now() + ms(time))
            }});
            return msg.react(AGREE);
        }
        
    }
    
    static async getStringById (id, guildId) {
        const sd = await serverFind(guildId);
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

    static async getSubString(id, guildId) {
        const data = await subData.findOne({userID: id});
        const myLevel = await this.getSubId(id);
        
        const sd = await serverFind(guildId);
        const lang = sd.lang || "ru";
        
        const langData = {
        en: {
            "1": "Classic Boost 💛",
            "2": "Average Boost 💚",
            "3": "Maximum Boost 💜"
        },
        ru: {
            "1": "Классический Буст 💛",
            "2": "Средний Буст 💚",
            "3": "Максимальный Буст 💜"
        }
        };
        
        
        if (langData[lang][`${myLevel}`]) {
            return langData[lang][`${myLevel}`] + ` ${lang === "en" ? "until" : "до"} <t:${makeTimestamp(data.date.getTime())}>`
        } else return "—";

    };

    static async getSubId (id) {
        const data = await subData.findOne({userID: id})
        if (!data) return 0;
        if (data.date > new Date()) return data.level;
        return 0;
    };

    static async heroHighSubLevel (id, hero) {
        //if (!this.hero.subLevherel) return true;

        const mySubLevel = await this.getSubId(id)
        const hl = heroes[hero].subLevel;

        if (mySubLevel < hl) {return false}
        else {
            return true;
        };
        
    };

};

module.exports = SubClass;



function makeTimestamp(timestamp, add = 0) {
    return Math.round((timestamp + add) / 1000);
}

function error(msg, text = 'Ошибка') {
    const Emb = new MessageEmbed()
    .setColor(reddark)
    //.setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
    .setDescription(`${DISAGREE} ${text}`)

    msg.react(DISAGREE)
    return msg.reply({embeds: [Emb]}).then(message => setTimeout(() => message.delete(), 15000))
  }