const mongoose = require("mongoose");
const { PREFIX } = require("./../config")

const serverSchema = new mongoose.Schema({
  serverID: { type: String, require: true, unique: true },
  prefix: { type: String, default: PREFIX},
  welcome: { type: Boolean, default: false},
  welcomeText: { type: String},
  welcomeChannel: { type: String},
  welcomeColor: { type: String},
  welcomeImage: { type: String},
  shop: { type: Array, default: [] },
  rank: { type: Boolean, default: false},
  lang: { type: String, default: "en"}
});

const model = mongoose.model("ServerModels", serverSchema);

module.exports = model;
