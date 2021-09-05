const mongoose = require("mongoose");

const marrySchema = new mongoose.Schema({
  first: { type: String, require: true, unique: true },
  second: { type: String, require: true, unique: true },
  verified: { type: Boolean, default: false},
  date: { type: Number },
  id: { type: Number, default: null}
});

const model = mongoose.model("marry", marrySchema);

module.exports = model;
