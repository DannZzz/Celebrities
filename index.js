const {Client, MessageEmbed, Collection, Intents} = require('discord.js');
const voiceCollection = new Collection();
const {PREFIX} = require('./config')
const bot = new Client({restGlobalRateLimit: 50, restWsBridgeTimeout: 0, shards: "auto", restTimeOffset: 0, allowedMentions: { parse: [], repliedUser: false}, intents: [Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
const fs = require('fs');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

const { addCrystal } = require("./functions/models");
const crystalToTopOne = 50;

const MONGO = process.env.MONGO
const Canvas = require('canvas')
Canvas.registerFont(`./AlumniSans-SemiBold.ttf`, { family: "Alumni Sans"})

mongoose.connect(MONGO, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.set('useFindAndModify', false);

const serverModel = require("./models/serverSchema");
const profileModel = require("./models/profileSchema");
const memberModel = require("./models/memberSchema");
const begModel = require("./models/begSchema");
const vipModel = require("./models/vipSchema");
const rpg = require("./models/rpgSchema");
const botData = require("./models/bot");

bot.commands = new Collection();
bot.aliases = new Collection();

["aliases", "commands"].forEach(x => bot[x] = new Collection());
["command", "event"].forEach(x => require(`./handler/${x}`)(bot));

bot.categories = fs.readdirSync("./commands/");

['command'].forEach((handler) => {
  require(`./handler/${handler}`)(bot);
});

const { AutoPoster } = require('topgg-autoposter');

AutoPoster(process.env.TOPGG, bot)
  .on('posted', () => {
    console.log('Posted stats to Top.gg!')
  })

bot.on('error',function(err){});

bot.on("guildCreate", async guild => {
  let serverData = await serverModel.findOne({ serverID: guild.id });
  if(!serverData) {
    let server = await serverModel.create({
      serverID: guild.id,
      lang: "ru"
    })
  server.save()}

})



bot.on('messageCreate', async message => {
      let memberData;
      let profileData;
      let serverData;
      let begData;
      let vipData;
    try {
    let rp = await rpg.findOne({userID: message.author.id});

    if (!rp) {const asd = await rpg.create({
      userID: message.author.id
    })
    asd.save()
    }

    if (rp && !rp.itemCount) await rpg.updateOne({userID: message.author.id}, {$set: {itemCount: 1}})

    vipData = await vipModel.findOne({ userID: message.author.id });
    if (!vipData) {
    let vip = await vipModel.create({
      userID: message.author.id
    })
    vip.save()}

    memberData = await memberModel.findOne({ userID: message.author.id, serverID: message.guild.id });
    if (!memberData) {
    let member = await memberModel.create({
      userID: message.author.id,
      serverID: message.guild.id
    })
    member.save()}

    begData = await begModel.findOne({ userID: message.author.id });
    if (!begData) {
      let beg = await begModel.create({
        userID: message.author.id
      })
      beg.save()
    }

    profileData = await profileModel.findOne({ userID: message.author.id });
    if (!profileData) {
      let profile = await profileModel.create({
        userID: message.author.id
      });
      profile.save();
    }
    } catch (err) {
    console.log(err);
    }
});

bot.on('messageCreate', async message => {
  let memberData = await memberModel.findOne({ userID: message.author.id, serverID: message.guild.id });
  if (!memberData) {
  let member = await memberModel.create({
    userID: message.author.id,
    serverID: message.guild.id
  })
  member.save()}
  let prefix;
    if (message.author.bot || message.channel.type === "DM") return;
        try {
          let serverData = await serverModel.findOne({ serverID: message.guild.id });
          if(!serverData) {
            let server = await serverModel.create({
              serverID: message.guild.id,
              lang: "ru"
            })
          server.save()}

          prefix = serverData.prefix;

        } catch (e) {
            console.log(e)
    };

  if (message.author.bot) return;
  if (message.channel.type === "DM") return;
});



bot.on('messageCreate', async message => {
  let Embed = new MessageEmbed()
  .setTimestamp()
  .setColor('#00e6da')
  let prefix;
      try {
        let serverData = await serverModel.findOne({ serverID: message.guild.id });
        if(!serverData) {
          let server = await serverModel.create({
            serverID: message.guild.id,
          })
        server.save()}

        prefix = serverData.prefix;

      } catch (e) {
          console.log('error')
  };
  try {
    const getLang = require("./models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {help: h, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`./languages/${LANG.lang}`); 
    
      if (message.mentions.has(bot.user) && !message.mentions.has(message.guild.id)) {
          return message.reply(`${h.t3} \`${prefix}\``)
      }
  } catch {
      return;
      };
});

process.on('unhandledRejection', error => {
  console.log('Test error:', error);
});

setInterval(async () => {
  async function hasOneDayPassed() {
  // get today's date. eg: "7/37/2007"
  var date = new Date().toLocaleDateString("ru-RU", {timeZone: "Europe/Moscow"});
  var timeTwo = new Date().toLocaleTimeString("ru-RU", {timeZone: "Europe/Moscow"}).substring(0, 2);
  // if there's a date in localstorage and it's equal to the above: 
  // inferring a day has yet to pass since both dates are equal.
  let botTime = await botData.findOne({name: "main"})
  if (!botTime) {
    let dat = await botData.create({
      timeToNull: date
    })
    dat.save()
  }
  botTime = await botData.findOne({name: "main"})
  if ( botTime.timeToNull == date ) return false;
  if ( timeTwo !== "00" ) return false;

  // this portion of logic occurs when a day has passed
  await botData.updateMany({}, {$set: {timeToNull: date}})
  return true;
}


// some function which should run once a day
async function runOncePerDay(){
  const asd = await hasOneDayPassed()
  if( !asd ) return;
  // your code below
  const rpgAll = await rpg.find({userID: {$exists: true}}).sort([['totalGames', 'descending']]).exec();
  
  await addCrystal(rpgAll[0]["userID"], crystalToTopOne);
  await memberModel.updateMany({}, {$set: {messages: 0}})
}
runOncePerDay()
}, 1000 * 60 * 5)

bot.login(process.env.TOKEN)
