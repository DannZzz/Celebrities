const {rpg, bag, vip, clan, profileFind} = require("../../functions/models");
const {error} = require("../../functions/functions");
const {STAR, AGREE, DISAGREE, devID, adminID} = require('../../config')

const {LevelMethods} = require("../../functions/levelClass");

module.exports = {
    config: {
        name: "addxp",
        aliases: '',
        dev: true
    },
    run: async (bot, msg, args) => {
        if (!args[0] || !args[1]) return error(msg, "[ID] [кол-во]");

        const user = await profileFind(args[0]);
        if (!user) return error(msg, "Участник не найден!");
        
        if (isNaN(args[1])) return error(msg, "Укажите количесто поинтов!");

        await LevelMethods.addDevXp(args[0], args[1]).then(msg.react(AGREE));
    
    }
}