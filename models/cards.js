const mongoose = require("mongoose");


const begSchema = new mongoose.Schema({
  userID: { type: String, require: true },
  name: { type: String, require: true},
  createdAt: Date,
  code: { type: String, default: undefined, unique: true},
  pin: { type: String, default: "0000"},
  amount: {type: Number, default: 0},
});

const model = mongoose.model("cards", begSchema);

module.exports = model;
