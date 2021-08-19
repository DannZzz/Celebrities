const mongoose = require("mongoose");


const memberSchema = new mongoose.Schema({
  serverID: { type: String, unique: false},
  userID: { type: String, unique: false},
  roulette: { type: Number, default: 0},
  slots: { type: Number, default: 0},
  work: { type: Number, default: 0},
  rob: { type: Number, default: 0},

});

const model = mongoose.model("MemberModels", memberSchema);

module.exports = model;
