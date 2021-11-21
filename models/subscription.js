const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  userID: { type: String, require: true, unique: true },
  level: { type: Number, default: 0 },
  date: Date
});

const model = mongoose.model("subscription", Schema);

module.exports = model;
