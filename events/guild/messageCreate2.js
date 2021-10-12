const { PREFIX, DISAGREE, STAR, devID, adminID } = require('../../config');
const { MessageEmbed, Collection } = require('discord.js')
const profileModel = require("../../models/profileSchema");
const serverModel = require("../../models/serverSchema");
const memberModel = require("../../models/memberSchema");
const begModel = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const vipModel = require("../../models/vipSchema");
const customModel = require("../../models/customSchema");
const {error, embed, makeTimestamp} = require("../../functions/functions");
const {main, none, reddark} = require('../../JSON/colours.json');
const { RateLimiter } = require('discord.js-rate-limiter');
let msgLimiter = new RateLimiter(1, 2000);
const Rate = require("../../functions/rateClass.js");
const powerData = require("../../JSON/powers.json");
const {bans, bansFind, powerFind, rpgFind, powersFind, powers} = require("../../functions/models");

module.exports = async (bot, messageCreate) => {
  try {
  let message = messageCreate;
  if (message.author.bot) return

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

  
    
  
    try {
      const one = msgLimiter.take(message.author.id);
  if (!one && !dattt) {
    await memberModel.updateOne({userID: message.author.id, serverID: message.guild.id}, {$inc: {messages: 1}})

    try {
      await rpg.updateOne({userID: message.author.id}, {$inc: {spendTask: 1}});
      let getUser = await rpg.findOne({userID: message.author.id});
      if (getUser.spendTask >= getUser.tasks[0].goal && getUser.tasks[0].status === false) {
        await rpg.updateOne({userID: message.author.id}, {$inc: {task1: 1}});
        getUser = await rpg.findOne({userID: message.author.id});
        const ques = 3000;
        const rew = 10000;
        const task1 = getUser.task1 || 1;
        const taskData = {
          idName: "spendStars",
          EN: `Make ${ques * task1} messages.`,
          RU: `Написать ${ques * task1} сообщений.`,
          goal: ques * task1,
          status: false,
          doneEN: `You successfully did the task, your reward - ${rew * task1} ` + STAR,
          doneRU: `Вы успешно выполнили задание, ваша награда - ${rew * task1} ` + STAR,
          reward: rew * task1,
      } 
    
     
        await rpg.updateOne({userID: message.author.id}, {$set: {spendTask: 0}});
        await rpg.updateOne({userID: message.author.id}, {$set: {["tasks.0"]: taskData}});
        await begModel.updateOne({userID: message.author.id}, {$inc: {stars: taskData.reward-rew}})
        embed(message, LANG.lang === "ru" ? getUser.tasks[0].doneRU : getUser.tasks[0].doneEN, false)
      }
  
      if (getUser.openedPacks >= getUser.tasks[1].goal && getUser.tasks[1].status === false) {
        await rpg.updateOne({userID: message.author.id}, {$inc: {task2: 1}});
        getUser = await rpg.findOne({userID: message.author.id});
        const ques = 2;
        const rew = 2000;
        const task1 = getUser.task2 || 1;
        const taskData = {
          idName: "spendStars",
          EN: `Use ${ques * task1} Egyptian packs.`,
          RU: `Открой ${ques * task1} Египетских паков.`,
          goal: ques * task1,
          status: false,
          doneEN: `You successfully did the task, your reward - ${rew * task1} ` + STAR,
          doneRU: `Вы успешно выполнили задание, ваша награда - ${rew * task1} ` + STAR,
          reward: rew * task1,
      } 
    
     
        await rpg.updateOne({userID: message.author.id}, {$set: {openedPacks: 0}});
        await rpg.updateOne({userID: message.author.id}, {$set: {["tasks.1"]: taskData}});
        await begModel.updateOne({userID: message.author.id}, {$inc: {stars: taskData.reward-rew}})
        embed(message, LANG.lang === "ru" ? getUser.tasks[1].doneRU : getUser.tasks[1].doneEN, false)
      }
    } catch {
      console.log("error")
    }
  }
} catch (e) {
  console.log(e);
}  
    } catch (e) {
        console.log(e);
    }

}
