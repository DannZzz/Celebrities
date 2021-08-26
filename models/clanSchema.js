const mongoose = require("mongoose");

const clanSchema = new mongoose.Schema({
  owner: { type: String, unique: true},
  ID: { type: String, unique: true},
  name: { type: String},
  level: { type: Number, default: 1},
  space: { type: Number, default: 5},
  reward: { type: Number, default: 0},
  budget: { type: Number, default: 0},
  apps: { type: Array, default: []},
  logo: { type: String, default: null},
  description: { type: String, default: null},
  appsStatus: { type: Boolean, default: true}
});

const model = mongoose.model("clans", clanSchema);

module.exports = model;
