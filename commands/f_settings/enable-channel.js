const {server, serverFind} = require("../../functions/models");
const {error, embed, perms, missingArgument} = require("../../functions/functions");
const {AGREE} = require("../../config")

module.exports = {
    config: {
        name: "channel-enable",
        aliases: ["канал-включить"],
        category: "f_settings",
        permissions: ["ADMINISTRATOR"],
        examples: ["channel-enable #chat", "channel-enable 731058351231991868"]
    },
    run: async function (bot, message, args) {
        const data = await serverFind(message.guild.id);
        const {"channel-enable": ce, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${data.lang}`);   
        
        if (!args[0]) return await missingArgument(message, ce.no, `${this.config.name} ${ce.usage}`, this.config.examples);
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel || channel.type !== "GUILD_TEXT") return await missingArgument(message, ce.err, `${this.config.name} ${ce.usage}`, this.config.examples);
        if (data.disabledChannels && !data.disabledChannels.includes(channel.id)) return error(message, ce.all);
        data.disabledChannels.splice(data.disabled.indexOf(channel.id), 1)
        await data.save()
        message.react(AGREE)
    }
};