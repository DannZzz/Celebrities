
const { STAR, box } = require('../../config');
const profileModel = require("../../models/profileSchema");
const begModel = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);
const {error, embed} = require('../../functions');

module.exports = {
    config: {
        name: "daily",
        aliases: ["day", 'ежедн'],
        category: "h_roleplay",
    },
    run: async (bot, message, args) => {
      let limited = rateLimiter.take(message.author.id)
      if(limited) return
        let user = message.member;

        const getLang = require("../../models/serverSchema");
        const LANG = await getLang.findOne({serverID: message.guild.id});
        const {daily: d, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   
   

        let amount = 1000;

        let profileData = await profileModel.findOne({ userID: user.id });
        let beg = await begModel.findOne({ userID: user.id })
        let daily = await profileData.daily;
        let timeout;
        if (beg["vip2"] === true) { timeout = 43200 * 1000; } else {
          timeout = 86400 * 1000;
        }


        if (daily !== null && timeout - (Date.now() - daily) > 0) {
            let time = new Date(timeout - (Date.now() - daily));

            error(message, d.time(time));
        } else {
            await profileModel.findOneAndUpdate({userID: user.id}, {$set: {daily: Date.now()}})

            embed(message, `${d.done} ${STAR} ${and} 1 ${box}`)
            await begModel.findOneAndUpdate({userID: user.id},{$inc: {stars: 10}})
            await rpg.findOneAndUpdate({userID: user.id}, {$inc: {box: 1}})
        }
    }
}
