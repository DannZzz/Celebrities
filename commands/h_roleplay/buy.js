const pd = require("../../models/profileSchema");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);
const ITEMS = require('../../JSON/items');
const { serverFind, bagFind, rpgFind, bag : bd, rpg, profileFind } = require("../../functions/models");
const { error, embed } = require("../../functions/functions");
const { main, none } = require("../../JSON/colours.json");
const heroes = require("../../JSON/heroes.json");
const {tempPack: tm} = require("../../JSON/items");
const { AGREE, DISAGREE, STAR } = require("../../config");
const { MessageEmbed, MessageSelectMenu, MessageActionRow } = require("discord.js");

module.exports = {
  config: {
    name: "buy",
    aliases: ['get', "купить"],
    category: 'h_roleplay'
  },
  run: async (bot, message, args, ops) => {
    

    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {quiz, heroes: hh, buy: b, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   
   
    const items = ["Horus", "Thoth-amon", "Anubis", "Sebek", "Hathor", "Supernatural-ramses", "Broken", "Hunter", "Mistress-forest", "Snake-woman", "Blazer", "Athena", "Atalanta", "Kumbhakarna", "Zeenou", "Dilan", "Darius", "Selena", "Cthulhu", "Zeus", "Perfect-duo", "Eragon", "Ariel", "Archangel", "Darkangel"];
    const user = message.author;
    const coinData = await pd.findOne({userID: user.id});
    let rp = await rpg.findOne({userID: user.id});
    if (!rp) {
      let newData = await rpg.create({
        userID: user.id,
        surviveLevel: 1
      });
      newData.save()
    }
    const heros = ["hero", "герой"];
    rp = await rpg.findOne({ userID: user.id });
    let bag = await bd.findOne({ userID: user.id });
    let profile = await pd.findOne({ userID: user.id });
    
    
    if (!args[0]) return error(message, b.specHero)

    if (!isNaN(args[0])) {
      const numbs = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
      if (!numbs.includes(args[0])) return error(message, b.itemErr);
      let item;
      let value = 1
      if (args[1] || !isNaN(args[1])) value = Math.round(args[1]) 
      const it = args[0]
      if (it == 1) item = ITEMS.box
      if (it == 2) item = ITEMS.hlt
      if (it == 3) item = ITEMS.dmg
      if (it == 4) item = ITEMS.lvl
      if (it == 5) item = ITEMS.meat
      if (it == 6) item = ITEMS.pack1
      if (it == 7) item = ITEMS.pack2
      if (it == 8) item = ITEMS.pack3
      if (it == 9) item = ITEMS.tempPack
      if (!item.cost) return error(message, b.noItem);
      const getCost = value * item.cost
      if (bag.stars < getCost) return error(message, noStar);

      await bd.updateOne({userID: user.id}, {$inc: {stars: -getCost}});

      if (it == 1) await rpg.updateOne({userID: user.id}, {$inc: {box: value}});
      if (it == 2) await rpg.updateOne({userID: user.id}, {$inc: {hlt: value}});
      if (it == 3) await rpg.updateOne({userID: user.id}, {$inc: {dmg: value}});
      if (it == 4) await rpg.updateOne({userID: user.id}, {$inc: {lvl: value}});
      if (it == 5) await rpg.updateOne({userID: user.id}, {$inc: {meat: value}});
      if (it == 6) await rpg.updateOne({userID: user.id}, {$inc: {pack1: value}});
      if (it == 7) await rpg.updateOne({userID: user.id}, {$inc: {pack2: value}});
      if (it == 8) await rpg.updateOne({userID: user.id}, {$inc: {pack3: value}});
      if (it == 9) await rpg.updateOne({userID: user.id}, {$inc: {tempPack: value}});
      
      

      return message.react(AGREE)
    }
    
    if(args[0].toLowerCase() === "slot" || args[0].toLowerCase() === "place") {
      if((bag["vip2"] && rp.itemCount !== 10) || (!bag["vip2"] && rp.itemCount !== 5)) {
        if(bag.stars >= 2000 * (rp.itemCount || 1)) {
          await bd.updateOne({userID: message.author.id}, {$inc: {stars: -(2000 * (rp.itemCount || 1))}})
          await rpg.updateOne({userID: message.author.id}, {$inc: {itemCount: 1}})
          return embed(message, b.donePlace)
        } else {
          return error(message, noStar + ` ${2000 * (rp.itemCount || 1)} ${STAR}`)
        }
      } else if(!bag["vip2"] && rp.itemCount === 5) {
        return error(message, vipTwo)
      } else {
        return error(message, b.errPlace)
      }
    }

   
    if ( heros.includes(args[0].toLowerCase())) {
      const curr = ops.buying.get(message.author.id);
      if (curr) return
      ops.buying.set(message.author.id, {action: "buying"});
      let bool = false;
      const msg = message;
      const user = msg.author;
      const server = msg.guild;
      const serverData = await serverFind(server.id);
      const ln = serverData.lang;
      const coinData = await profileFind(user.id);
      const rp = await rpgFind(user.id);
      const bag = await bagFind(user.id);
      
      const { buy: b, heroModel: hm, heroes: hh } = require(`../../languages/${ln}`);

      const heroArr = [];
      for (let item in heroes) {
          var hero = heroes[item];
          heroArr.push({
              label: `${ln === "en" ? hero.name : hero.nameRus} ${cMar(hero.marry)} ${cVip(hero.vip)}`,
              value: hero.name,
              description: `${hh.cost} ${cCost(hero.cost)}`,
              emoji: cType(hero.costType, hero.available)
          })

      }
      const emb = new MessageEmbed()
      .setColor(none)
      
      const cont = ln === "ru" ? "https://i.ibb.co/z2Q3srW/buyRU.gif" : "https://i.ibb.co/4ZtRfsw/buyEN.gif";
      
      const select = new MessageActionRow()
          .addComponents(
              new MessageSelectMenu()
                  .setCustomId("first-menu")
                  .setPlaceholder(b.pick)
                  .addOptions([heroArr])
          )

      const filter = (i) => i.isSelectMenu() && i.user.id === user.id;
      const mms = await msg.channel.send({content: cont, components: [select]});
      
      const collector = await mms.createMessageComponentCollector({
          filter,
          max: "1",
          time: 45000
      });
      collector.on("collect", async (i) => {
          const val = i.values[0];
          const item = heroes[val];
          i.deferUpdate();
          if (!mms.deleted) mms.delete();
          bool = true;
          ops.buying.delete(message.author.id);
          if (item.vip === true) {
              if(bag["vip2"] !== true) {
              return error(msg, b.vip);
              }
          }

          if (item.marry === true && !coinData.marryID) return error(msg, b.love)

          if (rp.heroes.length === rp.itemCount) return error(msg, b.place)
          const idk = rp.heroes.find(x => x.name === val) 
          if (idk) return error(msg, b.already)

          if (item.costType === "star") {
              const stars = bag.stars
              if (item.cost > stars) {
              return error(msg, b.error);
              }
              await bd.findOneAndUpdate({userID: user.id}, {$inc: {stars: -item.cost}});
              await rpg.findOneAndUpdate({userID: user.id}, {$set: {item: val}});

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

      collector.on("end", async (i) => {
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
          let res = bool ? '-VIP-' : ''
          return res;
        }
        function cType(type, ava) {
          if(type === 'star') {return STAR}
           else {
               if(ava === "пак") {
                   return tm.emoji;
               } else if (ava === "Под") {
                   return "<:danncrown:880492405390979132>";
               } else if (ava === "Донат") {
                   return "💵";
               }
          } 
      }
  
    }
    
  }
};
