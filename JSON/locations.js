const { bagFind, rpg, rpgFind, addPremiumStar} = require("../functions/models");
const { randomRange, error, embed } = require("../functions/functions");
const { STAR, box: b } = require("../config");

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


};