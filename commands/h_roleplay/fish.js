const fishes = require('../../JSON/fishes.json');
const { MessageEmbed } = require('discord.js');
const profileModel = require("../../models/profileSchema");
const begModel = require("../../models/begSchema");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);
const {error, embed} = require('../../functions');
const {
    greenlight,
    redlight,
    cyan
  } = require('../../JSON/colours.json');

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = {
    config: {
        name: 'fish',
        aliases: ['catch-fish'],
        category: 'h_roleplay'
    },
    run: async (bot, message, args) => {
      let limited = rateLimiter.take(message.author.id)
      if(limited) return

      const getLang = require("../../models/serverSchema");
      const LANG = await getLang.findOne({serverID: message.guild.id});
      const {fish: f, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   
   
      
        let user = message.author;
        let profileData = await profileModel.findOne({ userID: user.id });

        let beg = await begModel.findOne({userID: user.id});

        if (!args[0]) {


            const fishID = Math.floor(Math.random() * 10) + 1;
            let rarity;
            if (fishID < 5) rarity = 'junk';
            else if (fishID < 8) rarity = 'common';
            else if (fishID < 9) rarity = 'uncommon';
            else if (fishID < 10) rarity = 'rare';
            else rarity = 'legendary';
            const fishh = fishes[rarity];
            const worth = randomRange(fishh.min, fishh.max);

            let timeout;
            if (beg["vip2"] === true) { timeout = 90 * 1000; } else {
              timeout = 180 * 1000;
            }
            let fishtime = profileData.fish;

            if (fishtime !== null && timeout - (Date.now() - fishtime) > 0) {
                let time = await new Date(timeout - (Date.now() - fishtime));

                return error(message, f.time(time));
            }
            await profileModel.findOneAndUpdate({userID: user.id}, {$set: {fish: Date.now()}})

            embed(message, f.done(fishh.symbol), false);
            if (rarity === "junk") await begModel.findOneAndUpdate({userID: user.id},{$inc: {junk: 1}})
            else if (rarity === "common") await begModel.findOneAndUpdate({userID: user.id},{$inc: {common: 1}})
            else if (rarity === "uncommon") await begModel.findOneAndUpdate({userID: user.id},{$inc: {uncommon: 1}})
            else if (rarity === "rare") await begModel.findOneAndUpdate({userID: user.id},{$inc: {rare: 1}})
            else if (rarity === "legendary") await begModel.findOneAndUpdate({userID: user.id},{$inc: {legendary: 1}})

            await profileModel.findOneAndUpdate({userID: user.id}, {$set: {fish: Date.now()}})


        }
        if (args[0] === 'list') {

            let lEmbed = new MessageEmbed()
                .setColor(cyan)
                .setTimestamp()
                .setTitle(f.title)
                .setDescription(f.list())
                .setFooter(message.guild.name, message.guild.iconURL())
            return message.channel.send({embeds: [lEmbed]});
        }
    }
}
