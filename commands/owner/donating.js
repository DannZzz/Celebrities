const {rpg} = require("../../functions/models");
const F = require("../../functions/functions");
const {STAR, AGREE, DISAGREE, devID, adminID} = require('../../config')
const Partner = require("../../functions/partnerClass");

module.exports = {
    config: {
        name: "donating",
        aliases: '',
        dev: true
    },
    run: async (bot, msg, args) => {
        if (!args[0] || !args[1]) return F.error(msg, "[код] [айди донатера]");
        await Partner(bot, msg).addNewPartner(args[0], args[1]);
    }
}