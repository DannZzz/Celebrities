const mongoose = require("mongoose");

const rpgSchema = new mongoose.Schema({
  userID: { type: String, require: true, unique: true },
  date: { type: Date, require: true },
  name: { type: String, require: true },
  value: { type: Number, require: true }
});

const model = mongoose.model("powerupdate", rpgSchema);

module.exports = model;
