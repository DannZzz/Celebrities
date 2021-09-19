const begModel = require("../../models/begSchema");
const { MessageEmbed } = require('discord.js');
const {greenlight, redlight, main} = require('../../JSON/colours.json');
const { COIN, BANK, STAR } = require('../../config');
const profileModel = require("../../models/profileSchema");
const vipModel = require("../../models/vipSchema");
const {error, embed, perms} = require("../../functions/functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);

module.exports = {
  config: {
    name: "embed",
    category: "g_vip",
    aliases: ['эмбед'],
  },
  run: async (bot, message, args) => {
    

      const getLang = require("../../models/serverSchema");
      const LANG = await getLang.findOne({serverID: message.guild.id});
      const {embed: e, specify, specifyT, vipOne, vipTwo, maxLimit, perm} = require(`../../languages/${LANG.lang}`);   
    
    
    let bag = await begModel.findOne({userID: message.author.id});

    let channel = message.mentions.channels.first();
    if(bag["vip1"] === false) return error(message, vipOne);

    let arg = args.slice(2).join(" ")
    if (!perms(message, "ADMINISTRATOR")) return error(message, perm);
    if(!args[0]) return error(message, e.error1);
    if(!args[1]) return error(message, e.error2);
    if(!arg) return error(message, specifyT);
    if(!channel) return error(message, e.error3);
    let doEmbed = new MessageEmbed()
    .setColor(`${args[1]}`)
    .setDescription(arg)

    channel.send({embeds: [doEmbed]})


  }
}
