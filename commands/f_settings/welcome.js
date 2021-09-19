const Discord = require('discord.js');
const {main} = require('../../JSON/colours.json');
const serverModel = require("../../models/serverSchema");
const begModel = require("../../models/begSchema");
const {error, embed, perms} = require("../../functions/functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);
const {isWebUri} = require('valid-url');

module.exports = {
      config: {
        name: "welcome",
        category: "f_settings",
        aliases: ["welcomer", 'приветствие']
    },
    run: async (bot, message, args) => {
      

      const getLang = require("../../models/serverSchema");
      const LANG = await getLang.findOne({serverID: message.guild.id});
      const {welcome: b, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm} = require(`../../languages/${LANG.lang}`);   
      
      
      if (!perms(message, "ADMINISTRATOR")) return error(message, perms)
      if (!args[0]) return error(message, b.error)
      const option = args[0].toLowerCase();
      const serverData = await serverModel.findOne({serverID: message.guild.id});
      if (option === 'enable') {
        if(serverData.welcome === false) {
          serverData.welcome = true
          serverData.save()
          return embed(message, b.done)
        } else {
          return error(message, b.done1)
        }
      } else if (option === 'disable') {
        if(serverData.welcome === true) {
          serverData.welcome = false
          serverData.save()
          return embed(message, b.done2)
        } else {
          return error(message, b.done4)
        }
      } else if (option === 'help') {
        return message.channel.send(`
          \`${b.now}\`
${b.image} - ${serverData.welcomeImage ? `[${b.LINK}](${serverData.welcomeImage})` : `\`${b.not}\``}
${b.text} - \`${serverData.welcomeText || b.not}\`
${b.channel} - ${message.guild.channels.cache.get(serverData.welcomeChannel) || `\`${b.not}\``}
${b.color} - \`${serverData.welcomeColor || b.not}\`
          `)
      }
      if (!args[1]) return error(message, b.spec)
      const prop = args.splice(1).join(' ');
      const checkVip = await begModel.findOne({userID: message.author.id});


      if (option === 'image') {
        if(checkVip['vip2']) {
          if(prop === 'help') {
            return message.channel.send(b.helpImage)
          } else {
            if (!isWebUri(prop)) return error(message, specifyL)
            serverData.welcomeImage = prop;
            serverData.save()
            embed(message, b.imageDone)
          }
        } else {
          return error(message, vipTwo)
        }
      } else if (option === 'text') {
        if(prop === 'help') {
          return message.channel.send(b.helpText)
        } else {
          serverData.welcomeText = `${prop}`;
          serverData.save()
          embed(message, b.textDone)
        }
      } else if (option === 'color') {
        if(prop === 'help') {
          return message.channel.send(b.helpColor)
        } else {
          serverData.welcomeColor = prop;
          serverData.save()
          embed(message, b.colorDone)
        }
      } else if (option === 'channel') {
        if(prop === 'help') {
          return message.channel.send(b.channelHelp)
        } else {
          let channel = message.mentions.channels.first() || bot.guilds.cache.get(message.guild.id).channels.cache.get(args[1]) || message.guild.channels.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase());
          if (!channel) return error(message, b.channelError)
          serverData.welcomeChannel = channel.id;
          serverData.save()
          embed(message, b.channelDone)
        }
      } else {
        return error(message, b.err)
      }

    }
}
