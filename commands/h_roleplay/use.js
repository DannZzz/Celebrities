const heroes = require('../../JSON/heroes.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed } = require("discord.js");
const { COIN, AGREE } = require("../../config");
const { checkValue } = require("../../functions");
const {error, embed, perms, firstUpperCase} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);
const ITEMS = require('../../JSON/items');

module.exports = {
  config: {
    name: "use",
    aliases: '',
    category: 'h_roleplay'
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
    if(limited) return

    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {use: u, buy: b, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   

    const user = message.author;
    const profile = await pd.findOne({userID: user.id});
    if (!isNaN(args[0])) {
        const numbs = ["1", "2", "3", "4", "5", "6", "7", "8"];
        if (!numbs.includes(args[0])) return error(message, b.itemErr);
        let item;
        const it = args[0]
        if (it == 1) item = ITEMS.box
        if (it == 2) item = ITEMS.hlt
        if (it == 3) item = ITEMS.dmg
        if (it == 4) item = ITEMS.lvl
        if (it == 5) item = ITEMS.meat
        if (it == 6) item = ITEMS.pack1
        if (it == 7) item = ITEMS.pack2
        if (it == 8) item = ITEMS.pack3
        
        const rp = await rpg.findOne({userID: user.id});
        if (rp.items[0][item.name] === 0 || rp.items[0][item.name] === undefined) return error(message, u.err);

        if (it == 1) {
            const random = Math.floor(Math.random() * 40);
            let prize;
            if ( random < 5 ) {
                prize === ITEMS.lvl
            } else if ( random < 10 ) {
                prize === ITEMS.meat
            } else if (random <= 20) {
                prize === ITEMS.hlt
            } else if ( random <= 40) {
                prize === ITEMS.dmg
            }

            await rpg.updateOne({userID: user.id}, {$inc: {[`items.0.box`]: -1}});
            await rpg.updateOne({userID: user.id}, {$inc: {[`items.0.${prize.name}`]: 1}});
            return embed(message, u.boxDone + ` ${prize.emoji}`, false)
        } else if (it == 2) {
            if (!rp.item) return error(message, hm.noHero)
            await rpg.updateOne({userID: user.id}, {$inc: {[`items.0.hlt`]: -1}});

            let getItem = rp.heroes;
            if(getItem[0]["name"] === rp.item) {
            await rpg.findOneAndUpdate({userID: user.id}, {$inc: {[`heroes.0.health`]: item.effect}});
            } else if(getItem[1]["name"] === rp.item) {
            await rpg.findOneAndUpdate({userID: user.id}, {$inc: {[`heroes.1.health`]: item.effect}});
            }
            await rpg.findOneAndUpdate({userID: user.id}, {$inc: {health: item.effect}});
            return message.react(AGREE)
        } else if (it == 3) {
            if (!rp.item) return error(message, hm.noHero)
            await rpg.updateOne({userID: user.id}, {$inc: {[`items.0.dmg`]: -1}});

            let getItem = rp.heroes;
            if(getItem[0]["name"] === rp.item) {
            await rpg.findOneAndUpdate({userID: user.id}, {$inc: {[`heroes.0.damage`]: item.effect}});
            } else if(getItem[1]["name"] === rp.item) {
            await rpg.findOneAndUpdate({userID: user.id}, {$inc: {[`heroes.1.damage`]: item.effect}});
            }
            await rpg.findOneAndUpdate({userID: user.id}, {$inc: {damage: item.effect}});
            return message.react(AGREE)
        } else if (it == 4) {
            if (!rp.item) return error(message, hm.noHero)
            await rpg.updateOne({userID: user.id}, {$inc: {[`items.0.lvl`]: -1}});

            let addH = 250;
            let addD = 20;

            let getItem = rp.heroes;
            if(getItem[0]["name"] === rp.item) {
            await rpg.findOneAndUpdate({userID: user.id}, {$inc: {[`heroes.0.health`]: addH}});
            await rpg.findOneAndUpdate({userID: user.id}, {$inc: {[`heroes.0.level`]: item.effect}});
            await rpg.findOneAndUpdate({userID: user.id}, {$inc: {[`heroes.0.damage`]: addD}});
            } else if(getItem[1]["name"] === rp.item) {
            await rpg.findOneAndUpdate({userID: user.id}, {$inc: {[`heroes.1.health`]: addH}});
            await rpg.findOneAndUpdate({userID: user.id}, {$inc: {[`heroes.1.level`]: item.effect}});
            await rpg.findOneAndUpdate({userID: user.id}, {$inc: {[`heroes.1.damage`]: addD}});
            }

            await rpg.findOneAndUpdate({userID: user.id}, {$inc: {level: item.effect}});
            await rpg.findOneAndUpdate({userID: user.id}, {$inc: {health: addH}});
            await rpg.findOneAndUpdate({userID: user.id}, {$inc: {damage: addD}});

            
            return message.react(AGREE)
        } else if (it == 5) {
            if (!rp.item) return error(message, hm.noHero)
            await rpg.updateOne({userID: user.id}, {$inc: {[`items.0.meat`]: -1}});

            let getItem = rp.heroes;
            if(getItem[0]["name"] === rp.item) {
            await rpg.findOneAndUpdate({userID: user.id}, {$inc: {[`heroes.0.health`]: item.effect}});
            } else if(getItem[1]["name"] === rp.item) {
            await rpg.findOneAndUpdate({userID: user.id}, {$inc: {[`heroes.1.health`]: item.effect}});
            }
            await rpg.findOneAndUpdate({userID: user.id}, {$inc: {health: item.effect}});
            return message.react(AGREE)
        } else if (it == 6) {
            const rand = Math.floor(Math.random() * item.list.length);
            const hero = heroes[item.list[rand]]
            if (rp.heroes.length >= 2) return error(message, b.place)
            if (rp.heroes.length === 1 && !profile.allowMultiHeroes) return error(message, b.place)

            if (rp.heroes.length === 1 && rp.heroes[0].name === hero.name) return error(message, b.already)

            await rpg.updateOne({userID: user.id}, {$inc: {[`items.0.pack1`]: -1}});
            await rpg.findOneAndUpdate({userID: user.id}, {$set: {item: hero.name}});
            await rpg.findOneAndUpdate({userID: user.id}, {$set: {health: hero.health}});
            await rpg.findOneAndUpdate({userID: user.id}, {$set: {level: 1}});
            await rpg.findOneAndUpdate({userID: user.id}, {$set: {damage: hero.damage}});

            await rp.heroes.push({
            name: hero.name,
            health: hero.health,
            damage: hero.damage,
            level: 1
            })
            rp.save()
        
            
            return embed(message, u.hero(LANG.lang === "ru" ? hero.nameRus : hero.name))
        } else if (it == 7) {
            const rand = Math.floor(Math.random() * item.list.length);
            const hero = heroes[item.list[rand]]
            if (rp.heroes.length >= 2) return error(message, b.place)
            if (rp.heroes.length === 1 && !profile.allowMultiHeroes) return error(message, b.place)

            if (rp.heroes.length === 1 && rp.heroes[0].name === hero.name) return error(message, b.already)

            await rpg.updateOne({userID: user.id}, {$inc: {[`items.0.pack2`]: -1}});
            await rpg.findOneAndUpdate({userID: user.id}, {$set: {item: hero.name}});
            await rpg.findOneAndUpdate({userID: user.id}, {$set: {health: hero.health}});
            await rpg.findOneAndUpdate({userID: user.id}, {$set: {level: 1}});
            await rpg.findOneAndUpdate({userID: user.id}, {$set: {damage: hero.damage}});

            await rp.heroes.push({
            name: hero.name,
            health: hero.health,
            damage: hero.damage,
            level: 1
            })
            rp.save()
        
            
            return embed(message, u.hero(LANG.lang === "ru" ? hero.nameRus : hero.name))
        } else if (it == 8) {
            const rand = Math.floor(Math.random() * item.list.length);
            const hero = heroes[item.list[rand]]
            if (rp.heroes.length >= 2) return error(message, b.place)
            if (rp.heroes.length === 1 && !profile.allowMultiHeroes) return error(message, b.place)

            if (rp.heroes.length === 1 && rp.heroes[0].name === hero.name) return error(message, b.already)

            await rpg.updateOne({userID: user.id}, {$inc: {[`items.0.pack3`]: -1}});
            await rpg.findOneAndUpdate({userID: user.id}, {$set: {item: hero.name}});
            await rpg.findOneAndUpdate({userID: user.id}, {$set: {health: hero.health}});
            await rpg.findOneAndUpdate({userID: user.id}, {$set: {level: 1}});
            await rpg.findOneAndUpdate({userID: user.id}, {$set: {damage: hero.damage}});

            await rp.heroes.push({
            name: hero.name,
            health: hero.health,
            damage: hero.damage,
            level: 1
            })
            rp.save()
        
            
            return embed(message, u.hero(LANG.lang === "ru" ? hero.nameRus : hero.name))
        }

    } else {
        error(message, cm.specN)
    }
   
  }
}