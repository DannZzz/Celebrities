const { vip: vipModel, profile: profileModel, bag: begModel, member: memberModel, rpg } = require("../../functions/models");

module.exports = async (bot, message) => {
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
}