const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  userID: { type: String, require: true, unique: true },
  topggDate: Date,
  topggCount: { type: Number, default: 0 }
});

const model = mongoose.model("vote", Schema);

module.exports = model;
