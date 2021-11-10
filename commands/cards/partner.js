const { main } = require('../../JSON/colours.json');
const Partner = require("../../functions/partnerClass");
const { MessageEmbed } = require("discord.js");
const { error, firstUpperCase, missingArgument } = require("../../functions/functions");
const { serverFind } = require("../../functions/models");

module.exports = {
  config: {
    name: "partner",
    aliases: ['партнер'],
    category: 'cards',
    cooldown: 35,
    examples: [ "partner create", "partner server dann%0000"]
  },
  run: async function (bot, msg, args) {

    if (args[0] && args[0].toLowerCase() === "create") {
      return await Partner(bot, msg).createPartnerCode();
    };
    const servers = ["server", "сервер"];
    if (args[0] && servers.includes(args[0].toLowerCase())) {
      const sd = await serverFind(msg.guild.id);
      const { partner } = require(`../../languages/${sd.lang || "ru"}`);
      if (msg.author.id !== msg.guild.ownerId) return error(msg, sd.lang === "en" ? "You are not owner of this server." : "Ты не владелец этого сервера.");
      if (!args[1]) return await missingArgument(msg, sd.lang === "en" ? "Specify a partner-code." : "Укажите партнер-код.", `${this.config.name} ${partner.usage}`, this.config.examples);
      return await Partner(bot, msg).serverCode(args[1]);
    }

    Partner(bot, msg).getData()

  }
}