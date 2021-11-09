const {server, serverFind} = require("../../functions/models");
const {error, embed, perms, missingArgument} = require("../../functions/functions");
const {AGREE} = require("../../config")

module.exports = {
    config: {
        name: "disable",
        aliases: ["отключить"],
        category: "f_settings",
        permissions: ["ADMINISTRATOR"],
        examples: ["disable user"]
    },
    run: async function (bot, message, args) {
        const data = await serverFind(message.guild.id);
        const {disable: d, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${data.lang}`);   
        
        if (!args[0]) return await missingArgument(message, d.no, `${this.config.name} ${d.usage}`, this.config.examples);
        let command = bot.commands.get(bot.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase())
        if (!command) return await missingArgument(message, d.err, `${this.config.name} ${d.usage}`, this.config.examples);
        if (data.disabled && data.disabled.includes(command.config.name)) return error(message, d.all);
        data.disabled.push(command.config.name)
        await data.save()
        message.react(AGREE)
    }
};