const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  userID: { type: String, require: true, unique: true },
  accounts: { type: Array, default: [] },
  mining: { type: Array, default: [] },
  paymentMethod: { type: String, default: undefined },
  date: { type: Date, require: true },
  totalInvests: { type: Number, default: 0 },
  totalGotten: { type: Number, default: 0 },
  premium: { type: Boolean, default: false }
});

const model = mongoose.model("bank", Schema);

module.exports = model;
