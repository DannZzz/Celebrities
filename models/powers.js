const mongoose = require("mongoose");


const begSchema = new mongoose.Schema({
  userID: { type: String, require: false, unique: true },
  health: { type: Object, default: {
    level: 1,
    value: 0.2
  }},
  damage: { type: Object, default: {
    level: 1,
    value: 0.2
  }},
  gold: { type: Object, default: {
    level: 1,
    value: 0
  }},
});

const model = mongoose.model("powers", begSchema);

module.exports = model;
