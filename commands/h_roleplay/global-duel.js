const { main, reddark } = require('../../JSON/colours.json');
const heroes = require('../../JSON/heroes.json');
const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require("discord.js");
const { STAR, AGREE, LOADING, LEAGUE } = require("../../config");
const { error, embed, perms, firstUpperCase, makeTimestamp, delay, roundFunc, getHeroData, HealthToZero } = require("../../functions/functions");
const { serverFind, rpgFind, addStar, bagFind, rpg, profileFind, profile, addPremiumStar } = require("../../functions/models");
const Canvas = require("canvas");
const { games } = require("../../rewards.json");
const Rate = require("../../functions/rateClass");

module.exports = {
  config: {
    name: "global-duel",
    category: "h_roleplay",
    aliases: ["глобал-дуэл"],
    cooldown: 30,
  },
  run: async (bot, msg, args, ops) => {

    const server = msg.guild;
    const user = msg.author;
    const channel = msg.channel;

    const rp = await rpgFind(user.id);
    const sd = await serverFind(server.id);
    const { heroModel: hm, battle: b, and } = require(`../../languages/${sd.lang || "ru"}`);
    
    if (!rp.item || rp.heroes.length === 0) return error(msg, hm.noHero);
    const wait = await msg.reply(LOADING);
    const myData = await getHeroData(bot, user.id, rp);
    let myHealth = myData.h;
    let myDamage = myData.d;

    const allUsers = await rpg.find({ item: {$exists: true, $nin: [null, undefined, ""]}, userID: {$nin: [user.id]} }).exec();

    const randomUserData = allUsers[Math.floor(Math.random() * allUsers.length)];
    const userHero = await getHeroData(bot, randomUserData.userID, randomUserData);

    const getMyHero = rp.heroes.find(heroObj => heroObj.name === rp.item);
    const getUserHero = randomUserData.heroes.find(heroObj => heroObj.name === randomUserData.item);

    let userHealth = userHero.h;
    let userDamage = userHero.d;

    const myHeroData = heroes[rp.item];
    const userHeroData = heroes[randomUserData.item];

    const randomUserNickname = bot.users.cache.get(randomUserData.userID) ? bot.users.cache.get(randomUserData.userID).tag : "?????";
    
    const CC = await makeCanvas(myHeroData.path, userHeroData.path);
    const att = new MessageAttachment(CC.toBuffer(), "fight.png");

    const emb = new MessageEmbed()
        .setTitle(hm.battle)
        .setImage('attachment://fight.png')
        .setThumbnail('https://media.giphy.com/media/SwUwZMPpgwHNQGIjI7/giphy.gif')
        .addField(`${user.tag} (${sd.lang === "ru" ? myHeroData.nameRus : myHeroData.name})`, `**${hm.level} ${getMyHero.level}**`, true)
        .addField(`❤ ${hm.health} ${myHealth}`, `**⚔ ${hm.damage} ${myDamage}**`, true)
        .addField(`\u200b`, `\u200b`, false)
        .addField(`${randomUserNickname} ${sd.lang === "ru" ? userHeroData.nameRus : userHeroData.name}`, `**${hm.level} ${getUserHero.level}**`, true)
        .addField(`❤ ${hm.health} ${userHealth}`, `**⚔ ${hm.damage} ${userDamage}**`, true)
        .setColor(main)

    const m = await channel.send({embeds: [emb], files: [att]});
    wait.delete();
    await rpg.updateOne({ userID: user.id }, { $inc: { totalGames: 1 } })

    await delay(20 * 1000);

    const end = HealthToZero({
      id: "user",
      health: myHealth,
      damage: myDamage
    }, 
    {
      id: "randomUser",
      health: userHealth,
      damage: userDamage
    });

    const winEmb = new MessageEmbed()
    .setColor(main)
    .setTitle(`${b.between}: ${user.tag} ${and} ${randomUserNickname}`)

    
    if (end.winner === "user") {
      const value = games.twoVtwo;
      const winCup = Rate(message).winRewardGenerator(league);
      await Rate(message).rateUpdate(message.author.id, winCup);
      await rpg.updateOne({ userID: user.id }, { $inc: { wins: 1 } })
      const reward = await addPremiumStar(bot, user.id, value, true);
      await addPremiumStar(bot, user.id, value);

      
      winEmb
        .setAuthor(`${b.winner} ${user.tag}`)
        .setImage(myHeroData.url)
        .setThumbnail(userHeroData.url)
        .setDescription(`${hm.reward}: ${reward} ${STAR} +${winCup} ${LEAGUE.cup}`)
    } else {
      winEmb
      .setAuthor(`${b.winner} ${randomUserNickname}`)
      .setImage(userHeroData.url)
      .setThumbnail(myHeroData.url)
    };

    return channel.send({embeds: [winEmb]});
    
  }
}


async function makeCanvas (data1, data2) {
  const canvas = Canvas.createCanvas(1110, 520);
  const ctx = canvas.getContext('2d');
  const background = await Canvas.loadImage('https://png.pngtree.com/thumb_back/fh260/background/20200729/pngtree-game-battle-versus-vs-background-image_373230.jpg');
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
  const h = 300;
  const heroHeight = 110;
  const firstW = 60;
  const secW = 750;
  
  const first = await Canvas.loadImage(data1);
  const second = await Canvas.loadImage(data2);
  
  ctx.drawImage(first, firstW, heroHeight, h, h);
  ctx.drawImage(second, secW, heroHeight, h, h);

  ctx.lineWidth = 3;
  ctx.strokeStyle = "GRAY";
  ctx.strokeRect(firstW, heroHeight, h, h)

  ctx.lineWidth = 3;
  ctx.strokeStyle = "ORANGE";
  ctx.strokeRect(secW, heroHeight, h, h)
  
  return canvas
}