const mongoose = require("mongoose");


const vipSchema = new mongoose.Schema({
  userID: { type: String, require: false, unique: true },
  profileBio: {type: String, default: undefined},
  profileImage: {type: String, default: undefined},
  profileThumbnail: {type: String, default: undefined},
  rankImage: { type: String, default: undefined},
  rankColor: { type: String, default: undefined},
  vkLink: { type: String, default: undefined},
  discordLink: { type: String, default: undefined},
  youtubeLink: { type: String, default: undefined},
  instagramLink: { type: String, default: undefined}
});

const model = mongoose.model("VipModels", vipSchema);

module.exports = model;
