const {rpg} = require("../../functions/models");
const F = require("../../functions/functions");
const {STAR, AGREE, DISAGREE, devID, adminID} = require('../../config')
const Promo = require("../../functions/promoClass");

module.exports = {
    config: {
        name: "addpromo",
        aliases: '',
        admin: true
    },
    run: async (bot, msg, args) => {
        await Promo(msg).addPromo(bot, args[0], args[1], args[2])
        msg.react(AGREE)
    }
}