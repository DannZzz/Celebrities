const mongoose = require("mongoose");

const begSchema = new mongoose.Schema({
  code: {type: String, default: undefined, unique: true},
  max: {type: Number, default: 1},
  users: {type: Array, default: []},
  reward: {type: Number, default: 0}
});

const model = mongoose.model("promocodes", begSchema);

module.exports = model;
