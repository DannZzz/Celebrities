const serverModel = require("../../models/serverSchema");
const profileModel = require("../../models/profileSchema");
const memberModel = require("../../models/memberSchema");
const begModel = require("../../models/begSchema");
const vipModel = require("../../models/vipSchema");
const rpg = require("../../models/rpgSchema");
const botData = require("../../models/bot");

module.exports = async (bot, member) => {
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
}