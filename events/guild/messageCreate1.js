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
const trial = new Map();
const explore = new Map();
const using = new Map();
const {error, embed, makeTimestamp} = require("../../functions/functions");
const {main, none, reddark} = require('../../JSON/colours.json');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 2000);
let msgLimiter = new RateLimiter(1, 2000);
const Rate = require("../../functions/rateClass.js");
const {bans, bansFind} = require("../../functions/models");
const buy2 = new Map();

const cooldowns = new Map();

module.exports = async (bot, messageCreate) => {
  try {
  let message = messageCreate;
  if (message.author.bot) return
  const getLang = require("../../models/serverSchema");
  const LANG = await getLang.findOne({serverID: message.guild.id});
  const {afkMess, perm, cooldown: cd, banned} = require(`../../languages/${LANG.lang}`); 
  const dattt = await bansFind(message.author.id);
  if (dattt) {
    if (dattt.date < new Date()) dattt.delete();
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
      buy2: buy2,
      trial: trial,
      explore: explore,
      using
  }
  let ss = new MessageEmbed().setColor("#2f3136").setTimestamp()
  const imunCmd = ["enable", "disable", "channel-enable", "channel-disable", "message"]
  var commandfile = bot.commands.get(cmd) || bot.commands.get(bot.aliases.get(cmd))
  
      
  if (
    (commandfile && 
    !serverData.disabledChannels.includes(message.channel.id) && 
    !serverData.disabled.includes(commandfile.config.name)) || 
    (commandfile && imunCmd.includes(commandfile.config.name))
    ) {
      const nowExplore = ops.explore.get(message.author.id);
      if (nowExplore) return;
      
      let dateNew = await bansFind(message.author.id);
      if (dateNew && !devID.includes(message.author.id)) return error(message, banned + ` <t:${makeTimestamp(dateNew.date.getTime())}:f>`);
      //  && (!devID.includes(message.author.id) && !adminID.includes(message.author.id)
      const EMB = new MessageEmbed()
      .setColor(reddark)

      const getTrial = ops.trial.get(message.author.id);
      if (getTrial) return message.reply({embeds: [EMB.setDescription(LANG.lang === "en" ? "To first end the trial." : "Сначала закончите испытание.")]}).then(msg => setTimeout(() => msg.delete(), 10000))
      
      const getCardCooldown = ops.cards.get(message.author.id);
      if(getCardCooldown && (["battle", "slot", "upgrade", "clan", "buy", "gift", "take", "close", "gcard", "send"].includes(commandfile.config.name))) return message.reply({embeds: [EMB.setDescription(LANG.lang === "en" ? "Wait a while for the transaction to complete." : "Подождите некоторое время, пока транзакция закончится.")]}).then(msg => setTimeout(() => msg.delete(), 10000))

      const getCardCooldown2 = ops.cards.get(message.author.id);
      if(getCardCooldown2 && (["battle", "slot", "upgrade", "clan", "buy", "gift", "take", "close", "gcard", "send"].includes(commandfile.config.name))) return;

      
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
  if(err) throw Error();
  if(data) return message.channel.send({embeds: [ss.setDescription(data.content)]}).catch(()=> message.react("❌"));
  else return
  }
  )}
  } catch (e) {
        console.log(e);
  
  }
  
}
