const {server, serverFind} = require("../../functions/models");
const {error, embed, perms, missingArgument} = require("../../functions/functions");
const {AGREE} = require("../../config")

module.exports = {
    config: {
        name: "enable",
        aliases: ["включить"],
        category: "f_settings",
        permissions: ["ADMINISTRATOR"],
        examples: ["enable user"]
    },
    run: async function (bot, message, args) {
        const data = await serverFind(message.guild.id);
        const {enable: e, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${data.lang}`);   
        
        if (!args[0]) return await missingArgument(message, e.no, `${this.config.name} ${e.usage}`, this.config.examples);
        let command = bot.commands.get(bot.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase())
        if (!command) return await missingArgument(message, e.err, `${this.config.name} ${e.usage}`, this.config.examples);
        if (data.disabled && !data.disabled.includes(command.config.name)) return error(message, e.all);
        data.disabled.splice(data.disabled.indexOf(command.config.name), 1)
        await data.save()
        message.react(AGREE)
    }
};