const { MessageEmbed } = require('discord.js');
const {greenlight, redlight, main} = require('../../JSON/colours.json');
const {error, embed, perms} = require("../../functions/functions");
const {serverFind, vip, bagFind} = require("../../functions/models");
const {isWebUri} = require('valid-url');
const { AGREE } = require('../../config');

module.exports = {
  config: {
    name: "link",
    category: "f_settings",
    aliases: ['ссылка'],
  },
  run: async (bot, message, args) => {
    

    const LANG = await serverFind(message.guild.id);
    const {link: l, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm} = require(`../../languages/${LANG.lang}`);   
      
    
    //https://vk.com/bevardan
    // https://www.youtube.com/channel/UC-lHJZR3Gqxm24_Vd_AJ5Yw
    // https://www.instagram.com/bevardan/
    if (!args[0]) return error(message, l.link);
    const insta = ["insta", "instagram", "инста", "инстаграм"];
    const yt = ["yt", "youtube", "ютуб"];
    const vk = ["вк", "vk"];
    const discord = ["discord", "дискорд"];
    const validLinks = ["https://www.instagram.com/", "https://vk.com/", "https://www.youtube.com/channel/", "https://discord.gg/"];

    if((!args[1] || !isWebUri(args[1])) && args[1].toLowerCase() !== "disable") return error(message, specifyL);

    const site = args[0].toLowerCase();
    
    if (insta.includes(site)) {
      if (args[1].toLowerCase() === "disable") {
        await vip.updateOne({userID: message.author.id}, {$set: {instagramLink: undefined}});
        return message.react(AGREE);
      }
      if (!args[1].startsWith("https://www.instagram.com/")) return error(message, specifyL+"\n`https://www.instagram.com/`");
      await vip.updateOne({userID: message.author.id}, {$set: {instagramLink: args[1]}});
      return message.react(AGREE);
    } 
    else if (vk.includes(site)) {
      if (args[1].toLowerCase() === "disable") {
        await vip.updateOne({userID: message.author.id}, {$set: {vkLink: undefined}});
        return message.react(AGREE);
      }
      if (!args[1].startsWith("https://vk.com/")) return error(message, specifyL+"\n`https://vk.com/`");
      await vip.updateOne({userID: message.author.id}, {$set: {vkLink: args[1]}});
      return message.react(AGREE);
    }
    else if (yt.includes(site)) {
      if (args[1].toLowerCase() === "disable") {
        await vip.updateOne({userID: message.author.id}, {$set: {youtubeLink: undefined}});
        return message.react(AGREE);
      }
      if(!args[1].startsWith("https://www.youtube.com/channel/")) return error(message, specifyL+"\n`https://www.youtube.com/channel/`");
      await vip.updateOne({userID: message.author.id}, {$set: {youtubeLink: args[1]}});
      return message.react(AGREE);    
    } else if (discord.includes(site)) {
      if (args[1].toLowerCase() === "disable") {
        await vip.updateOne({userID: message.author.id}, {$set: {discordLink: undefined}});
        return message.react(AGREE);
      }
      if(!args[1].startsWith("https://discord.gg/")) return error(message, specifyL+"\n`https://discord.gg/`");   
      await vip.updateOne({userID: message.author.id}, {$set: {discordLink: args[1]}});
      return message.react(AGREE);    
    } else {
      return error(message, "`"+validLinks.join("`\n`")+"`")
    }

    return error(message, "Youtube\nVK\nInstagram\nDiscord");




  }
}
