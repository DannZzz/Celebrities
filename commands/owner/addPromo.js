const {rpg} = require("../../functions/models");
const F = require("../../functions/functions");
const {STAR, AGREE, DISAGREE, devID, adminID} = require('../../config')
const Promo = require("../../functions/promoClass");

module.exports = {
    config: {
        name: "addpromo",
        aliases: ''
    },
    run: async (bot, msg, args) => {
        if(!devID.includes(msg.author.id) && !adminID.includes(msg.author.id)) return
        await Promo(msg).addPromo(args[0], args[1], args[2])
        msg.react(AGREE)
    }
}