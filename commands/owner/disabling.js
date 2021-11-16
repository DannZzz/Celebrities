const begModel = require("../../models/begSchema");
const {MessageEmbed} = require("discord.js");
const {main} = require('../../JSON/colours.json');
const { COIN, AGREE, STAR, DISAGREE, devID, adminID } = require('../../config');
const {error, embed, perms} = require("../../functions/functions");
const {bans, bansFind} = require("../../functions/models");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);
const ms = require("ms")

module.exports = {
  config: {
    name: "account",
    admin: true
  },
  run: async (bot, message, args) => {
    
       
    if (!args[0]) return error(message, "Укажите участника.");
    
    let user = bot.users.cache.get(args[0]);
    let prof;
    try {
      prof = await bansFind(user.id);
    } catch {
      return error(message, "Данные не найдены.");
    }

    
    const emb = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
    .setColor(main)
    .setTimestamp()
    
    if (!prof) {
      if (!args[1] || isNaN(ms(args[1]))) return error(message, "Укажите время.");
      const time = new Date(Date.now() + ms(args[1]));
      const newBan = await bans.create({
        userID: user.id,
        date: time
      });
      await newBan.save();
      return embed(message, "Аккаунт заблокан.");
    } else {
      await prof.delete();
      return embed(message, "Аккаунт разблокан.");
    }
    
    
    

  }
}
