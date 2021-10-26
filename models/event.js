const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  userID: { type: String, require: true, unique: true },
  candy: { type: Number, default: 0 },
  candyBox: { type: Number, default: 0 }
});

const model = mongoose.model("event", Schema);

module.exports = model;
