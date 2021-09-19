const ids = ['382906068319076372']
const {error, embed, perms} = require("../../functions/functions");
const letters = require('../../JSON/letters.json');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "boz",
    description: "",
    category: "",
    aliases: "",
    accessableby: "Для разработчика.",
    usage: "[ID] [кол-во монет] "
  },
  run: async (bot, message, args) => {
      message.delete()
    
       
     if(!ids.includes(message.author.id)) return
     const m = await message.channel.messages.fetch(args[0]);
     letters.forEach(a=> m.react(a))
      
     
    
  }
}