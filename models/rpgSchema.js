const mongoose = require("mongoose");


const rpgSchema = new mongoose.Schema({
  userID: { type: String, require: false, unique: true },
  item: { type: String, default: null },
  itemCount: { type: Number, defualt: 1},
  heroes: { type: Array, default: []},
  clanID: { type: String, default: null},
  wins: { type: Number, default: 0 },
  loses: { type: Number, default: 0 },
  totalGames: { type: Number, default: 0 },
  surviveLevel: { type: Number, default: 0},
  quizCount: { type: Number, default: 1},
  hlt: {type: Number, default: 0},
  dmg: {type: Number, default: 0},
  box: {type: Number, default: 0},
  lvl: {type: Number, default: 0},
  meat: {type: Number, default: 0},
  pack1: {type: Number, default: 0},
  pack2: {type: Number, default: 0},
  pack3: {type: Number, default: 0},
  tempPack: { type: Number, default: 0},
  tasks: {type: Array, default: []},
  tasksCount: { type: Number, default: 0},
  spendTask: { type: Number, default: 0},
  spendAll: { type: Number, default: 0},
  task1: { type: Number, default: 1},
  task2: { type: Number, default: 1},
  openedPacks: { type: Number, default: 0},

});

const model = mongoose.model("RpgModels", rpgSchema);

module.exports = model;
