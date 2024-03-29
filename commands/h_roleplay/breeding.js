const { main, reddark } = require('../../JSON/colours.json');
const heroes = require('../../JSON/heroes.json');
const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require("discord.js");
const { STAR, AGREE } = require("../../config");
const { error, embed, perms, firstUpperCase, makeTimestamp, delay, roundFunc, getHeroData, missingArgument } = require("../../functions/functions");
const { serverFind, rpgFind, addStar, bagFind, rpg, profileFind, profile, addPremiumStar } = require("../../functions/models");
const Breeding = require("../../functions/breedingClass");

module.exports = {
  config: {
    name: "breeding",
    category: "h_roleplay",
    aliases: ["скрещивания", "разведения"],
    examples: ["breeding Zeenou Poseidon"]
  },
  run: async function (bot, msg, args, ops) {

    const server = msg.guild;
    const user = msg.author;
    const channel = msg.channel;
    const sd = await serverFind(server.id);
    const { breeding } = require(`../../languages/${sd.lang || "ru"}`);
    const lists = ["лист", "list"];
    
    if (args[0] && !lists.includes(args[0].toLowerCase())) {
        if (!args[1]) {
            return await missingArgument(msg, `${sd.lang === "en" ? "Specify heroes!" : "Укажите героев!"}`, `${this.config.name} ${breeding.usage}`, this.config.examples);
        } else {
            const data = await rpgFind(user.id);
            if (args[0].toLowerCase() === args[1].toLowerCase()) return error(msg, `${sd.lang === "en" ? "Specify other heroes!" : "Укажите других героев!"}`);
            const get1 = data.heroes.find(x => x.name === firstUpperCase(args[0].toLowerCase()));
            const get2 = data.heroes.find(x => x.name === firstUpperCase(args[1].toLowerCase()));
            if (!get1 || !get2) return await missingArgument(msg, `${sd.lang === "en" ? "Specify heroes!" : "Укажите героев!"}`, `${this.config.name} ${breeding.usage}`, this.config.examples);
            return await Breeding(bot, msg, sd).addBreeding(heroes[get1.name], heroes[get2.name]);
        }
    } else if (args[0] && lists.includes(args[0].toLowerCase())) {
      return Breeding(bot, msg, sd).list();
    }

    await Breeding(bot, msg, sd).createInterface();

  }
}
