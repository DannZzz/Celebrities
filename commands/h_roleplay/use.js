const heroes = require('../../JSON/heroes.json');
const { main, reddark } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageSelectMenu, MessageActionRow, MessageEmbed } = require("discord.js");
const { COIN, AGREE, STAR } = require("../../config");
const { event, eventFind, addStar, bagFind, rpgFind } = require("../../functions/models");
const {error, embed, perms, firstUpperCase, randomRange} = require("../../functions/functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);
const EVENT = require("../../functions/eventClass");
const ITEMS = require('../../JSON/items');
const { stripIndents } = require("common-tags");

module.exports = {
  config: {
    name: "use",
    aliases: ['использовать'],
    category: 'h_roleplay',
    cooldown: 5
  },
  run: async (bot, message, args, ops) => {

    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {timeOut, ERROR, interError, use: u, buy: b, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   

    const user = message.author;
    const rp = await rpg.findOne({userID: user.id});
    await EVENT(user.id).checkDocument();
    const data = await eventFind(user.id);

    const nowOps = ops.using.get(user.id);
    if (nowOps) return;

    ops.using.set(user.id, {get: "true"});

    let number = 1;
    if (args[0] && !isNaN(args[0]) && Math.round(args[0]) >= 1) number = Math.round(args[0]);

    const arr = [];
    for (let p in ITEMS) {
        const i = ITEMS[p]
        if (i.name !== "halloween") {
            arr.push({
                label: LANG.lang === "en" ? i.NAMEEN : i.NAME,
                value: i.name,
                emoji: i.emoji,
                description: (rp[i.name] || 0) + ""
            });
        } else {
            arr.push({
                label: LANG.lang === "en" ? i.NAMEEN : i.NAME,
                value: i.name,
                emoji: i.emoji,
                description: (data.candyBox || 0) + ""
            });
        }
    };

    const row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
        .setCustomId("items")
        .setPlaceholder(b.specHero)
        .addOptions(arr)
    );

    const m1 = await message.reply({content: "ㅤ", components: [row]});

    const coll = await m1.createMessageComponentCollector({
        filter: i => {
            if (!i.isSelectMenu()) return false;
            if (i.user.id === user.id) {
                return true;
            } else {
                const intEmbed = new MessageEmbed()
                .setColor(reddark)
                .setTitle(ERROR)
                .setDescription(interError)
            
                return i.reply({embeds: [intEmbed], ephemeral: true})
            }
        },
        time: 15000
    });

    let bool1 = false;
    let bool2 = false;
    let heroType, effect, get, rew, hero, minusBox, count, obj, random, newData, text;
    coll.on("collect", async (i) => {
        bool1 = true;
        coll.stop();
        const val = i.values[0];
        switch (val) {
            case "halloween":
                const d1 = await eventFind(user.id);
                if (!d1.candyBox || d1.candyBox <= 0) return error(message, u.err);
                const randTry = Math.floor(Math.random() * ITEMS.halloween.list.length);
                if (ITEMS.halloween.list[randTry] !== "hero") {
                    await event.updateOne({userID: user.id}, {$inc: {candyBox: -1}});
                    return error(message, LANG.lang === "" ? "You got nothing.." : "Вы получили ничего..");
                }
                rew = await getValidHero(user, ITEMS.halloween.validList);
                if (!rew) return error(message, b.already);
                hero = heroes[rew];
                get = rp.heroes.find(x => x.name === hero.name)
                if (get) return error(message, b.already)
                
                await event.updateOne({userID: user.id}, {$inc: {candyBox: -1}});
                await rpg.updateOne({userID: user.id}, {$set: {item: hero.name}});
        
                await rp.heroes.push({
                name: hero.name,
                health: hero.health,
                damage: hero.damage,
                level: 1
                })
                rp.save();
                
                
                return embed(message, u.hero(LANG.lang === "ru" ? hero.nameRus : hero.name));
            case "box":
                if (rp.box <= 0 || !rp.box) return error(message, u.err);
                count = number;
                minusBox = count;
                if (rp.box < count) {
                    count = rp.box;
                    minusBox = rp.box;
                };
                obj = {
                    hlt: 0,
                    dmg: 0,
                    lvl: 0,
                    meat: 0,
                    stars: 0
                };
                for (count; count > 0; --count) {
                random = Math.floor(Math.random() * 40);
                obj.stars += randomRange(ITEMS.box.min, ITEMS.box.max);
                if ( random <= 2 ) {
                    obj.lvl += 1;
                } else if ( random <= 5 ) {
                    obj.meat += 1;
                } else if (random <= 20) {
                    obj.hlt += 1;
                } else if ( random <= 40) {
                    obj.dmg += 1;
                }
               
                };

                text = stripIndents`
                ${obj.hlt === 0 ? "" : `${ITEMS.hlt.emoji} ${obj.hlt}`}${obj.dmg === 0 ? "" : `\n${ITEMS.dmg.emoji} ${obj.dmg}`}${obj.lvl === 0 ? "" : `\n${ITEMS.lvl.emoji} ${obj.lvl}`}${obj.meat === 0 ? "" : `\n${ITEMS.meat.emoji} ${obj.meat}`}
                ${STAR} ${obj.stars}
                `
                
                newData = await rpgFind(user.id);
                if (newData.box === 0 || newData.box === undefined || newData.box < minusBox) return error(message, u.err);
                
                await rpg.updateOne({userID: user.id}, {$inc: {
                    box: -minusBox,
                    hlt: obj.hlt !== 0 ? obj.hlt : 0,
                    dmg: obj.dmg !== 0 ? obj.dmg : 0,
                    lvl: obj.lvl !== 0 ? obj.lvl : 0,
                    meat: obj.meat !== 0 ? obj.meat : 0,
                    }});
                await bd.updateOne({userID: user.id}, {$inc: {stars: obj.stars}})
                return embed(message, u.boxDone + `\n${text}`, false)
            case "megabox":
                if (rp.megabox <= 0 || !rp.megabox) return error(message, u.err);
                count = number;
                minusBox = count;
                if (rp.megabox < count) {
                    count = rp.megabox;
                    minusBox = rp.megabox;
                };
                obj = {
                    hlt: 0,
                    dmg: 0,
                    lvl: 0,
                    meat: 0,
                    stars: 0
                };
                for (count; count > 0; --count) {
                random = Math.floor(Math.random() * 40);
                obj.stars += randomRange(ITEMS.megabox.min, ITEMS.megabox.max);
                if ( random <= 2 ) {
                    obj.lvl += randomRange(2, 5);
                } else if ( random <= 5 ) {
                    obj.meat += randomRange(2, 5);
                } else if (random <= 20) {
                    obj.hlt += randomRange(2, 5);
                } else if ( random <= 40) {
                    obj.dmg += randomRange(2, 5);
                }
               
                };

                text = stripIndents`
                ${obj.hlt === 0 ? "" : `${ITEMS.hlt.emoji} ${obj.hlt}`}${obj.dmg === 0 ? "" : `\n${ITEMS.dmg.emoji} ${obj.dmg}`}${obj.lvl === 0 ? "" : `\n${ITEMS.lvl.emoji} ${obj.lvl}`}${obj.meat === 0 ? "" : `\n${ITEMS.meat.emoji} ${obj.meat}`}
                ${STAR} ${obj.stars}
                `
                
                newData = await rpgFind(user.id);
                if (newData.megabox === 0 || newData.megabox === undefined || newData.megabox < minusBox) return error(message, u.err);
                
                await rpg.updateOne({userID: user.id}, {$inc: {
                    megabox: -minusBox,
                    hlt: obj.hlt !== 0 ? obj.hlt : 0,
                    dmg: obj.dmg !== 0 ? obj.dmg : 0,
                    lvl: obj.lvl !== 0 ? obj.lvl : 0,
                    meat: obj.meat !== 0 ? obj.meat : 0,
                    }});
                await bd.updateOne({userID: user.id}, {$inc: {stars: obj.stars}})
                return embed(message, u.boxDone + `\n${text}`, false)
            case "hlt":
                if (rp.hlt <= 0 || !rp.hlt) return error(message, u.err);
                if (number > rp.hlt) number = rp.hlt;
                if (!rp.item) return error(message, hm.noHero)
                await rpg.updateOne({userID: user.id}, {$inc: {hlt: -number}});
    
                get = rp.heroes.findIndex(x => x.name === rp.item)
                heroType = heroes[rp.item];
                effect = ITEMS.hlt.effect;
                if (heroType.type === "mythical") effect = effect / 2;
                if (heroType.type === "furious") effect = effect / 4 * 3;
    
                await rpg.updateOne({userID: user.id}, {$inc: {[`heroes.${get}.health`]: effect * number}});
                return message.react(AGREE);
            case "dmg":
                if (rp.dmg <= 0 || !rp.dmg) return error(message, u.err);
                if (number > rp.dmg) number = rp.dmg;
                if (!rp.item) return error(message, hm.noHero)
                await rpg.updateOne({userID: user.id}, {$inc: {dmg: -number}});

    
                get = rp.heroes.findIndex(x => x.name === rp.item) 
                heroType = heroes[rp.item];
                effect = ITEMS.dmg.effect
                if (heroType.type === "mythical") effect = effect / 2;
                if (heroType.type === "furious") effect = effect / 4 * 3;
                
                 
                await rpg.updateOne({userID: user.id}, {$inc: {[`heroes.${get}.damage`]: effect * number}});
                
                return message.react(AGREE);
            case "lvl":
                if (rp.lvl <= 0 || !rp.lvl) return error(message, u.err);
                if (number > rp.lvl) number = rp.lvl;
                if (!rp.item) return error(message, hm.noHero);
                await rpg.updateOne({userID: user.id}, {$inc: {lvl: -number}});
                heroType = heroes[rp.item];

                let addH = getUpgrade(heroType.type) * number;
                let addD = (getUpgrade(heroType.type) / 10) * number;
                let leve = ITEMS.lvl.effect * number;

                get = rp.heroes.findIndex(x => x.name === rp.item);
                await rpg.updateOne({userID: user.id}, {$inc: {[`heroes.${get}.health`]: addH}});
                await rpg.updateOne({userID: user.id}, {$inc: {[`heroes.${get}.level`]: leve}});
                await rpg.updateOne({userID: user.id}, {$inc: {[`heroes.${get}.damage`]: addD}});
                
                return message.react(AGREE);
            case "meat":
                if (rp.meat <= 0 || !rp.meat) return error(message, u.err);
                if (number > rp.meat) number = rp.meat;
                if (!rp.item) return error(message, hm.noHero);
                await rpg.updateOne({userID: user.id}, {$inc: {meat: -number}});

                get = rp.heroes.findIndex(x => x.name === rp.item)
                await rpg.updateOne({userID: user.id}, {$inc: {[`heroes.${get}.health`]: ITEMS.meat.effect * number}});
                
                return message.react(AGREE);
            case "pack1":
                if (!rp.pack1 || rp.pack1 <= 0) return error(message, u.err);
                rew = await getValidHero(user, ITEMS.pack1.list);
                if (!rew) return error(message, b.already);
                hero = heroes[rew];
                get = rp.heroes.find(x => x.name === hero.name)
                if (get) return error(message, b.already)
                
                await rpg.updateOne({userID: user.id}, {$inc: {pack1: -1}});
                await rpg.updateOne({userID: user.id}, {$set: {item: hero.name}});
    
                await rp.heroes.push({
                name: hero.name,
                health: hero.health,
                damage: hero.damage,
                level: 1
                })
                rp.save()
            
                
                return embed(message, u.hero(LANG.lang === "ru" ? hero.nameRus : hero.name));
            case "pack2":
                if (!rp.pack2 || rp.pack2 <= 0) return error(message, u.err);
                rew = await getValidHero(user, ITEMS.pack2.list);
                if (!rew) return error(message, b.already);
                hero = heroes[rew];
                get = rp.heroes.find(x => x.name === hero.name)
                if (get) return error(message, b.already)
                
                await rpg.updateOne({userID: user.id}, {$inc: {pack2: -1}});
                await rpg.updateOne({userID: user.id}, {$set: {item: hero.name}});
        
                await rp.heroes.push({
                name: hero.name,
                health: hero.health,
                damage: hero.damage,
                level: 1
                })
                rp.save();
                
                
                return embed(message, u.hero(LANG.lang === "ru" ? hero.nameRus : hero.name));
            case "pack3":
                if (!rp.pack3 || rp.pack3 <= 0) return error(message, u.err);
                rew = await getValidHero(user, ITEMS.pack3.list);
                if (!rew) return error(message, b.already);
                hero = heroes[rew];
                get = rp.heroes.find(x => x.name === hero.name)
                if (get) return error(message, b.already)
                
                await rpg.updateOne({userID: user.id}, {$inc: {pack3: -1}});
                await rpg.updateOne({userID: user.id}, {$set: {item: hero.name}});
            
                await rp.heroes.push({
                name: hero.name,
                health: hero.health,
                damage: hero.damage,
                level: 1
                })
                rp.save();
                
                
                return embed(message, u.hero(LANG.lang === "ru" ? hero.nameRus : hero.name));
            case "tempPack":
                if (!rp.tempPack || rp.tempPack <= 0) return error(message, u.err);
                rew = await getValidHero(user, ITEMS.tempPack.list);
                if (!rew) return error(message, b.already);
                hero = heroes[rew];
                get = rp.heroes.find(x => x.name === hero.name)
                if (get) return error(message, b.already)
                
                await rpg.updateOne({userID: user.id}, {$inc: {tempPack: -1}});
                await rpg.updateOne({userID: user.id}, {$set: {item: hero.name}});
            
                await rp.heroes.push({
                name: hero.name,
                health: hero.health,
                damage: hero.damage,
                level: 1
                })
                rp.save();
                
                
                return embed(message, u.hero(LANG.lang === "ru" ? hero.nameRus : hero.name));
            case "donateBox":
                if (!rp.donateBox || rp.donateBox <= 0) return error(message, u.err);
                const random1 = Math.round(randomRange(50000, 200000));
                await rpg.updateOne({userID: user.id}, {$inc: {donateBox: -1}});

                await addStar(user.id, random1)
                return embed(message, `${random1} ${STAR}`, false);
            case "goldBox":
                if (!rp.goldBox || rp.goldBox <= 0) return error(message, u.err);
                return await donateReward(message, user.id, ITEMS.goldBox.list, LANG.lang);
        }
    });

    coll.on("end", () => {
        m1.delete();
        ops.using.delete(user.id);
        if (!bool1) {
            return error(message, timeOut);
        };
    });

    return;
  }
}

async function donateReward (message, id, arr, lang = "ru") {
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
    const random = randomRange(150, 500);
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