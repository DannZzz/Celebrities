const ids = ['382906068319076372']
const {error, embed, perms} = require("../../functions/functions");
const letters = require('../../JSON/letters.js');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "react",
    dev: true
  },
  run: async (bot, message, args) => {
    message.delete()
    const m = await message.channel.messages.fetch(args[0]);
    letters.forEach(a=> m.react(a))
      
     
    
  }
}