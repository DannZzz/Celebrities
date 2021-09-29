const { main } = require('../../JSON/colours.json');
const Team = require("../../functions/teamClass");
const { CLAN } = require("../../config");
const { MessageEmbed } = require("discord.js");
const {error, firstUpperCase} = require("../../functions/functions");
const {serverFind, rpgFind, clanFind} = require("../../functions/models");
const heroes = require('../../JSON/heroes.json');

module.exports = {
  config: {
    name: "war",
    aliases: ['война'],
    category: 'cards'
  },
  run: async (bot, msg, args, ops) => {
    const curr = ops.games.get(msg.author.id);
    if (curr) return;

    ops.games.set(msg.author.id, {war: "now"});
    const sd = await serverFind(msg.guild.id);
    const {war: w, clanModel: cm} = require(`../../languages/${sd.lang}`);
    
    const d1 = await rpgFind(msg.author.id);
    if (d1.clanID) {
         const d2 = await clanFind(d1.clanID);
         const now = new Date();
         const then = new Date(d2.war)
         if (then > now) {
          ops.games.delete(msg.author.id);
          const time = new Date(then-now);
          return error(msg, `${sd.lang === "en" ? `Try again in **${time.getUTCHours()}h. ${time.getMinutes()}m.**` : `Попробуйте снова через **${time.getUTCHours()}ч. ${time.getMinutes()}м.**`}`)
         }
    } else {
      return error(msg, cm.noClan);
    }
    
    if (!args[0]) return error(msg, cm.specN), ops.games.delete(msg.author.id);;
    if (!args[1] || isNaN(args[1])) return error(msg, w.bet), ops.games.delete(msg.author.id);;
    if (Math.round(args[1]) > 50000 || Math.round(args[1]) <= 10) return error(msg, w.betError+` ${CLAN}`), ops.games.delete(msg.author.id);;
    await Team(msg).startBattle(args[0], Math.round(args[1]))
    return setTimeout( () => {
      ops.games.delete(msg.author.id);
    }, 35000)
    
  }
}