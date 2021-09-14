const { MessageEmbed, MessageAttachment, MessageButton, MessageActionRow } = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR } = require('../../config');
const serverModel = require("../../models/serverSchema");
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const {error, pagination, embed} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);
const Levels = require("discord-xp");
Levels.setURL(process.env.MONGO);


module.exports = {
  config: {
    name: 'reputation',
    aliases: ["rep", "репутация", 'реп'],
    category: 'b_info'
  },
  run: async (bot, message, args, ops) => {
    let limited = rateLimiter.take(message.author.id)
    if(limited) return

    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {reputation: rep, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   
   
    
    const asd = await pd.findOne({userID: message.author.id})
    const bag = await bd.findOne({userID: message.author.id})
    const author = asd.rep
    let timeout;
    if (bag["vip2"] === true) { timeout = 43200 * 1000; } else {
      timeout = 86400 * 1000;
    }
    if (author !== null && timeout - (Date.now() - author) > 0) {
        let time = new Date(timeout - (Date.now() - author));

        return error(message, rep.time(time));
    }
    await pd.updateOne({userID: message.author.id}, {$set: {rep: Date.now()}});
    await serverModel.updateOne({serverID: message.guild.id}, {$inc: {rep: 1}});
    embed(message, rep.done)
  }
}