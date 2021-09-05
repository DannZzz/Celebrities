const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userID: { type: String, require: true, unique: true },
  fish: { type: Number, default: 0 },
  daily: {type: Number, default: 0 },
  marry: { type: Number, default: 0},
  marryID: { type: Number, default: null },
  bug: {type: Number, default: 0 },
  drag: { type: Number, default: 0},
  rpg: { type: Number, default: 0},
  survive: { type: Number, default: 0},
  boss: { type: Number, default: 0},
  join: { type: Number, default: 0},
  allowMultiHeroes: { type: Boolean, default: false },
  afkMessage: { type: String, default: null} ,
  random: { type: Number, default: 0}
});

const model = mongoose.model("ProfileModels", profileSchema);

module.exports = model;
