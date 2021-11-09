const {server, serverFind} = require("../../functions/models");
const {error, embed, perms, missingArgument} = require("../../functions/functions");
const {AGREE} = require("../../config")

module.exports = {
    config: {
        name: "channel-disable",
        aliases: ["канал-отключить"],
        category: "f_settings",
        permissions: ["ADMINISTRATOR"],
        examples: ["channel-disable #chat", "channel-disable 731058351231991868"]
    },
    run: async function (bot, message, args) {
        const data = await serverFind(message.guild.id);
        const {"channel-disable": cd, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${data.lang}`);   
        
        if (!args[0]) return await missingArgument(message, cd.no, `${this.config.name} ${cd.usage}`, this.config.examples);
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel || channel.type !== "GUILD_TEXT") return await missingArgument(message, cd.err, `${this.config.name} ${cd.usage}`, this.config.examples);
        if (data.disabledChannels && data.disabledChannels.includes(channel.id)) return error(message, cd.all);
        data.disabledChannels.push(channel.id)
        await data.save()
        message.react(AGREE)
    }
};