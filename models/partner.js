const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  userID: { type: String, require: true, unique: true },
  date: { type: Date, require: true },
  code: { type: String, require: true, unique: true },
  level: { type: Number, default: 1 }
});

const model = mongoose.model("partner", Schema);

module.exports = model;
