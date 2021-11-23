const begModel = require("../../models/begSchema");
const { MessageEmbed } = require('discord.js');
const {greenlight, redlight, main} = require('../../JSON/colours.json');
const { COIN, BANK, STAR } = require('../../config');
const profileModel = require("../../models/profileSchema");
const vipModel = require("../../models/vipSchema");
const {error, embed, perms} = require("../../functions/functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);
const Enc = require("../../functions/encryptionClass");

module.exports = {
  config: {
    name: "bio",
    category: "g_vip",
    aliases: ['био']
  },
  run: async (bot, message, args) => {
    
      const getLang = require("../../models/serverSchema");
      const LANG = await getLang.findOne({serverID: message.guild.id});
      const {bio: b, specify, specifyT, vipOne, vipTwo, maxLimit, perm} = require(`../../languages/${LANG.lang}`);   
    
    let bag = await begModel.findOne({userID: message.author.id});


    if(bag['vip1'] === false) return error(message, vipOne);
    let getLimit = args.join(" ").split("")
    if(getLimit.length > 150) return error(message, maxLimit(150))
    let arg = args.slice(" ").join(" ")
    if(!args[0]) return error(message, specifyT);

    embed(message, b.done);
    await vipModel.findOneAndUpdate({userID: message.author.id}, {$set: {profileBio: Enc.encrypt(arg)}})

  }
}
