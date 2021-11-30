const { main, reddark } = require('../../JSON/colours.json');
const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require("discord.js");
const { STAR, AGREE } = require("../../config");
const { error, embed, perms, firstUpperCase, makeTimestamp, delay, roundFunc, getHeroData, formatNumber } = require("../../functions/functions");
const { serverFind, rpgFind, addStar, bagFind, rpg, profileFind, profile, addPremiumStar } = require("../../functions/models");
const heroes = require("../../JSON/heroes.json");

module.exports = {
  config: {
    name: "storage",
    category: "h_roleplay",
    aliases: ["хранилище"]
  },
  run: async (bot, msg, args, ops, tr) => {

    const server = msg.guild;
    const user = msg.author;
    const channel = msg.channel;

    const sd = await serverFind(server.id);

    /** storage = [ 
     * {
      * name: Zeenou,
      * count: 1
     * }
     * ]
    *
    */

    const basicEmbed = new MessageEmbed()
    .setColor(main)
    .setAuthor(user.username, user.displayAvatarURL({dynamic: true}))
    .setTitle(await tr("My Storage"))

    let rp = await rpgFind(user.id);
    if (!rp.storage || rp.storage.length === 0) {
      if (!rp.storage) await rpg.updateOne({userID: user.id}, {$set: {storage: []} });
      return msg.reply({embeds: [basicEmbed.setDescription(await tr("Storage is empty!")) ]});
    } else {
      const data = rp.storage;
      const checkedStorage = data.filter(obj => obj.count > 0);
      
      if (checkedStorage.length !== data.length) {
        await rpg.updateOne({userID: user.id}, {$set: {storage: checkedStorage}});
        rp = await rpgFind(user.id);
      };

      const texted = rp.storage.map(({name, count}) => {
        const hero = heroes[name];
        if (hero && count > 0) {
          return `${sd.lang === "en" ? hero.name : hero.nameRus} - ${formatNumber(Math.round(count))}`;
        }
      });

      return msg.reply({embeds: [basicEmbed.setDescription(texted.join("\n"))]});

    };


  }
}