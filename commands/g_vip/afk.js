const {MessageEmbed} = require("discord.js")
const {error, embed} = require("../../functions/functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const {isWebUri} = require('valid-url');
const {main} = require('../../JSON/colours.json');

module.exports = {
      config: {
        name: "afk",
        category: "g_vip",
        aliases: ['афк']
    },
    run: async (bot, message, args) => {
        let limited = rateLimiter.take(message.author.id);
        if(limited) return;
        const emb = new MessageEmbed()
        .setColor(main)

        const getLang = require("../../models/serverSchema");
        const LANG = await getLang.findOne({serverID: message.guild.id});
        const {afk: a, specify, vipOne, vipTwo, maxLimit} = require(`../../languages/${LANG.lang}`);   
    
        
        const data = await pd.findOne({userID: message.author.id});
        const bag = await bd.findOne({userID: message.author.id});
        
        if (!bag["vip1"]) return error(message, vipOne)
        
        if (!data.afkMessage && args[0]) {
            if (args.join(" ").split("").length > 100) return error(message, maxLimit(100));
            const getUrl = args.filter(i => isWebUri(i))
            if (getUrl.length !== 0) return error(message, a.error);
            await pd.updateOne({userID: message.author.id}, {$set: {afkMessage: args.join(" ")}});
            return message.reply({embeds: [emb.setTitle(a.done1).setThumbnail(message.author.displayAvatarURL({dynamic: true})).setDescription(`Причина: **${args.join(" ")}**`)]});
        }
        
        if (data.afkMessage && !args[0]) {
            await pd.updateOne({userID: message.author.id}, {$set: {afkMessage: null}});
            return message.reply({embeds: [emb.setTitle(a.done2).setThumbnail(message.author.displayAvatarURL({dynamic: true}))]});
        }

        if (data.afkMessage && args[0]) {
            if (args.join(" ").split("").length > 100) return error(message, maxLimit(100));
            const getUrl = args.filter(i => isWebUri(i))
            if (getUrl.length !== 0) return error(message, a.error);
            await pd.updateOne({userID: message.author.id}, {$set: {afkMessage: args.join(" ")}});
            return message.reply({embeds: [emb.setTitle(a.done1).setThumbnail(message.author.displayAvatarURL({dynamic: true})).setDescription(`Причина: **${args.join(" ")}**`)]});
  
        }

        if (!data.afkMessage && !args[0]) return error(message, a.args)
    }
}