const heroes = require('../../JSON/heroes.json');
const { main, reddark } = require('../../JSON/colours.json');
const elements = require('../../JSON/elements.json');
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { COIN, STAR, LEFT, RIGHT, DLEFT, FORCE, DRIGHT, CANCEL, heroType, CRYSTAL, AGREE, DISAGREE } = require("../../config");
const { error, paginationBig, forceGenerator, formatNumber, pagination } = require("../../functions/functions");
const Subs = require("../../functions/subscriptionClass");

module.exports = {
  config: {
    name: "heroes",
    aliases: ['герои'],
    category: 'h_roleplay',
    cooldown: 15
  },
  run: async (bot, message, args) => {

    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({ serverID: message.guild.id });
    const { timeOut, ERROR, interError, heroes: hh, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar } = require(`../../languages/${LANG.lang}`);
    const msg = message;
    const ARGS = ["list"];
    if (args[0] && ARGS.includes(args[0].toLowerCase())) {
      let arr = [];
      ["common", "elite", "furious", "mythical", "private"].forEach(t => {
        const emb = new MessageEmbed()
          .setColor(main)
          .setTitle(heroType[t] + (LANG.lang === "en" ? "Heroes" : "Герои"))
        let text = []
        for (let i in heroes) {
          const item = heroes[i];
          let checkingBreeding = true;
          if (item.available === "Под" || item.blockBreeding) checkingBreeding = false;
          let textedElements = item.elements.map(el => elements[el].emoji).join(" ")
          if (item.type === t) text.push(`${textedElements} ${item.name} (${item.nameRus}) ${checkingBreeding ? "❤" : "💔"}`)
        }
        emb.setDescription(`${text.join("\n")}`)
        return arr.push(emb)
      });

      const ll = new MessageButton()
      .setCustomId("lefttt")
      .setStyle("SECONDARY")
      .setEmoji(LEFT)

    const rr = new MessageButton()
      .setCustomId("righttt")
      .setStyle("SECONDARY")
      .setEmoji(RIGHT)

      return await pagination(message, arr, [ll, rr], 100000, [msg.author.id]);
    }

    const common = new MessageButton()
      .setCustomId("COMMON")
      .setStyle("PRIMARY")
      .setEmoji(heroType.common)

    const elite = new MessageButton()
      .setCustomId("ELITE")
      .setStyle("PRIMARY")
      .setEmoji(heroType.elite)

    const furious = new MessageButton()
      .setCustomId("FURIOUS")
      .setStyle("PRIMARY")
      .setEmoji(heroType.furious)

    const mythical = new MessageButton()
      .setCustomId("MYTHICAL")
      .setStyle("PRIMARY")
      .setEmoji(heroType.mythical)

    const private = new MessageButton()
      .setCustomId("PRIVATE")
      .setStyle("PRIMARY")
      .setEmoji(heroType.private)

    const buttonList = [common, elite, furious, mythical, private];

    const firstEmbed = new MessageEmbed()
      .setColor(main)
      .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
      .setTitle(LANG.lang === "ru" ? "Выберите тип героев" : "Choose hero type")
      .setDescription(`${heroType.common} : ${hm.common}\n${heroType.elite} : ${hm.elite}\n${heroType.furious} : ${hm.furious}\n${heroType.mythical} : ${hm.mythical}\n${heroType.private} : ${hm.private}`)

    const row = new MessageActionRow().addComponents(buttonList);

    const firstMsg = await msg.channel.send({ embeds: [firstEmbed], components: [row] });
    const collectorType = await msg.channel.createMessageComponentCollector({
      filter: i => {
        if (i.user.id === message.author.id && (i.customId === common.customId || i.customId === elite.customId || i.customId === furious.customId || i.customId === mythical.customId || i.customId === private.customId)) {
          return true;
        } else {
          const intEmbed = new MessageEmbed()
            .setColor(reddark)
            .setTitle(ERROR)
            .setDescription(interError)

          return i.reply({ embeds: [intEmbed], ephemeral: true })
        }
      },
      time: 20000
    });
    let bool = false;
    collectorType.on("collect", async i => {
      i.deferUpdate();
      bool = true;
      collectorType.stop();

      let newdr = []
      for (let key in heroes) {
        var obj = heroes[key];
        if (obj.type === i.customId.toLowerCase()) {
          let level = undefined;
          if (obj.subLevel) {
            level = await Subs(bot, message, obj.name).getStringById(obj.subLevel);
          }

          let ccost = `${cCost(obj.cost, obj)} ${cType(obj.costType)}`;
          if (!isNaN(obj.cost) && obj.cost <= 0) ccost = LANG.lang === "ru" ? "Бесплатно" : "Free";

          let textedElements = obj.elements.map(el => elements[el].emoji).join(" ");
          let checkingBreeding = true;
          if (obj.available === "Под" || obj.blockBreeding) checkingBreeding = false;

          newdr.push(
            new MessageEmbed()
              .setColor(main)
              .setTitle(`${heroType[obj.type]} ${obj.name} (${obj.nameRus}) ${cMar(obj.marry)} ${cVip(obj.vip)}\n${FORCE} ${hm.force} ${forceGenerator(obj.health, obj.damage, 1)}\n${LANG.lang === "en" ? "Elements:" : "Стихия:"} ${textedElements}`)
              .setThumbnail(obj.url)
              .setDescription(`${level ? `**${level}**` : ""}\n${LANG.lang === "en" ? "Breeding:" : "Скрещивание:"} ${checkingBreeding ? AGREE : DISAGREE}`)
              .addField(`${hh.cost} ${ccost}`, `**${hh.avail} ${cAv(obj.available)}**`, true)
              .addField(`${hm.health} ${formatNumber(obj.health)} ❤`, `**${hm.damage} ${formatNumber(obj.damage)}** ⚔`, true)
          )
        }
      }



      const timeout = 100000;
      const userids = [message.author.id]
      const button1 = new MessageButton()
        .setCustomId('previousbtn')
        .setEmoji(LEFT)
        .setStyle('SECONDARY');

      const button0 = new MessageButton()
        .setCustomId('0btn')
        .setEmoji(DLEFT)
        .setStyle('SECONDARY');

      const buttonlast = new MessageButton()
        .setCustomId('lastbtn')
        .setEmoji(DRIGHT)
        .setStyle('SECONDARY');

      const button2 = new MessageButton()
        .setCustomId('nextbtn')
        .setStyle('SECONDARY')
        .setEmoji(RIGHT);

      const cancel = new MessageButton()
        .setCustomId('cancel')
        .setStyle('SECONDARY')
        .setEmoji(CANCEL);

      let buttonList = [
        button0,
        button1,
        cancel,
        button2,
        buttonlast
      ]
      paginationBig(message, newdr, buttonList, timeout, userids)

    });

    collectorType.on("end", () => {
      firstMsg.delete();
      if (!bool) return error(message, timeOut);
    });


    // --------------------------------------------------------------------


    function cAv(av) {
      if (av === "Да") {
        return hh.yes
      } else if (av === "Донат") {
        return hh.donate
      } else if (av === "Под") {
        return hh.noavail
      } else if (av === "пак") {
        return hh.pack
      } else if (av === "loc") {
        return hh.loc
      }
    }
    function cCost(cost, obj) {
      if (!isNaN(cost)) {
        return formatNumber(cost);
      } else if (cost.endsWith("₽") && LANG.lang === "ru") {
        return cost
      } else if (cost.endsWith("₽") && LANG.lang === "en") {
        return obj.costUSD;
      } else {
        return hh.nocost
      }
    }
    function cMar(bool) {
      let res = bool ? '💞' : ''
      return res;
    }
    function cVip(bool) {
      let res = bool ? '-PREMIUM-' : ''
      return res;
    }
    function cType(type) {
      if (type === 'star') { return STAR }
      else if (type === "crystal") { return CRYSTAL }
      else {
        return ''
      }
    }
  }
};
