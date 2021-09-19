const {server, serverFind} = require("../../functions/models");
const {error, embed, perms} = require("../../functions/functions");
const {AGREE} = require("../../config")

module.exports = {
    config: {
        name: "channel-enable",
        aliases: ["канал-включить"],
        category: "f_settings"
    },
    run: async (bot, message, args) => {
        const data = await serverFind(message.guild.id);
        const {"channel-enable": ce, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${data.lang}`);   
        
        if(!perms(message, "ADMINISTRATOR")) return error(message, perm);
        if (!args[0]) return error(message, ce.no);
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel || channel.type !== "GUILD_TEXT") return error(message, ce.err);
        if (data.disabledChannels && !data.disabledChannels.includes(channel.id)) return error(message, ce.all);
        data.disabledChannels.splice(data.disabled.indexOf(channel.id), 1)
        await data.save()
        message.react(AGREE)
    }
};