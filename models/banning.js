const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userID: { type: String, require: true, unique: true },
  date: {type: Date, require: true}
});

const model = mongoose.model("ban", profileSchema);

module.exports = model;
