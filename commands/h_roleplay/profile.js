const pd = require("../../models/profileSchema");
const memberModel = require("../../models/memberSchema");
const begModel = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const clan = require("../../models/clanSchema");
const marry = require("../../models/marry");
const fishes = require('../../JSON/fishes.json');
const { MessageEmbed } = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR} = require('../../config');
const vipModel = require("../../models/vipSchema");
const Levels = require("discord-xp");
Levels.setURL(process.env.MONGO);
const devs = ["382906068319076372"];
const moment = require('moment');

module.exports = {
  config: {
    name: 'profile',
    aliases: '',
    category: 'h_roleplay'
  },
  run: async (bot, message, args) => {
    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {profile: p, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   
   
    let member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;
    let person = await Levels.fetch(member.user.id, message.guild.id, true)
    let embed = new MessageEmbed()
    .setTimestamp()
    .setColor(cyan)
    .setAuthor(`${p.pr} ` + member.user.tag , member.user.displayAvatarURL({dynamic: true}))

    const data1 = await pd.findOne({userID: member.id});
    let marData;
    if (data1.marryID) {
      let mar = await marry.findOne({id: data1.marryID})
      if (member.id === mar.first) {
        marData = `${(message.guild.members.cache.get(mar.second) ? message.guild.members.cache.get(mar.second) : bot.users.cache.get(mar.second).tag) || p.none} ${p.from} ${moment(mar.date).format('DD.MM.YYYY')}`;
      } else {
        marData = `${(message.guild.members.cache.get(mar.first) ? message.guild.members.cache.get(mar.first) : bot.users.cache.get(mar.first).tag) || p.none} ${p.from} ${moment(mar.date).format('DD.MM.YYYY')}`;
      }
    } else {
      marData = '—'
    }
    let data = await begModel.findOne({ userID: member.id });
    let rp = await rpg.findOne({ userID: member.id });
    let vip = '**0** <a:vip:867867143915438100>'
    let checkVip = await vipModel.findOne({ userID: member.id })
    if(data["vip1"] && data["vip2"]) vip ="**2** <a:vip2:867868958459166751>";
    else if (data["vip1"]) vip = '**1** <a:vip1:867868958877810748>';


    if(data["vip1"] && checkVip.profileImage !== null && data["vip2"]) embed.setImage(checkVip.profileImage);
    let CL;
    if (rp && rp.clanID) {
      let cll = await clan.findOne({ID: rp.clanID});
      CL = `${p.clan} **${cll.name}** | ${p.level} __${cll.level}__`
    } else {
      CL = p.noclan
    }



      embed.addField(`**VIP** - ${vip}`, `${STAR} ${data.stars} ${devs.includes(member.id) ? "__Dev__" : ""}\n${p.quiz} ${rp.quizCount}\n${CL}\n${p.gg} ${marData}\n\n`)
      embed.addField(`__${p.fishes}__\n`,
    `\`\`\`${p.junk}(🔧) - ${data.junk}\n${p.common}(🐟) - ${data.common}\n${p.unc}(🐠) - ${data.uncommon}\n${p.rare}(🦑) - ${data.rare}\n${p.leg}(🐋) - ${data.legendary}\`\`\`\n`, true)


    if(data["vip1"] && checkVip.profileBio !== null) embed.addField(p.bio ,checkVip.profileBio, true);

    message.channel.send({embeds: [embed]})
  }
}
