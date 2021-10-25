const { main, reddark } = require('../../JSON/colours.json');
const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require("discord.js");
const { STAR, AGREE, LOADING } = require("../../config");
const { error, embed, perms, firstUpperCase, makeTimestamp, delay, randomRange, roundFunc, getHeroData } = require("../../functions/functions");
const { serverFind, rpgFind, addStar, bagFind, rpg, profileFind, profile, addPremiumStar } = require("../../functions/models");
const heroes = require("../../JSON/heroes.json");

module.exports = {
  config: {
    name: "combine",
    category: "h_roleplay",
    aliases: ["комбинировать"],
    cooldown: 20
  },
  run: async (bot, msg, args, ops) => {

    const server = msg.guild;
    const user = msg.author;
    const channel = msg.channel;

    const sd = await serverFind(server.id);
    const { combine: c, heroModel: hm} = require(`../../languages/${sd.lang || "r"}`);

    const [mainHero, targetHero] = args;
    const bag = await bagFind(user.id);
    let timeout = 2 * 86400 * 1000;
    if (bag.vip2) timeout /= 2;
    
    const pd = await profileFind(user.id);
    if (pd.give && pd.give > new Date()) {
      return error(msg, c.time + ` <t:${makeTimestamp(pd.give.getTime())}:R>`);
    };
    
    if (!mainHero || !targetHero) return error(msg, c.spec + `\n\`${sd.prefix}combine ${c.usage}\``);

    const m1 = await msg.reply(LOADING);

    const cd = randomRange(8, 18);
    await delay(cd * 1000);
    m1.delete();
    const rp = await rpgFind(user.id);
    if (!rp.item || rp.heroes.length === 0) return error(msg, hm.noHero);
    const name1 = firstUpperCase(mainHero.toLowerCase());
    const name2 = firstUpperCase(targetHero.toLowerCase());
    
    
    const get1 = rp.heroes.find(x => x.name === name1);
    const get2 = rp.heroes.find(x => x.name === name2);

    if (!get1 || !get2 || name1 === name2) return error(msg, c.err);
    const data = heroes[name2];
    if (data.type === "private") return error(msg, c.private);

    rp.heroes[rp.heroes.indexOf(get1)]["health"] += Math.ceil(rp.heroes[rp.heroes.indexOf(get2)]["health"] / 2);
    rp.heroes[rp.heroes.indexOf(get1)]["level"] += Math.ceil(rp.heroes[rp.heroes.indexOf(get2)]["level"] / 2);
    rp.heroes[rp.heroes.indexOf(get1)]["damage"] += Math.ceil(rp.heroes[rp.heroes.indexOf(get2)]["damage"] / 2);
    

    rp.heroes.splice(rp.heroes.indexOf(get2), 1);
    rp.save().then(msg.react(AGREE));

    await profile.updateOne({userID: user.id}, {$set: {
      give: new Date(Date.now() + timeout)
    }})

    await rpg.updateOne({userID: user.id}, {$set: {
      item: get1.name
    }})
    return;
    
  }
}
