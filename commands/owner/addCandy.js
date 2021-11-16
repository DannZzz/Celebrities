const {rpg, addCandy} = require("../../functions/models");
const F = require("../../functions/functions");
const EVENT = require("../../functions/eventClass");
const {STAR, AGREE, DISAGREE, devID} = require('../../config')


module.exports = {
    config: {
        name: "addcandy",
        aliases: '',
        dev: true
    },
    run: async (bot, msg, args) => {
        if (!args[0]) return error(message, "Укажите участника.");

        let user = bot.users.cache.get(args[0]);
        if (!user) return error(message, "Данные не найдены.");
        await EVENT(user.id).checkDocument();
        let toGuild = bot.guilds.cache.get('731032795509686332');
        let toChannel = toGuild.channels.cache.get('880733129491513395');
        
        if(!args[1]) return error(message, "Укажите кол-во монет, чтобы добавить.");
        if(isNaN(args[1])) return error(message, "Укажите кол-во монет в виде, чтобы добавить.");
        if(args[1] > 1000000000) return error(message, "Укажите число меньше **1.000.000.000**.");

        await addCandy(user.id, Math.round(args[1]));
        msg.react(AGREE)
    }
}