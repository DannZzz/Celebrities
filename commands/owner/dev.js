const {rpg, bag} = require("../../functions/models");
const {error} = require("../../functions/functions");
const {STAR, AGREE, DISAGREE, devID, adminID} = require('../../config')

module.exports = {
    config: {
        name: "dev",
        aliases: '',
        dev: true
    },
    run: async (bot, msg, args) => {

        if (!args[0] || !args[1] || !isNaN(args[0]) || isNaN(args[1])) return error(msg, "[gold или selendian] <кол-во>");
        if (args[0].toLowerCase() === "gold") {
            await bag.updateMany({}, {$inc: {stars: Math.round(args[1])}});
            return msg.react(AGREE);
        } else if (args[0].toLowerCase() === "selendian") {
            await bag.updateMany({}, {$inc: {crystal: Math.round(args[1])}});
            return msg.react(AGREE);
        }

    
    }
}