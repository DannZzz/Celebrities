const { main } = require('../../JSON/colours.json');
const Team = require("../../functions/teamClass");
const { MessageEmbed } = require("discord.js");
const {error, firstUpperCase} = require("../../functions/functions");
const {serverFind, rpgFind, clanFind} = require("../../functions/models");
const heroes = require('../../JSON/heroes.json');

module.exports = {
  config: {
    name: "team",
    aliases: ['тима'],
    category: 'cards'
  },
  run: async (bot, msg, args) => {
  
    await Team(msg).getTeam(bot);
    
  }
}