const begModel = require("../../models/begSchema");
const {MessageEmbed} = require("discord.js");
const {main} = require('../../JSON/colours.json');
const { COIN, AGREE, STAR, DISAGREE, devID, adminID } = require('../../config');
const {error, embed, perms} = require("../../functions/functions");
const {profileFind, profile} = require("../../functions/models");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "account",
    description: "",
    category: "",
    aliases: "",
    accessableby: "Для разработчика.",
    usage: "[ID] [кол-во монет] "
  },
  run: async (bot, message, args) => {
    
       
     if(!devID.includes(message.author.id) && !adminID.includes(message.author.id)) return;
    if (!args[0]) return error(message, "Укажите участника.");

    let user = bot.users.cache.get(args[0]);
    let prof;
    try {
      prof = await profileFind(user.id);
    } catch {
      return error(message, "Данные не найдены.");
    }

    
    const emb = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
    .setColor(main)
    .setTimestamp()
    
    if (!prof.disabled) {
      await profile.updateOne({userID: user.id}, {$set: {disabled: true}})
      return embed(message, "Аккаунт заблокан.");
    } else {
      await profile.updateOne({userID: user.id}, {$set: {disabled: false}})
      return embed(message, "Аккаунт разблокан.");
    }
    
    
    

  }
}
