const {rpg, addCandy, addCrystal} = require("../../functions/models");
const F = require("../../functions/functions");
const EVENT = require("../../functions/eventClass");
const {STAR, AGREE, DISAGREE, devID, CRYSTAL} = require('../../config')


module.exports = {
    config: {
        name: "voter",
        aliases: ''
    },
    run: async (bot, msg, args) => {
        if(!devID.includes(msg.author.id)) return
        if (!args[0]) return error(message, "Укажите участника.");

        let user = bot.users.cache.get(args[0]);
        if (!user) return error(message, "Данные не найдены.");
        
        await addCrystal(user.id, 15);
        await F.sendToMail(user.id, {textMessage: `Vote - 15 ${CRYSTAL}`, createdAt: new Date()});
        msg.react(AGREE)
    }
}