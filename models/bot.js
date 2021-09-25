const mongoose = require("mongoose");
const { PREFIX } = require("./../config")

const serverSchema = new mongoose.Schema({
  name: {type: String, default: "main"},
  timeToNull: String
});

const model = mongoose.model("bot", serverSchema);

module.exports = model;
