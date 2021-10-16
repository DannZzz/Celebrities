const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  userID: { type: String, require: true, unique: true },
  date: { type: Date, require: true },
  locationId: { type: String, require: true }
});

const model = mongoose.model("locationFarm", Schema);

module.exports = model;
