const mongoose = require("mongoose");


const memberSchema = new mongoose.Schema({
  serverID: { type: String, unique: false},
  userID: { type: String, unique: false},
  messages: { type: Number, default: 0}

});

const model = mongoose.model("MemberModels", memberSchema);

module.exports = model;
