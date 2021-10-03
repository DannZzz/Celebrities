const { clan, clanFind, rpg, rpgFind, bagFind, serverFind, bag, addStar } = require("./models");
const { error, embed, firstUpperCase, randomRange, delay } = require("./functions");
const {none, main} = require("../JSON/colours.json");
const {AGREE, DISAGREE, STAR, HERO, CLAN, LEAGUE} = require("../config");
const {MessageAttachment, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageCollector, MessageButton} = require("discord.js");

const leagueData = dataFetch();

class rateClass {
    constructor(message) {
        this.msg = message;
        this.user = message.author;
        this.server = message.guild;
        this.channel = message.channel;
    }

    fetch() {
        return leagueData.slice(1, 5);
    }

    async rateData (trophy) {
        const sd = await serverFind(this.server.id);

        const dataID = checker(trophy);
        const data = leagueData.find(x => x.id === dataID);
        if (!data) return;
        const name = sd.lang === "en" ? data.nameEn : data.name;

        return `${data.emoji} ${name}: ${trophy} ${LEAGUE.cup}`
    }

    async rateUpdate(userId, amount) {
        const sd = await serverFind(this.server.id);
        
        const data_first = await rpgFind(userId);
        await rpg.updateOne({userID: userId}, {$inc: {"league.rate": amount}});
        const data_second = await rpgFind(userId);
        const {rate: r2, id: id22, rewardId: rId, maxRate} = data_second.league;
        let id2 = id22 || 0;
        const rateNow = checker(r2);
        if (id2 !== rateNow && id2 < rateNow) await rpg.updateOne({userID: userId}, {$inc: {"league.id": 1}});
        if (id2 !== rateNow && id2 > rateNow) await rpg.updateOne({userID: userId}, {$inc: {"league.id": -1}});
        let rid = rId || 0;
        let max = maxRate || 0;
        if (r2 > max) await rpg.updateOne({userID: userId}, {$set: {"league.maxRate": r2}});
        
        if (rid < rateNow) {
            const dataID = checker(r2);
            const gg = leagueData.find(x => x.id === dataID);
            const langData = {
                ru: `Вы перешли в новую лигу, ваш приз - ${gg.reward} ${STAR}`,
                en: `You got a new league, your prize - ${gg.reward} ${STAR}`
            }

            embed(this.msg, langData[sd.lang || "en"]);

            await addStar(userId, gg.reward)
            await rpg.updateOne({userID: userId}, {$inc: {"league.rewardId": 1}});
        }
    
    }

    getDataId (tr) {
        return checker(tr)
    }

    winRewardGenerator(league) {
        const l = league || 0;
        switch (l) {
            case 0:
                return 50;
            case 1:
                return 45;
            case 2:
                return 40;
            case 3:
                return 30;
            case 4:
                return 20;
            default:
                break;    
        }
    }


};

const asd = function (msg) {
    return new rateClass(msg);
}

module.exports = asd;

function checker(tr) {
    const bronze = 500, silver = 2000, gold = 10000, platin = 50000;

    if (tr >= platin) {
        return 4;
    } else if (tr >= gold) {
        return 3;
    } else if (tr >= silver) {
        return 2;
    } else if (tr >= bronze) {
        return 1;
    } else {
        return 0
    }
}



function dataFetch () {
    const asd = [
        {
            id: 0,
            name: "Нет лиги",
            nameEn: "No league",
            emoji: ""
        },
        {
            id: 1,
            name: "Бронзовая лига",
            nameEn: "Bronze league",
            emoji: LEAGUE.bronze,
            reward: 5000,
            max: 500
        },
        {
            id: 2,
            name: "Серебряная лига",
            nameEn: "Silver league",
            emoji: LEAGUE.silver,
            reward: 20000,
            max: 2000
        },
        {
            id: 3,
            name: "Золотая лига",
            nameEn: "Golden league",
            emoji: LEAGUE.golden,
            reward: 100000,
            max: 10000
        },
        {
            id: 4,
            name: "Платиновая лига",
            nameEn: "Platin league",
            emoji: LEAGUE.platinum,
            reward: 300000,
            max: 50000
        }
    ]
    return asd;
}
