const mongoose = require("mongoose");


const Schema = new mongoose.Schema({
  userID: { type: String, require: false, unique: true },
  battle: { type: Number, default: 0 },
  "2v2": { type: Number, default: 0 },
  journey: { type: Number, default: 0 },
  duel: { type: Number, default: 0 },
});

const model = mongoose.model("BegModels", Schema);

module.exports = model;
