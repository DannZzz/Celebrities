const mongoose = require("mongoose");
const { PREFIX } = require("./../config")

const bSchema = new mongoose.Schema({
  name: {type: String, default: "main", require: true},
  timeToNull: {type: String, default: "main"},
  bugHunter: { type: Array, default: [] },
  idea: { type: Array, default: [] }
});

const model = mongoose.model("bot", bSchema);

module.exports = model;
