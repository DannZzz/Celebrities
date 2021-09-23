const {Client, MessageEmbed, Collection, Intents} = require('discord.js');
const voiceCollection = new Collection();
const {PREFIX} = require('./config')
const bot = new Client({restWsBridgeTimeout: 0, shards: "auto", restTimeOffset: 0, allowedMentions: { parse: [], repliedUser: false}, intents: [Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });
const fs = require('fs');
const mongoose = require('mongoose');
const mc = require('discordjs-mongodb-currency')
const Levels = require("discord-xp");

const MONGO = process.env.MONGO
Levels.setURL(MONGO);
const Canvas = require('canvas')
Canvas.registerFont(`./AlumniSans-SemiBold.ttf`, { family: "Alumni Sans"})

mc.connect(MONGO)
mongoose.connect(MONGO, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.set('useFindAndModify', false)

const serverModel = require("./models/serverSchema");
const profileModel = require("./models/profileSchema");
const memberModel = require("./models/memberSchema");
const begModel = require("./models/begSchema");
const vipModel = require("./models/vipSchema");
const rpg = require("./models/rpgSchema");

bot.commands = new Collection();
bot.aliases = new Collection();

["aliases", "commands"].forEach(x => bot[x] = new Collection());
["command", "event"].forEach(x => require(`./handler/${x}`)(bot));

bot.categories = fs.readdirSync("./commands/");

['command'].forEach((handler) => {
  require(`./handler/${handler}`)(bot);
});

bot.on('error',function(err){})

bot.on("guildCreate", async guild => {
  let serverData = await serverModel.findOne({ serverID: guild.id });
  if(!serverData) {
    let server = await serverModel.create({
      serverID: guild.id,
      lang: "en"
    })
  server.save()}

})

bot.on("guildMemberAdd", async member => {
    let sd = await serverModel.findOne({serverID: member.guild.id})
    if(sd.welcome) {
      let emb = new MessageEmbed()
      .setTimestamp()
      .setAuthor(member.user.tag, member.guild.iconURL({dynamic: true}))
      .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
      .setColor(sd.welcomeColor || '#2f3136')
      .setDescription(sd.welcomeText || `Приветствуем тебя уважаемый участник!`)
      .setImage(sd.welcomeImage)

    let channel = member.guild.channels.cache.get(sd.welcomeChannel);
    if(channel) {
      channel.send({embeds:[emb]})
    } else {
      return
    }
    }

    let rp = await rpg.findOne({userID: member.id});
    if (!rp) {const asd = await rpg.create({
      userID: member.id
    })
    asd.save()
    }
    
    let vipData = await vipModel.findOne({ userID: member.id });
    if (!vipData) {
    let vip = await vipModel.create({
      userID: member.id
    })
    vip.save()}

  let begData = await begModel.findOne({ userID: member.id });
  if(!begData) {
    let beg = await begModel.create({
      userID: member.id,
    })
    beg.save();
  }

  let profileData = await profileModel.findOne({ userID: member.id });
  if (!profileData) {
  let profile = await profileModel.create({
    userID: member.id,
    fish: 0,
    daily: 0
  });
  profile.save()};

  let memberData = await memberModel.findOne({ userID: member.id, serverID: member.guild.id});
  if (!memberData) {
  let memberr = await memberModel.create({
    userID: member.id,
    serverID: member.guild.id,
  });
  memberr.save()};
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
        userID: message.author.id,
        serverID: message.guild.id,
        coins: 1000,
        bank: 0,
        slots: 0,
        rob: 0,
        fish: 0,
        work: 0,
        daily: 0
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
              lang: "en"
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
        const server = await serverModel.findOne( {serverID: message.guild.id});
        if (server.rank) {
          let random = Math.floor(Math.random() * 4) + 1;
          if (message.author.bot) return;
          if (message.channel.type === "DM") return;
          await Levels.appendXp(message.author.id, message.guild.id, random);

        }

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

bot.login(process.env.TOKEN)
