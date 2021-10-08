const begModel = require("../../models/begSchema");
const {MessageEmbed} = require("discord.js");
const {main} = require('../../JSON/colours.json');
const { COIN, AGREE, STAR, DISAGREE, devID, adminID } = require('../../config');
const {error, embed, perms} = require("../../functions/functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "addstars",
    description: "",
    category: "",
    aliases: "",
    accessableby: "Для разработчика.",
    usage: "[ID] [кол-во монет] "
  },
  run: async (bot, message, args) => {
    
       
     if(!devID.includes(message.author.id) && !adminID.includes(message.author.id)) return
    if (!args[0]) return error(message, "Укажите участника.");

    let user = bot.users.cache.get(args[0]);
    try {
      let begData = await begModel.findOne({ userID: user.id });
    } catch {
      return error(message, "Данные не найдены.");
    }

    let toGuild = bot.guilds.cache.get('731032795509686332');
    let toChannel = toGuild.channels.cache.get('880733129491513395');

    const emb = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
    .setColor(main)
    .setTimestamp()
    
    if(!args[1]) return error(message, "Укажите кол-во монет, чтобы добавить.");
    if(isNaN(args[1])) return error(message, "Укажите кол-во монет в виде, чтобы добавить.");
    if(args[1] > 1000000000) return error(message, "Укажите число меньше **1.000.000.000**.");
    if(args[1] < 10) return error(message, "Укажите число больше **10**.");

    await begModel.findOneAndUpdate({userID: user.id}, {$inc: {stars: Math.floor(args[1])}})
    await toChannel.send({embeds: [emb.setDescription(
      `
      **Разработчик: **\`${message.author.tag}(${message.author.id})\`\n**Из сервера: **\`${message.guild.name}(${message.guild.id})\`\n\n**Кому:** \`${user.tag}(${user.id})\`\n**Кол-во звёзд:** __${Math.floor(args[1])}__
      `
    )]})
    message.react(`${AGREE}`)
    let msg = user.send({embeds: [embed(message, `**New Gift!🎉**\n\n||${Math.floor(args[1])} ${STAR}||`, "dm")]}).catch(()=> message.react(DISAGREE))



  }
}
