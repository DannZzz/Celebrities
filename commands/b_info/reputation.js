const { MessageEmbed, MessageAttachment, MessageButton, MessageActionRow } = require('discord.js');
const { main, none } = require("../../JSON/colours.json");
const { profile, profileFind, serverFind, bagFind, server: serVer } = require("../../functions/models");
const {error, embed, perms} = require("../../functions/functions");
const Levels = require("discord-xp");
Levels.setURL(process.env.MONGO);


module.exports = {
  config: {
    name: 'reputation',
    aliases: ["rep", "репутация", 'реп'],
    category: 'b_info'
  },
  run: async (bot, message, args, ops) => {

    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {reputation: rep, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   
   
    
    const asd = await profileFind(message.author.id)
    const bag = await bagFind(message.author.id)
    const author = asd.rep
    let timeout;
    if (bag["vip2"] === true) { timeout = 43200 * 1000; } else {
      timeout = 86400 * 1000;
    }
    if (author !== null && timeout - (Date.now() - author) > 0) {
        let time = new Date(timeout - (Date.now() - author));

        return error(message, rep.time(time));
    }
    await profile.updateOne({userID: message.author.id}, {$set: {rep: Date.now()}});
    await serVer.updateOne({serverID: message.guild.id}, {$inc: {rep: 1}});
    embed(message, rep.done)
  }
}