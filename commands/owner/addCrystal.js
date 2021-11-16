const { rpg, rpgFind, addCrystal } = require("../../functions/models");
const { error, embed } = require("../../functions/functions");
const { STAR, AGREE, DISAGREE, devID, adminID, CRYSTAL } = require('../../config')
const ITEMS = require("../../JSON/items.js");
const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require("discord.js");
const { main } = require('../../JSON/colours.json');

module.exports = {
  config: {
    name: "addcrystal",
    aliases: '',
    dev: true
  },
  run: async (bot, msg, args) => {
    if (!args[0]) return error(msg, "Укажите ID");
    const isData = await rpgFind(args[0]);
    if (!isData) return error(msg, "Не найден.");
    const user = bot.users.cache.get(args[0]);
    if (!user) return error(msg, "Пользователь найден.");
    if(!args[1]) return error(msg, "Укажите кол-во монет, чтобы добавить.");
    if(isNaN(args[1])) return error(msg, "Укажите кол-во монет в виде, чтобы добавить.");
    if(args[1] > 1000000000) return error(msg, "Укажите число меньше **1.000.000.000**.");

    await addCrystal(args[0], Math.round(args[1]));
    
    user.send({embeds: [embed(msg, `**New Gift!🎉**\n\n||${Math.floor(args[1])} ${CRYSTAL}||`, "dm")]}).then(msg.react(AGREE)).catch(()=> msg.react(DISAGREE))

  }
}