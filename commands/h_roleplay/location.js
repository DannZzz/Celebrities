const { MessageEmbed } = require("discord.js");
const { COIN, AGREE } = require("../../config");
const {error, embed, perms, firstUpperCase, makeTimestamp} = require("../../functions/functions");
const Loc = require("../../functions/locationClass");
const { serverFind } = require("../../functions/models");

module.exports = {
  config: {
    name: "locations",
    aliases: ['локации'],
    category: 'h_roleplay'
  },
  run: async (bot, msg, args, ops) => {

    const LANG = await serverFind(msg.guild.id);
    const {use: u, buy: b, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   

    const user = msg.author;

    await Loc(bot, msg).startLocationFarm();

    
  }
}