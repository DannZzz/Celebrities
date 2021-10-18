const { bagFind, rpg, rpgFind, addPremiumStar, serverFind} = require("../functions/models");
const { randomRange, error, embed } = require("../functions/functions");
const { STAR, box: b } = require("../config");
const heroes = require("../JSON/heroes.json");

module.exports = {
    tropicalForest: {
        id: "tropicalForest",
        nameRU: "Тропический лес",
        nameEN: "The Tropical forest",
        cost: 5000,
        time: 60 * 60 * 1000,
        reward: {
            emoji: "🌲",
            rewardTypes: ["gold", "box"],
            generateReward: async function (bot, msg, data = false)  {
                const minMax = {
                    gold: {
                        min: 2500,
                        max: 20000
                    },
                    box: {
                        min: 10,
                        max: 25
                    }
                }

                if (data) return minMax;
                
                const random = Math.floor(Math.random() * this.rewardTypes.length);
                const {gold, box} = minMax;
                switch (this.rewardTypes[random]) {
                    case "gold":
                        const rand1 = randomRange(gold.min, gold.max);
                        await addPremiumStar(bot, msg.author.id, rand1);
                        const get = await addPremiumStar(bot, msg.author.id, rand1, true);
                        return `${get} ${STAR}`;
                    case "box":
                        const rand2 = randomRange(box.min, box.max);
                        await rpg.updateOne({userID: msg.author.id}, {$inc: {box: rand2}});
                        return `${rand2} ${b}`;
                }
            }
        }
    },
    bodeGalaxy: {
        id: "bodeGalaxy",
        nameRU: "Галактика Боде",
        nameEN: "Bode Galaxy",
        cost: 15000,
        time: 8 * 60 * 60 * 1000,
        reward: {
            emoji: "🌠",
            rewardTypes: ["gold", "box", "hero"],
            generateReward: async function (bot, msg, data = false)  {
                const minMax = {
                    gold: {
                        min: 5000,
                        max: 30000
                    },
                    box: {
                        min: 20,
                        max: 45
                    }
                }

                if (data) return minMax;
                
                const random = Math.floor(Math.random() * this.rewardTypes.length);
                const {gold, box} = minMax;
                switch (this.rewardTypes[random]) {
                    case "gold":
                        const rand1 = randomRange(gold.min, gold.max);
                        await addPremiumStar(bot, msg.author.id, rand1);
                        const get = await addPremiumStar(bot, msg.author.id, rand1, true);
                        return `${get} ${STAR}`;
                    case "box":
                        const rand2 = randomRange(box.min, box.max);
                        await rpg.updateOne({userID: msg.author.id}, {$inc: {box: rand2}});
                        return `${rand2} ${b}`;
                    case "hero":
                        const rpgData = await rpgFind(msg.author.id);
                        const get1 = rpgData.heroes.find(x => x.name === "Alfonso");
                        if (rpgData.heroes.length >= rpg.itemCount || get1) return await this.generateReward();

                        rpgData.heroes.push({
                            name: heroes["Alfonso"]["name"],
                            healthdamage: heroes["Alfonso"]["healthdamage"],
                            damage: heroes["Alfonso"]["name"]
                        });

                        rpgData.save();
                        const sd = await serverFind(msg.guild.id);
                        const l = sd.lang || "ru";

                        return (l === "ru" ? "Альфонсо" : "Alfonso");
                }
            }
        }
    },


};