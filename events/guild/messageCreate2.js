const { PREFIX, DISAGREE, STAR, devID, adminID } = require('../../config');
const { MessageEmbed, Collection } = require('discord.js')
const profileModel = require("../../models/profileSchema");
const serverModel = require("../../models/serverSchema");
const memberModel = require("../../models/memberSchema");
const begModel = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const vipModel = require("../../models/vipSchema");
const {error, embed, makeTimestamp} = require("../../functions/functions");
const {main, none, reddark} = require('../../JSON/colours.json');
const { RateLimiter } = require('discord.js-rate-limiter');
let msgLimiter = new RateLimiter(1, 2000);
const Rate = require("../../functions/rateClass.js");
const powerData = require("../../JSON/powers.json");
const {bans, bansFind, powerFind, rpgFind, powersFind, powers, lfFind, mail, mailFind} = require("../../functions/models");

module.exports = async (bot, message) => {
  try {
  if (message.author.bot) return
  const user = message.author;

  const pp = await powersFind(message.author.id);
  if (!pp) {
    const nn = await powers.create({
      userID: message.author.id
    })
    nn.save();
  }
  
  const getLang = require("../../models/serverSchema");
  const power = await powerFind(message.author.id);
  if (power) {
    if (power.date < new Date() ) {
      let data = await powersFind(message.author.id);
      if (!data) {
        const newData = await powers.create({
          userID: message.author.id
        })
        newData.save();
      }

      await powers.updateOne({userID: message.author.id}, {$inc: {
        [`${power.name}.value`]: power.value,
        [`${power.name}.level`]: 1
      }})

     
      power.delete();
    }
  }

  let lfData = await lfFind(user.id);
  if (lfData) {
    if (lfData.date < new Date()) {
      let data = await mailFind(user.id);
      if (!data) {
          const newData = await mail.create({
              userID: user.id
          });
          await newData.save();
      }
      data = await mailFind(user.id);

      await mail.updateOne({userID: user.id}, {$inc: {[`${lfData.locationId}`]: 1}});
      lfData.delete();
    }
  }
  
  const LANG = await getLang.findOne({serverID: message.guild.id});
  const {afkMess, perm, cooldown: cd, banned} = require(`../../languages/${LANG.lang}`); 
  const dattt = await bansFind(message.author.id);
  if (dattt) {
    if (dattt.date < new Date()) dattt.delete();
  }
  let afkMember = message.mentions.members;
  if (afkMember && afkMember.length !== 0) {
    afkMember.forEach(async i => {
      const data = await profileModel.findOne({userID: i.id})
      const dat = await profileModel.findOne({userID: i.id});
      if (data && data.afkMessage && !message.author.bot && !dat.disabled) {
        const emb = new MessageEmbed()
        .setColor(none)
        .setDescription(afkMess(i.user.tag, data.afkMessage))
        message.channel.send({embeds: [emb]}).then((m) => setTimeout(() => m.delete(), 10000))
      }
    })
  }

  
    
  
   
      const one = msgLimiter.take(message.author.id);
  if (!one && !dattt) {
    await memberModel.updateOne({userID: message.author.id, serverID: message.guild.id}, {$inc: {messages: 1}})
  }
  
    } catch (e) {
        console.log(e);
    }

}
