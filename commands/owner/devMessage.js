const profileModel = require("../../models/profileSchema");
const {MessageEmbed} = require("discord.js");
const {greenlight, redlight} = require('../../JSON/colours.json');
const { COIN, AGREE, DISAGREE } = require('../../config');
let ownerID = '382906068319076372';
const {error, embed, perms} = require("../../functions/functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "devmessage",
    dev: true
  },
  run: async (bot, message, args) => {
    
       
    if (!args[0]) return error(message, "Укажите участника.");

    let user = bot.users.cache.get(args[0]);
    if (!user) {
      return error(message, "Участник не найден.");
    }

    if(!args[1]) return error(message, "Сообщение?")
    message.react(`${AGREE}`)
    let msg = user.send({embeds: [embed(message, `New Message!👀**\n\n||**${args.slice(1).join(" ")}||`, "dm")]}).catch(()=> message.react(DISAGREE))



  }
}
