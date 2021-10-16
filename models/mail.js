const mongoose = require("mongoose");


const Schema = new mongoose.Schema({
  userID: { type: String, require: true, unique: true },
  messages: { type: Array, default: [] },
  gold: { type: Number, default: 0 },
  tropicalForest: { type: Number, default: 0 }
});

const model = mongoose.model("mail", Schema);

module.exports = model;
