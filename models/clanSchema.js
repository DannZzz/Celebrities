const mongoose = require("mongoose");

const clanSchema = new mongoose.Schema({
  owner: { type: String, unique: true},
  coowner: { type: String, default: undefined },
  ID: { type: String, unique: true},
  name: { type: String},
  premium: { type: Boolean, default: false },
  level: { type: Number, default: 1},
  space: { type: Number, default: 5},
  reward: { type: Number, default: 0},
  budget: { type: Number, default: 0},
  apps: { type: Array, default: []},
  staff: { type: Array, default: []},
  logo: { type: String, default: undefined},
  description: { type: String, default: undefined},
  appsStatus: { type: Boolean, default: true},
  team: { type: Array, default: []},
  total: {type: Number, default: 0},
  wins: {type: Number, default: 0},
  war: {type: Date, default: undefined},
  addHealth: { type: Number, default: 0 },
  addDamage: { type: Number, default: 0 },
});

const model = mongoose.model("clans", clanSchema);

module.exports = model;
