const {MessageEmbed} = require("discord.js")
const {error, embed} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const {isWebUri} = require('valid-url');
const {cyan} = require('../../JSON/colours.json');

module.exports = {
      config: {
        name: "афк",
        description: "Войти в режим AFK.",
        usage: "[сообщение]",
        category: "e_fun",
        accessableby: "",
        aliases: ["afk"]
    },
    run: async (bot, message, args) => {
        let limited = rateLimiter.take(message.author.id);
        if(limited) return;
        const emb = new MessageEmbed()
        .setColor(cyan)

        const data = await pd.findOne({userID: message.author.id});
        const bag = await bd.findOne({userID: message.author.id});
        
        if (!bag["vip1"]) return error(message, "Команда доступна только для __VIP 1__ пользователей.")
        
        if (!data.afkMessage && args[0]) {
            if (args.join(" ").split("").length > 100) return error(message, "Максимальное количество текста __100__ символов!");
            const getUrl = args.filter(i => isWebUri(i))
            if (getUrl.length !== 0) return error(message, "Сообщение не может быть ссылкой.");
            await pd.updateOne({userID: message.author.id}, {$set: {afkMessage: args.join(" ")}});
            return message.reply({embeds: [emb.setTitle('Вы вошли в режим AFK').setThumbnail(message.author.displayAvatarURL({dynamic: true})).setDescription(`Причина: **${args.join(" ")}**`)]});
        }
        
        if (data.afkMessage && !args[0]) {
            await pd.updateOne({userID: message.author.id}, {$set: {afkMessage: null}});
            return message.reply({embeds: [emb.setTitle('Вы вышли из режима AFK').setThumbnail(message.author.displayAvatarURL({dynamic: true}))]});
        }

        if (data.afkMessage && args[0]) {
            if (args.join(" ").split("").length > 100) return error(message, "Максимальное кол-во 100 символов!");
            const getUrl = args.filter(i => isWebUri(i))
            if (getUrl.length !== 0) return error(message, "Сообщение не может быть ссылкой.");
            await pd.updateOne({userID: message.author.id}, {$set: {afkMessage: args.join(" ")}});
            return message.reply({embeds: [emb.setTitle('Вы вошли в режим AFK').setThumbnail(message.author.displayAvatarURL({dynamic: true})).setDescription(`Причина: **${args.join(" ")}**`)]});
  
        }

        if (!data.afkMessage && !args[0]) return error(message, "Укажите причину чтобы войти в режим AFK.")
    }
}