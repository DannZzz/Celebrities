const Rate = require("../../functions/rateClass");
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { main } = require('../../JSON/colours.json');
const { HELL, COIN, BANK, STAR, status, CRYSTAL, devID, adminID, STAFF } = require('../../config');
const devs = ["382906068319076372"];
const moment = require('moment');
const { formatNumber, progressBar } = require("../../functions/functions");
const EVENT = require("../../functions/eventClass");
const { eventFind, serverFind, vip, bagFind, marry, rpg, profile, clanFind, profileFind, rpgFind, vipFind } = require("../../functions/models");
const YTchannelInfo = require("yt-channel-info");
const { LevelMethods } = require("../../functions/levelClass");
const { stripIndents } = require("common-tags");

module.exports = {
  config: {
    name: 'profile',
    aliases: ['профиль'],
    category: 'h_roleplay'
  },
  run: async (bot, message, args) => {
    const LANG = await serverFind(message.guild.id);
    const { crystal, profile: p, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar } = require(`../../languages/${LANG.lang}`);

    let member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;
  
    let embed = new MessageEmbed()
      .setColor(main)
      .setAuthor(`${p.pr} ` + member.user.tag, member.user.displayAvatarURL({ dynamic: true }))

    const data1 = await profileFind(member.id);
    let marData;
    if (data1.marryID) {
      let mar = await marry.findOne({ id: data1.marryID })
      if (member.id === mar.first) {
        marData = `${(message.guild.members.cache.get(mar.second) ? message.guild.members.cache.get(mar.second) : (bot.users.cache.get(mar.second) ? `${bot.users.cache.get(mar.second).tag || p.none} ${p.from} ${moment(mar.date).format('DD.MM.YYYY')}` : "?"))}`
      } else {
        marData = `${(message.guild.members.cache.get(mar.first) ? message.guild.members.cache.get(mar.first) : (bot.users.cache.get(mar.first) ? `${bot.users.cache.get(mar.first).tag || p.none} ${p.from} ${moment(mar.date).format('DD.MM.YYYY')}` : "?"))}`
      }
    } else {
      marData = '—'
    }
    let data = await bagFind(member.id);
    let rp = await rpgFind(member.id);
    let vip = '—'
    let checkVip = await vipFind(member.id)
    if (data["vip1"] && data["vip2"]) vip = LANG.lang === "ru" ? `${status.premium} Премиум` : `${status.premium} Premium`;
    else if (data["vip1"]) vip = status.vip + " VIP";
    const trophy = rp.league.rate || 0;

    //if(data["vip1"] && checkVip.profileImage !== null && data["vip2"]) embed.setImage(checkVip.profileImage);
    let CL;
    if (rp && rp.clanID) {
      let cll = await clanFind(rp.clanID);
      CL = `${p.clan} **${cll.name}** | ${p.level} __${cll.level}__`
    } else {
      CL = p.noclan
    };

    let znachok = "";
    if (devID.includes(member.id)) {
      znachok = STAFF.dev;
    } else if (adminID.includes(member.id)) znachok = STAFF.owner;
    const myXp = Math.round(data1.xp || 0);
    const myLevelObj = LevelMethods.getCurrentLevelByXp(myXp);

    const xpBar = myXp - myLevelObj.currentLevelXp;
    const neededXp = myLevelObj.xpForNextLevel - myLevelObj.currentLevelXp;
    
    const bar = progressBar(xpBar, neededXp, 10, "⬜", "⬛");

    await EVENT(member.id).checkDocument();
    const event = await eventFind(member.id);
  
    embed.addField(stripIndents`
    ${p.status} ${vip}
    ${p.subs} ${getSub(bot, member.id, LANG.lang)}
    ${LANG.lang === "en" ? "Level" : "Уровень"}: ${myLevelObj.current} 
    ${formatNumber(myXp)} / ${formatNumber(myLevelObj.xpForNextLevel)} xp
    ${bar}
    `, `${STAR} ${formatNumber(Math.round(data.stars)) || Math.round(data.stars)} ${znachok}\n${CRYSTAL} ${formatNumber(Math.round(data.crystal || 0))}\n${HELL.candy} ${formatNumber(Math.round(event.candy || 0))}\n${await Rate(message).rateData(trophy)}\n${p.quiz} ${rp.quizCount}\n${CL}\n${p.gg} ${marData}\n\n`)
    
    embed.addField(`__${p.fishes}__\n`,
      `\`\`\`${p.junk}(🔧) - ${data.junk}\n${p.common}(🐟) - ${data.common}\n${p.unc}(🐠) - ${data.uncommon}\n${p.rare}(🦑) - ${data.rare}\n${p.leg}(🐋) - ${data.legendary}\`\`\`\n`, true)


    if (data["vip1"] && checkVip.profileBio) embed.addField(p.bio, checkVip.profileBio, true);

    let buttonList = []
    if (checkVip.vkLink) {
      const link = checkVip.vkLink.substring(8, checkVip.vkLink.length);
      const button1 = new MessageButton()
        .setLabel(link)
        .setStyle("LINK")
        .setURL(checkVip.vkLink)
        .setEmoji("<:VK:889579417804886116>")
      buttonList.push(button1)
    }

    if (checkVip.discordLink) {
      const link = checkVip.discordLink.substring(8, checkVip.discordLink.length);
      const button2 = new MessageButton()
        .setLabel(link)
        .setStyle("LINK")
        .setURL(checkVip.discordLink)
        .setEmoji("<:discord:889581995129192518>")
      buttonList.push(button2)
    }

    if (checkVip.youtubeLink) {
      const link = checkVip.youtubeLink;
      const res = link.substring(32, link.length);
      const get = await YTchannelInfo.getChannelInfo(res);
      const button3 = new MessageButton()
        .setLabel(`youtube/${get.author}`)
        .setStyle("LINK")
        .setURL(link)
        .setEmoji("<:youtube:889594031116521503>")
      buttonList.push(button3)
    }

    if (checkVip.instagramLink) {
      const link = checkVip.instagramLink;
      const res = link.substring(26, link.length - 1);
      const button4 = new MessageButton()
        .setLabel(`instagram/${res}`)
        .setStyle("LINK")
        .setURL(link)
        .setEmoji("<:instagram:889609379517698108>")
      buttonList.push(button4)
    }

    const row = new MessageActionRow().addComponents(buttonList);
    buttonList.length !== 0 ? message.channel.send({ embeds: [embed], components: [row] }) : message.channel.send({ embeds: [embed] })


  }
}


function getSub(bot, id, lang = "ru") {
  const server = bot.guilds.cache.get("882589567377637408");

  const boosterRoleIds = {
    classic: "897172766929858601",
    premium: "897172906021371926",
    premiumPlus: "897172954411053098"
  }

  const langData = {
    en: {
      classic: "Classic Boost 💛",
      average: "Average Boost 💚",
      max: "Maximum Boost 💜"
    },
    ru: {
      classic: "Классический Буст 💛",
      average: "Средний Буст 💚",
      max: "Максимальный Буст 💜"
    }
  };


  if (server) {
    const member = server.members.cache.get(id);
    if (member) {
      if (member.roles.cache.get(boosterRoleIds.premiumPlus)) {
        return langData[lang].max;
      } else if (member.roles.cache.get(boosterRoleIds.premium)) {
        return langData[lang].average;
      } else if (member.roles.cache.get(boosterRoleIds.classic)) {
        return langData[lang].classic;
      } else {
        return "—";
      }
    } else {
      return "—";
    }
  } else {
    return "—";
  }

}

