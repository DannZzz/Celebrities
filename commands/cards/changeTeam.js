const { main } = require('../../JSON/colours.json');
const Team = require("../../functions/teamClass");
const { MessageEmbed } = require("discord.js");
const {error, firstUpperCase} = require("../../functions/functions");
const {serverFind, rpgFind, clanFind, clan: c} = require("../../functions/models");
const heroes = require('../../JSON/heroes.json');

module.exports = {
  config: {
    name: "tchange",
    aliases: ['поменять'],
    category: 'cards'
  },
  run: async (bot, msg, args) => {
    const user = msg.author;
    const sd = await serverFind(msg.guild.id);
    const {tchange: t} = require(`../../languages/${sd.lang}`);
    if (!args[0]) return error(msg, t.check);
    if (args[0].toLowerCase() === "clear") {
      await Team(msg).clearTeam();
    } else if (!isNaN(args[0])) {
      await Team(msg).changeTeam(Math.floor(args[0]));
    } else {
      return error(msg, t.check);
    }
  }
}