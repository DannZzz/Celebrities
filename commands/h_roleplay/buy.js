const pd = require("../../models/profileSchema");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);
const ITEMS = require('../../JSON/items');
const { event, addCandy, eventFind, addCrystal, serverFind, bagFind, rpgFind, bag: bd, rpg, profileFind, card, cardFind, addStar } = require("../../functions/models");
const { error, embed, firstUpperCase, delay } = require("../../functions/functions");
const { main, none } = require("../../JSON/colours.json");
const cards = require("../../JSON/cards.json");
const heroes = require("../../JSON/heroes.json");
const { tempPack: tm } = require("../../JSON/items");
const { HELL, CRYSTAL, AGREE, DISAGREE, STAR, heroType } = require("../../config");
const { MessageEmbed, MessageSelectMenu, MessageActionRow, MessageButton } = require("discord.js");
const { stripIndents } = require("common-tags");
const Subs = require("../../functions/subscriptionClass");
const EVENT = require("../../functions/eventClass");

module.exports = {
  config: {
    name: "buy",
    aliases: ['get', "купить"],
    category: 'h_roleplay',
    cooldown: 35
  },
  run: async (bot, message, args, ops) => {


    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({ serverID: message.guild.id });
    const { noCandy, noCrystal, cardClass: cc, quiz, heroes: hh, buy: b, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar } = require(`../../languages/${LANG.lang}`);

    //const items = ["Horus", "Thoth-amon", "Anubis", "Sebek", "Hathor", "Supernatural-ramses", "Broken", "Hunter", "Mistress-forest", "Snake-woman", "Blazer", "Athena", "Atalanta", "Kumbhakarna", "Zeenou", "Dilan", "Darius", "Selena", "Cthulhu", "Zeus", "Perfect-duo", "Eragon", "Ariel", "Archangel", "Darkangel"];
    const user = message.author;
    await EVENT(user.id).checkDocument();
    ops.cards.set(user.id, { Card: "on" });
    const ln = LANG.lang || "ru";
    
    const getTime = ops.buy2.get(user.id);
    setTimeout(() => ops.buy2.delete(user.id), 35000);

    setTimeout(() => ops.cards.delete(user.id), 32000);
    if (getTime) return;

    const coinData = await pd.findOne({ userID: user.id });
    let rp = await rpg.findOne({ userID: user.id });
    if (!rp) {
      let newData = await rpg.create({
        userID: user.id,
        surviveLevel: 1
      });
      newData.save()
    }
    const heros = ["hero", "герой"];
    const candies = ["candy", "конфеты"];
    const golds = ["golds", "голды", "gold", "голда", "золото", "золота"];
    rp = await rpg.findOne({ userID: user.id });
    let bag = await bd.findOne({ userID: user.id });
    let profile = await pd.findOne({ userID: user.id });
    const menuArray = [];
    const ended = ["tempPack"]
    if (!args[0]) {
      ops.buy2.set(user.id, { id: "yes" });
      for (let itemm in ITEMS) {
        const item = ITEMS[itemm]
        if(!ended.includes(item.name)) {   
            menuArray.push({
              label: LANG.lang === "en" ? item.NAMEEN : item.NAME,
              description: `${LANG.lang === "en" ? "Cost:" : "Цена:"} ${item.cost || "—"}`,
              value: item.name,
              emoji: item.emoji
            });
        }

      }

      const row = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
            .setCustomId("gettingItem")
            .setPlaceholder(b.specHero)
            .addOptions([menuArray])
        );

      const first = await message.channel.send({ content: "ㅤ", components: [row] })

      const collector = message.channel.createMessageComponentCollector({
        filter: i => i.isSelectMenu() && i.user.id === message.author.id,
        time: 15000,
        max: "1"
      })
      let bool = false;
      collector.on("collect", async i => {
        bool = true;
        first.delete();
        collector.stop();

        const need = ITEMS[i.values[0]];
        if (!need.cost) return error(message, b.noItem);

        const req = await message.channel.send(b.req);
        const newCollector = message.channel.createMessageCollector({
          filter: m => m.author.id === message.author.id,
          time: 10000
        });
        let bool2 = false;
        newCollector.on("collect", async m => {
          if (!isNaN(m.content) && Math.round(m.content) >= 1) {
            m.delete();
            req.delete()
            bool2 = true;
            newCollector.stop();
            const count = Math.round(m.content);
            const amount = count * need.cost;

            if (need.costType && need.costType === "candy") {
              const random = Math.ceil(Math.random() * 5);
              const mm = await message.channel.send(cc.wait);
              await delay(random * 1000)
              mm.delete();
              const newData = await eventFind(user.id);
              if (amount > newData.candy) return error(message, noCandy);
              await event.updateOne({userID: user.id}, {$inc: {candyBox: count}});
              await addCandy(user.id, -amount);
              return embed(message, cc.done2);
            }

            const newRow = await getCardMenu(message);

            const newMsg = await message.channel.send({ content: b.need + ` ${amount} ${STAR}`, components: [newRow] });

            const lastCollector = await message.channel.createMessageComponentCollector({
              filter: i => i.isSelectMenu() && i.user.id === message.author.id,
              time: 10000,
              max: "1"
            });
            let bool3 = false;
            lastCollector.on("collect", async i => {
              bool3 = true;
              ops.buy2.delete(user.id);
              lastCollector.stop();
              newMsg.delete();
              const val = i.values[0];
              if (val === "golds") {
                const random = Math.ceil(Math.random() * 5);
                const mm = await message.channel.send(cc.wait);
                await delay(random * 1000)
                mm.delete();
                const myData = await bagFind(message.author.id);
                if (myData.stars < amount) return error(message, noStar);
                await rpg.updateOne({ userID: message.author.id }, { $inc: { [need.name]: count } });
                await bd.updateOne({ userID: message.author.id }, { $inc: { stars: -amount } });
                return embed(message, cc.done2);
              } else {
                const random = Math.ceil(Math.random() * 5);
                const mm = await message.channel.send(cc.wait);
                await delay(random * 1000)
                mm.delete();
                let data = await cardFind(message.author.id, val);
                if (data.amount < amount) return error(message, noStar);
                await rpg.updateOne({ userID: message.author.id }, { $inc: { [need.name]: count } });
                await card.updateOne({ userID: message.author.id, code: data.code }, { $inc: { amount: -amount } });
                return embed(message, cc.done2);
              }
            });

            lastCollector.on("end", () => {
              ops.cards.delete(user.id);
              if (!bool3) {
                ops.buy2.delete(user.id);
                newMsg.delete();
                return error(message, cc.timeOut)
              }
            })

          }
        });

        newCollector.on("end", () => {
          if (!bool2) {
            ops.buy2.delete(user.id);
            req.delete();
            ops.cards.delete(user.id);
            return error(message, cc.timeOut)
          }
        })

      })

      collector.on("end", () => {
        if (!bool) {
          ops.cards.delete(user.id);
          ops.buy2.delete(user.id);

          first.delete();
          return error(message, cc.timeOut)
        }
      })


      return
      
    }

    if (golds.includes(args[0].toLocaleLowerCase())) {
      let numb = 1;
      if (args[1] && !isNaN(args[1]) && Math.round(args[1]) >= 1) numb = Math.round(args[1]);

      const one = 5000;
      if (numb < one) numb = one;
      
      if (!bag.crystal || bag.crystal < Math.round(numb/one) ) return error(message, noCrystal);

      await addCrystal(user.id, -(Math.round(numb/one)));
      await addStar(user.id, numb);
      ops.cards.delete(user.id);
      return embed(message, b.event(numb, Math.round(numb/one), STAR, CRYSTAL));
    };

    if (candies.includes(args[0].toLocaleLowerCase())) {
      let numb = 1;
      if (args[1] && !isNaN(args[1]) && Math.round(args[1]) >= 1) numb = Math.round(args[1]);

      const one = 10;
      if (numb < one) numb = one;
      
      if (!bag.crystal || bag.crystal < Math.round(numb/one) ) return error(message, noCrystal);

      await addCrystal(user.id, -(Math.round(numb/one)));
      await addCandy(user.id, numb);
      ops.cards.delete(user.id);
      return embed(message, b.event(numb, Math.round(numb/one), HELL.candy, CRYSTAL));
    }
    

    if (heros.includes(args[0].toLowerCase())) {
      ops.cards.delete(user.id);
      const curr = ops.buying.get(message.author.id);
      if (curr) return
      ops.buying.set(message.author.id, { action: "buying" });
      let bool = false;

     
      const msg = message;

        const coinData = await profileFind(user.id);
        const rp = await rpgFind(user.id);
        const bag = await bagFind(user.id);

        const { buy: b, heroModel: hm, heroes: hh } = require(`../../languages/${ln}`);
        const emb = new MessageEmbed()
          .setColor(none)
          .setImage(ln === "ru" ? "https://i.ibb.co/z2Q3srW/buyRU.gif" : "https://i.ibb.co/4ZtRfsw/buyEN.gif")
          .setAuthor(user.tag, user.displayAvatarURL({dynamic: true}))
          .setDescription(ln === "ru" ? "Напишите название героя на английском!" : "Write a hero name.")

        const filter = (m) => m.author.id === user.id;
        const mms = await msg.reply({embeds: [emb]});
        const collector = await msg.channel.createMessageCollector({
          filter,
          time: 20000
        });
        collector.on("collect", async (m) => {
          const val = firstUpperCase(m.content.toLowerCase());
          const item = heroes[val];
          if (!mms.deleted) mms.delete();
          bool = true;
          ops.buying.delete(message.author.id);
          if (item.vip === true) {
            if (bag["vip2"] !== true) {
              return error(msg, b.vip);
            }
          }

          if (item.marry === true && !coinData.marryID) return error(msg, b.love);

          const sub = Subs(bot, msg, item.name).heroHighSubLevel();
          if (!sub) return error(msg, `${b.subError} **${await Subs(bot, msg, item.name).getStringById(item.subLevel)}**`);

          const idk = rp.heroes.find(x => x.name === val)
          if (idk) return error(msg, b.already)

          if (item.costType === "star") {
            const stars = bag.stars
            if (item.cost > stars) {
              return error(msg, b.error);
            }
            await bd.findOneAndUpdate({ userID: user.id }, { $inc: { stars: -item.cost } });
            await rpg.findOneAndUpdate({ userID: user.id }, { $set: { item: val } });

            await rp.heroes.push({
              name: val,
              health: item.health,
              damage: item.damage,
              level: 1
            })
            rp.save()

            return embed(msg, b.done(ln === "ru" ? item.nameRus : item.name));
          } else if (item.costType === "crystal") {
            const crystals = bag.crystal || 0;
            if (item.cost > crystals) {
              return error(msg, noCrystal);
            }

            await addCrystal(user.id, -item.cost)
            await rpg.updateOne({ userID: user.id }, { $set: { item: val } });

            await rp.heroes.push({
              name: val,
              health: item.health,
              damage: item.damage,
              level: 1
            })
            rp.save()

            return embed(msg, b.done(ln === "ru" ? item.nameRus : item.name));
          } else {
            return error(msg, b.not);
          }


        });

        collector.on("end", async () => {
          if (!bool) {
            if (!mms.deleted) mms.delete()
            ops.buying.delete(message.author.id);
            return error(msg, quiz.err)
          }
        })
      


      function cAv(av) {
        if (av === "Да") {
          return hh.yes
        } else if (av === "Донат") {
          return hh.donate
        } else if (av === "Под") {
          return hh.noavail
        } else if (av === "пак") {
          return hh.pack
        }
      }
      function cCost(cost) {
        if (!isNaN(cost)) {
          return cost
        } else if (cost.endsWith("₽") && ln === "ru") {
          return cost
        } else if (cost.endsWith("₽") && ln === "en") {
          return "1,1$"
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
      function cType(type, ava) {
        if (type === 'star') { return STAR }
        else if (type === "crystal") { return CRYSTAL }
        else {
          if (ava === "пак") {
            return tm.emoji;
          } else if (ava === "Под") {
            return "<:danncrown:880492405390979132>";
          } else if (ava === "Донат") {
            return "💵";
          }
        }
      }

    } else {
      return error(message, `\`${LANG.prefix}buy hero\``);
    }



  }
};

async function getCardMenu(msg) {
  const ln = await serverFind(msg.guild.id);
  const { cardClass: cc } = require(`../../languages/${ln.lang}`);

  const mine = await card.find({ userID: msg.author.id }).exec();
  let options = [];
  if (mine && mine.length !== 0) {
    options.push(mine.map(data => {
      const cardName = cards[data.name];
      return {
        label: ln.lang === "en" ? firstUpperCase(cardName.name) + " Card" : firstUpperCase(cardName.nameRus) + " Карта",
        value: cardName.name,
        description: `${cc.bal} ${Math.round(data.amount)}`,
        emoji: cardName.emoji
      }
    }));
  }

  const myData = await bagFind(msg.author.id);
  options.unshift(
    {
      label: ln.lang === "en" ? "Golds" : "Голды",
      value: "golds",
      description: `${cc.bal} ${Math.round(myData.stars)}`,
      emoji: STAR
    }
  )

  return new MessageActionRow()
    .addComponents(
      new MessageSelectMenu()
        .setCustomId("buying")
        .setPlaceholder(cc.chs)
        .addOptions([options])
    )
}