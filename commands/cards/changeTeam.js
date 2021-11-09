const { main } = require('../../JSON/colours.json');
const Team = require("../../functions/teamClass");
const { MessageEmbed } = require("discord.js");
const {error, firstUpperCase, missingArgument} = require("../../functions/functions");
const {serverFind, rpgFind, clanFind, clan: c} = require("../../functions/models");
const heroes = require('../../JSON/heroes.json');

module.exports = {
  config: {
    name: "tchange",
    aliases: ['поменять'],
    category: 'cards',
    examples: ["tchange 2", "tchange clear"]
  },
  run: async function (bot, msg, args) {
    const user = msg.author;
    const sd = await serverFind(msg.guild.id);
    const {tchange: t} = require(`../../languages/${sd.lang}`);
    if (!args[0]) return await missingArgument(msg, t.check, `${this.config.name} ${t.usage}`, this.config.examples);
    if (args[0].toLowerCase() === "clear") {
      await Team(msg).clearTeam();
    } else if (!isNaN(args[0])) {
      await Team(msg).changeTeam(Math.floor(args[0]));
    } else {
      return await missingArgument(msg, t.check, `${this.config.name} ${t.usage}`, this.config.examples);
    }
  }
}