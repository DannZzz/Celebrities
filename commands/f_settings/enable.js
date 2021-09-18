const {server, serverFind} = require("../../functions/models");
const {error, embed, perms} = require("../../functions");
const {AGREE} = require("../../config")

module.exports = {
    config: {
        name: "enable",
        aliases: ["включить"],
        category: "f_settings"
    },
    run: async (bot, message, args) => {
        const data = await serverFind(message.guild.id);
        const {enable: e, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${data.lang}`);   
        
        if(!perms(message, "ADMINISTRATOR")) return error(message, perm);
        if (!args[0]) return error(message, e.no);
        let command = bot.commands.get(bot.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase())
        if (!command) return error(message, e.err);
        if (data.disabled && !data.disabled.includes(command.config.name)) return error(message, e.all);
        data.disabled.splice(data.disabled.indexOf(command.config.name), 1)
        await data.save()
        message.react(AGREE)
    }
};