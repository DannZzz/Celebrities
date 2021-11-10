const { main, reddark } = require('../../JSON/colours.json');
const heroes = require('../../JSON/heroes.json');
const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require("discord.js");
const { STAR, AGREE, CRYSTAL } = require("../../config");
const { stripIndents } = require("common-tags");
const { error, embed, perms, firstUpperCase, makeTimestamp, delay, roundFunc, getHeroData, formatNumber } = require("../../functions/functions");
const { serverFind, rpgFind, addStar, bagFind, rpg, profileFind, profile, addPremiumStar, addCrystal } = require("../../functions/models");
const items = require("../../JSON/items");

module.exports = {
  config: {
    name: "special",
    category: "h_roleplay",
    aliases: ["специальный"],
    cooldown: 17
  },
  run: async (bot, msg, args, ops) => {

    const server = msg.guild;
    const user = msg.author;
    const channel = msg.channel;

    const her = ["Arun", "Montra"];
    const sd = await serverFind(server.id);

    let rp = await rpgFind(user.id);

    const { ERROR, interError, noCrystal, timeOut } = require(`../../languages/${sd.lang || "ru"}`);
    
    const get1 = rp.heroes.find(x => x.name === her[0]);
    const get2 = rp.heroes.find(x => x.name === her[1]);
    
    const hd1 = heroes[her[0]];
    const hd2 = heroes[her[1]];
    const hd3 = heroes["Poseidon"];

    let firstText = `${sd.lang === "en" ? hd1.name : hd1.nameRus} - ~~${hd1.cost}~~ ${hd1.cost / 2} ${CRYSTAL}`;
    let secondText = `${sd.lang === "en" ? hd2.name : hd2.nameRus} - ~~${hd2.cost}~~ ${hd2.cost / 2} ${CRYSTAL}`;
    let totalCost = (hd1.cost / 2) + (hd2.cost / 2);
    
    if (get1) {
        totalCost -= hd1.cost / 2;
        firstText = `${sd.lang === "en" ? hd1.name : hd1.nameRus} - ${sd.lang === "en" ? "You already have this one." : "Ты уже имеешь эту."}`;
    };

    if (get2) {
        totalCost -= hd2.cost / 2;
        secondText = `${sd.lang === "en" ? hd2.name : hd2.nameRus} - ${sd.lang === "en" ? "You already have this one." : "Ты уже имеешь эту."}`;
    };

    const emb = new MessageEmbed()
    .setColor(main)
    .setAuthor(user.tag, user.displayAvatarURL({dynamic: true}))
    .setTitle(sd.lang === "en" ? "Special offer!" : "Специальное предложение!")
    .setDescription(stripIndents`${sd.lang === "en" ? `${hd1.name} ❤ ${hd2.name} --> ${hd3.name}` : `${hd1.nameRus} ❤ ${hd2.nameRus} --> ${hd3.nameRus}`}\n\n${firstText}\n${secondText}\n500 ${items.megabox.emoji}\n\n${sd.lang === "en" ? "Total cost:" : "Общая цена:"} ${totalCost === 0 ? `${sd.lang === "en" ? "You can't buy this offer." : "Ты не сможешь купить этот предложение."}` : `${formatNumber(totalCost)} ${CRYSTAL}`}`);


    const button = new MessageButton()
    .setCustomId("specialOffer")
    .setLabel(`${sd.lang === "ru" ? `Купить за ${totalCost}` : `Buy for ${totalCost}`}`)
    .setStyle("SECONDARY")
    .setEmoji(CRYSTAL);

    const row = new MessageActionRow().addComponents([button]);
    
    const m1 = await msg.reply({embeds: [emb], components: (get1 && get2) ? [] : [row]});
    if (get1 && get2) return;

    const c = await m1.createMessageComponentCollector({
      filter: i => {
        if (i.user.id === user.id && i.customId === button.customId) {
          return true;
        } else if (i.user.id !== user.id && i.customId === button.customId) {
          const intEmbed = new MessageEmbed()
            .setColor(reddark)
            .setTitle(ERROR)
            .setDescription(interError)
          
          return i.reply({embeds: [intEmbed], ephemeral: true})
        }
      },
      time: 15000
    });

    let bool = false;
    c.on("collect", async i => {
      i.deferUpdate();
      bool = true;
      c.stop();
      await delay(2000);
      const bag = await bagFind(user.id);
      if (bag.crystal < totalCost) return error(msg, noCrystal);
      await rpg.updateOne({userID: user.id}, {$inc: {megabox: 500}});
      rp = await rpgFind(user.id);
      if (!get1) {
        rp.heroes.push({
          name: hd1.name,
          health: hd1.health,
          damage: hd1.damage,
          level: 1
        });
      };

      if (!get2) {
        rp.heroes.push({
          name: hd2.name,
          health: hd2.health,
          damage: hd2.damage,
          level: 1
        })
      };
      await addCrystal(user.id, -totalCost);
      await rp.save();
      return msg.react(AGREE);
    });

    c.on("end", () => {
      m1.delete();
      if (!bool) error(msg, timeOut);
      return;
    })
    
  }
}
