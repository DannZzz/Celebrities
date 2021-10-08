const { PREFIX, DISAGREE, STAR, devID, adminID } = require('../../config');
const { MessageEmbed, Collection } = require('discord.js')
const profileModel = require("../../models/profileSchema");
const serverModel = require("../../models/serverSchema");
const memberModel = require("../../models/memberSchema");
const begModel = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const vipModel = require("../../models/vipSchema");
const customModel = require("../../models/customSchema");
const queue2 = new Map();
const queue3 = new Map();
const queue = new Map();
const games = new Map();
const buying = new Map();
const cards = new Map();
const {error, embed} = require("../../functions/functions");
const {main, none, reddark} = require('../../JSON/colours.json');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 2000);
let msgLimiter = new RateLimiter(1, 2000);
const Rate = require("../../functions/rateClass.js");

const buy2 = new Map();

const cooldowns = new Map();

module.exports = async (bot, messageCreate) => {
  let message = messageCreate;
  if (message.author.bot) return
  const getLang = require("../../models/serverSchema");
  const LANG = await getLang.findOne({serverID: message.guild.id});
  const {afkMess, perm, cooldown: cd, banned} = require(`../../languages/${LANG.lang}`); 
  
  let afkMember = message.mentions.members;
  if (afkMember && afkMember.length !== 0) {
    afkMember.forEach(async i => {
      const data = await profileModel.findOne({userID: i.id})
      if (data && data.afkMessage && !message.author.bot) {
        const emb = new MessageEmbed()
        .setColor(none)
        .setDescription(afkMess(i.user.tag, data.afkMessage))
        message.channel.send({embeds: [emb]}).then((m) => setTimeout(() => m.delete(), 10000))
      }
    })
  }

  
    
  const dattt = await profileModel.findOne({userID: message.author.id});
  if (dattt.disabled && (!devID.includes(message.author.id) && !adminID.includes(message.author.id))) return error(message, banned);
    try {
      const one = msgLimiter.take(message.author.id);
  if (!one && !dattt.disabled) {
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
 

        if (message.author.bot || message.channel.type === "DM") return;

        let prefix;
        serverData = await serverModel.findOne({ serverID: message.guild.id });
        if(!serverData) {
          let server = await serverModel.create({
            serverID: message.guild.id,
            lang: "en"
          })
        server.save()}

        prefix = serverData.prefix;

        let args = message.content.slice(prefix.length).trim().split(/ +/g);
        let cmd = args.shift().toLowerCase();
      
        if (!message.content.startsWith(prefix)) return;
        

       
        
        let ops = {
            queue2: queue2,
            queue: queue,
            queue3: queue3,
            games: games,
            buying: buying,
            cards: cards,
            buy2: buy2
        }
        let ss = new MessageEmbed().setColor("#2f3136").setTimestamp()
        const imunCmd = ["enable", "disable", "channel-enable", "channel-disable"]
        var commandfile = bot.commands.get(cmd) || bot.commands.get(bot.aliases.get(cmd))
        
      
        if (
          (commandfile && 
          !serverData.disabledChannels.includes(message.channel.id) && 
          !serverData.disabled.includes(commandfile.config.name)) || 
          (commandfile && imunCmd.includes(commandfile.config.name))
          ) {
            const EMB = new MessageEmbed()
            .setColor(reddark)

            const getCardCooldown = ops.cards.get(message.author.id);
            if(getCardCooldown) return message.reply({embeds: [EMB.setDescription(LANG.lang === "en" ? "Wait a while for the transaction to complete." : "Подождите некоторое время, пока транзакция закончится.")]}).then(msg => setTimeout(() => msg.delete(), 10000))

            const getCardCooldown2 = ops.cards.get(message.author.id);
            if(getCardCooldown2) return;

            
            var command = commandfile.config;
            
            if (!message.member.permissions.has(command.permissions || [])) return error(message, perm)
            
            if(!cooldowns.has(command.name)) {
              cooldowns.set(command.name, new Collection());
            }
            
            const currentTime = Date.now();
            const time_stamps = cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown || 3) * 1000;

            if (time_stamps.has(message.author.id)) {
              const expire = time_stamps.get(message.author.id) + cooldownAmount;

              if (currentTime < expire) {
                const time = (expire - currentTime) / 1000;

                return message.reply({embeds: [EMB.setDescription(cd(time.toFixed(1), command.name))]}).then(msg => setTimeout(() => msg.delete(), 10000))
              }
            }

            time_stamps.set(message.author.id, currentTime);
            setTimeout(() => time_stamps.delete(message.author.id), cooldownAmount);
            
            commandfile.run(bot, message, args, ops)
          }//.catch(()=> message.react("❌"))}
        else if (!serverData.disabledChannels.includes(message.channel.id)) {await customModel.findOne({serverID: message.guild.id, command: cmd}, async(err, data) =>{
        if(err) throw error
        if(data) return message.channel.send({embeds: [ss.setDescription(data.content)]}).catch(()=> message.react("❌"));
        else return
        }
        )}
    } catch (e) {
        console.log(e);
    }
}
