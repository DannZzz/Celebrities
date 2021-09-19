const { STAR, AGREE } = require('../../config');
const bd = require("../../models/begSchema");
const pd = require("../../models/profileSchema");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);
const {error, embed} = require("../../functions/functions");

module.exports = {
  config: {
    name: "gift",
    category: "h_roleplay",
    aliases: ["present", 'подарок'],
  },
  run: async (bot, message, args, ops) => {
    let limited = rateLimiter.take(message.author.id)
    if(limited) return
    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {gift: g, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   
   
    let a = Math.round(Math.random() * 6) + 1
    ops.queue.set(message.author.id, {name: "pay"})

    if (!args[0]) return error(message, specify); ops.queue.delete(message.author.id);
    const user2 = message.member;
    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
    if (user.user.id === user2.id) return error(message, g.error1); ops.queue.delete(message.author.id);
    if (!user) return error(message, notUser); ops.queue.delete(message.author.id);
    if(!args[1]) return error(message, g.error2); ops.queue.delete(message.author.id);
    const data = await pd.findOne({userID: user2.id})
    const data1 = await pd.findOne({userID: user.id})
    if (!data.marryID) return error(message, g.error3); ops.queue.delete(message.author.id);
    if(!data1.marryID || data.marryID !== data1.marryID) return error(message, g.error4); ops.queue.delete(message.author.id);
    
    const bag = await bd.findOne({userID: user2.id})
    let value = Math.floor(args[1])
    if (!bag["vip1"] && value > 50) {
        return error(message, g.vip1);
      } else if (!bag["vip2"] && value > 150) {
        return error(message, g.vip2);
      } else if (bag["vip2"] && value > 500) {
        return error(message, g.vipError);
      }
    let author = data.gift;
    let timeout;
    if (bag["vip2"] === true) { timeout = 43200 * 1000; } else {
      timeout = 86400 * 1000;
    }
    if (author !== null && timeout - (Date.now() - author) > 0) {
        let time = new Date(timeout - (Date.now() - author));

        return error(message,g.time(time));
    } 
    if(isNaN(args[1])) return error(message, g.error2); ops.queue.delete(message.author.id);

    let msg = await message.channel.send(`<a:dannloading:876008681479749662> ${g.doing}`)
    
    setTimeout(async function(){//
      try {
        await msg.delete()
      
       let profileDataAuthor = await bd.findOne({userID: user2.id});

       let memberMoney = profileDataAuthor.stars
       if(memberMoney <= 0 || memberMoney < args[1]) return error(message, noStar); ops.queue.delete(message.author.id);
       if(10 > args[1]) return error(message, g.min); ops.queue.delete(message.author.id);
       
        if(memberMoney <= 0 || memberMoney < args[1]) return
        
        await bd.updateOne({userID: user.id}, {$inc: {stars: Math.floor(args[1])}});
        await bd.updateOne({userID: user2.id}, {$inc: {stars: -Math.floor(args[1])}});
        await pd.updateOne({userID: user2.id}, {$set: {gift: Date.now(  )}});
        message.react(AGREE)

        return ops.queue.delete(message.author.id)
  
      } catch (e) {
       console.log(e);
      }
    }, a * 1000)

  }
}