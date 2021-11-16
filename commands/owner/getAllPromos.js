const {rpg} = require("../../functions/models");
const F = require("../../functions/functions");
const {STAR, AGREE, DISAGREE, devID, adminID} = require('../../config')
const Promo = require("../../functions/promoClass");

module.exports = {
    config: {
        name: "promoinfo",
        aliases: '',
        dev: true
    },
    run: async (bot, msg, args) => {
        await Promo(msg).getAllPromo()
    }
}