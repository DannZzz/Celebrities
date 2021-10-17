const heroes = require('../../JSON/heroes.json');
const { main } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed } = require("discord.js");
const { COIN, AGREE, STAR } = require("../../config");
const { addStar, bagFind, rpgFind } = require("../../functions/models");
const {error, embed, perms, firstUpperCase, randomRange} = require("../../functions/functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);
const ITEMS = require('../../JSON/items');

module.exports = {
  config: {
    name: "use",
    aliases: ['использовать'],
    category: 'h_roleplay',
    cooldown: 1.5
  },
  run: async (bot, message, args) => {

    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {use: u, buy: b, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   

    const user = message.author;
    const profile = await pd.findOne({userID: user.id});
    if (!isNaN(args[0])) {
        const numbs = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
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
        if (it == 9) item = ITEMS.tempPack
        if (it == 10) item = ITEMS.donateBox
        if (it == 11) item = ITEMS.goldBox
        
        const rp = await rpg.findOne({userID: user.id});
        if (rp[item.name] === 0 || rp[item.name] === undefined) return error(message, u.err);

        if (it == 1) {
            const random = Math.floor(Math.random() * 40);
            const randomStar = randomRange(item.min, item.max);
            let prize;
            if ( random <= 2 ) {
                prize = ITEMS.lvl;
                await rpg.updateOne({userID: user.id}, {$inc: {lvl: 1}});
            } else if ( random <= 5 ) {
                prize = ITEMS.meat;
                await rpg.updateOne({userID: user.id}, {$inc: {meat: 1}});
            } else if (random <= 20) {
                prize = ITEMS.hlt;
                await rpg.updateOne({userID: user.id}, {$inc: {hlt: 1}});
            } else if ( random <= 40) {
                prize = ITEMS.dmg;
                await rpg.updateOne({userID: user.id}, {$inc: {dmg: 1}});
            }

            await rpg.updateOne({userID: user.id}, {$inc: {box: -1}});
            await bd.updateOne({userID: user.id}, {$inc: {stars: randomStar}})
            return embed(message, u.boxDone + ` ${prize.emoji}, ${randomStar} ${STAR}`, false)
        } else if (it == 2) {
            let val = 1
            if (args[1] && args[1].toLowerCase() === "all") val = rp[item.name] 
            if (!rp.item) return error(message, hm.noHero)
            await rpg.updateOne({userID: user.id}, {$inc: {hlt: -val}});

            let getItem = rp.heroes;

            let get = rp.heroes.findIndex(x => x.name === rp.item) 
            const heroType = heroes[rp.item];
            let effect = item.effect
            if (heroType.type === "mythical") effect = effect / 2;
            if (heroType.type === "furious") effect = effect / 4 * 3;
            
             
            await rpg.findOneAndUpdate({userID: user.id}, {$inc: {[`heroes.${get}.health`]: effect * val}});
            
            return message.react(AGREE)
        } else if (it == 3) {
            let val = 1
            if (args[1] && args[1].toLowerCase() === "all") val = rp[item.name] 
            if (!rp.item) return error(message, hm.noHero)
            await rpg.updateOne({userID: user.id}, {$inc: {dmg: -val}});

            let get = rp.heroes.findIndex(x => x.name === rp.item)
            const heroType = heroes[rp.item];
            let effect = item.effect
            if (heroType.type === "mythical") effect = effect / 2;
            if (heroType.type === "furious") effect = effect / 4 * 3;

            await rpg.findOneAndUpdate({userID: user.id}, {$inc: {[`heroes.${get}.damage`]: effect * val}});
            return message.react(AGREE)
        } else if (it == 4) {
            let val = 1
            if (args[1] && args[1].toLowerCase() === "all") val = rp[item.name]
            if (!rp.item) return error(message, hm.noHero)
            await rpg.updateOne({userID: user.id}, {$inc: {lvl: -val}});
            const heroType = heroes[rp.item];

            let addH = getUpgrade(heroType.type) * val;
            let addD = (getUpgrade(heroType.type) / 10) * val;
            let leve = item.effect * val;

            let get = rp.heroes.findIndex(x => x.name === rp.item)
            await rpg.findOneAndUpdate({userID: user.id}, {$inc: {[`heroes.${get}.health`]: addH}});
            await rpg.findOneAndUpdate({userID: user.id}, {$inc: {[`heroes.${get}.level`]: leve}});
            await rpg.findOneAndUpdate({userID: user.id}, {$inc: {[`heroes.${get}.damage`]: addD}});
            
            return message.react(AGREE)
        } else if (it == 5) {
            let val = 1
            if (args[1] && args[1].toLowerCase() === "all") val= rp[item.name] 
            if (!rp.item) return error(message, hm.noHero)
            await rpg.updateOne({userID: user.id}, {$inc: {meat: -val}});

            let get = rp.heroes.findIndex(x => x.name === rp.item)
            await rpg.findOneAndUpdate({userID: user.id}, {$inc: {[`heroes.${get}.health`]: item.effect * val}});
            
            return message.react(AGREE)
        } else if (it == 6) {
            const rew = await getValidHero(user, item.list);
            if (!rew) return error(message, b.already);
            const hero = heroes[rew];
            if (rp.heroes.length === rp.itemCount) return error(message, b.place)
            let get = rp.heroes.find(x => x.name === hero.name)
            if (get) return error(message, b.already)
            
            await rpg.updateOne({userID: user.id}, {$inc: {pack1: -1}});
            await rpg.findOneAndUpdate({userID: user.id}, {$set: {item: hero.name}});

            await rp.heroes.push({
            name: hero.name,
            health: hero.health,
            damage: hero.damage,
            level: 1
            })
            rp.save()
        
            
            return embed(message, u.hero(LANG.lang === "ru" ? hero.nameRus : hero.name))
        } else if (it == 7) {
            const rew = await getValidHero(user, item.list);
            if (!rew) return error(message, b.already);
            const hero = heroes[rew];
            if (rp.heroes.length === rp.itemCount) return error(message, b.place)
            let get = rp.heroes.find(x => x.name === hero.name)
            if (get) return error(message, b.already)

            await rpg.updateOne({userID: user.id}, {$inc: {pack2: -1}});
            await rpg.findOneAndUpdate({userID: user.id}, {$set: {item: hero.name}});

            await rp.heroes.push({
            name: hero.name,
            health: hero.health,
            damage: hero.damage,
            level: 1
            })
            rp.save()
        
            
            return embed(message, u.hero(LANG.lang === "ru" ? hero.nameRus : hero.name))
        } else if (it == 8) {
            const rew = await getValidHero(user, item.list);
            if (!rew) return error(message, b.already);
            const hero = heroes[rew];
            if (rp.heroes.length === rp.itemCount) return error(message, b.place)
            let get = rp.heroes.find(x => x.name === hero.name)
            if (get) return error(message, b.already)
            await rpg.updateOne({userID: user.id}, {$inc: {pack3: -1}});
            await rpg.findOneAndUpdate({userID: user.id}, {$set: {item: hero.name}});

            await rp.heroes.push({
            name: hero.name,
            health: hero.health,
            damage: hero.damage,
            level: 1
            })
            rp.save()
        
            
            return embed(message, u.hero(LANG.lang === "ru" ? hero.nameRus : hero.name))
        } else if (it == 9) {
            const rew = await getValidHero(user, item.list);
            if (!rew) return error(message, b.already);
            const hero = heroes[rew];
            if (rp.heroes.length === rp.itemCount) return error(message, b.place)
            let get = rp.heroes.find(x => x.name === hero.name)
            if (get) return error(message, b.already)
            await rpg.updateOne({userID: user.id}, {$inc: {tempPack: -1}});
            await rpg.updateOne({userID: user.id}, {$inc: {openedPacks: 1}});
            await rpg.findOneAndUpdate({userID: user.id}, {$set: {item: hero.name}});

            await rp.heroes.push({
            name: hero.name,
            health: hero.health,
            damage: hero.damage,
            level: 1
            })
            rp.save()
        
            
            return embed(message, u.hero(LANG.lang === "ru" ? hero.nameRus : hero.name));
        } else if (it == 10) {
            const random = Math.round(randomRange(50000, 200000));
            await rpg.updateOne({userID: user.id}, {$inc: {donateBox: -1}});

            await addStar(user.id, random)
            return embed(message, `${random} ${STAR}`, false);
        } else if (it == 11) {
            await rpg.updateOne({userID: id}, {$inc: {goldBox: -1}})

            await rpg.updateOne({userID: user.id}, {$inc: {
                box: item.list[0],
                hlt: item.list[1],
                dmg: item.list[2]
            }});
            message.react(AGREE)
        }

    } else {
        error(message, cm.specN)
    }
   
  }
}

async function donateReward (message, id, arr, lang) {
    function getReward (array) {
        const random = Math.floor(Math.random() * array.length);
        return array[random];
    }

    const reward = getReward(arr);
    if (reward === "premium") {
        const data = await bagFind(id);
        if (data.vip2) return await donateReward (message, id, arr, lang)
        await rpg.updateOne({userID: id}, {$inc: {goldBox: -1}})
        await bd.updateOne({userID: id}, {$set: {vip1: true, vip2: true}});
        return embed(message, lang === "ru" ? "Вы получили __Премиум__!" : "You got __Premium__!");
    } 
    const random = randomRange(200, 650);
    await rpg.updateOne({userID: id}, {$inc: {goldBox: -1}})
    await rpg.updateOne({userID: id}, {$inc: {box: random}});
    return embed(message, lang === "ru" ? `Вы получили ${random} ${ITEMS.box.emoji}` : `You got ${random} ${ITEMS.box.emoji}`)
};

async function getValidHero (user, arr) {
    const data = await rpgFind(user.id);
    const newArr = arr.map((i) => {
        const ifif = data.heroes.find(x => x.name === i);
        if (!ifif) return i;
    })
    if (!newArr || newArr.length === 0) return false;

    const randomChoice = Math.floor(Math.random() * newArr.length);
    return newArr[randomChoice] || newArr[0];

}

function getUpgrade (type) {
    switch (type) {
      case "common":
        return 150;
      case "elite":
        return 250;
      case "furious":
        return 320;
      case "mythical":
        return 500;
      case "private":
        return 400;
      default:
        return;
    }
  }