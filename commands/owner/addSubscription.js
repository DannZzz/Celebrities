const {rpg, bag} = require("../../functions/models");
const {error} = require("../../functions/functions");
const {STAR, AGREE, DISAGREE, devID, adminID} = require('../../config')

const Subs = require("../../functions/subscriptionClass");

module.exports = {
    config: {
        name: "add-sub",
        aliases: '',
        dev: true
    },
    run: async (bot, msg, args) => {

        Subs.addSubscription(msg, args[0], args[1], args[2]);

    
    }
}