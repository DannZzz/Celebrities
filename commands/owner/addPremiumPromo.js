const {rpg} = require("../../functions/models");
const F = require("../../functions/functions");
const {STAR, AGREE, DISAGREE, devID, adminID} = require('../../config')
const Promo = require("../../functions/promoClass");

module.exports = {
    config: {
        name: "addpremiumpromo",
        aliases: ''
    },
    run: async (bot, msg, args) => {
        if(!devID.includes(msg.author.id)) return
        await Promo(msg).addPremiumPromo();
        msg.react(AGREE)
    }
}