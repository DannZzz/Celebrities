const heroes = require('../../JSON/heroes.json');
const { main } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const { COIN, STAR, LEAGUE, HELL, heroNames } = require("../../config");
const { addCandy, addPremiumStar, addCount } = require("../../functions/models");
const { error, embed, perms, roundFunc, getHeroData, randomRange, missingArgument } = require("../../functions/functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 10000);
const Canvas = require('canvas');
const Rate = require("../../functions/rateClass");
const {games} = require(`../../rewards.json`);

module.exports = {
  config: {
    name: "battle",
    aliases: ["битва"],
    category: 'h_roleplay',
    cooldown: 30,
    examples: ["battle 100"]
  },
  run: async function (bot, message, args, ops) {
    const now = ops.games.get(message.author.id);
    if (now) return;
    ops.games.set(message.author.id, { battling: "on" });
    setTimeout(() => ops.games.delete(message.author.id), 30000)

    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({ serverID: message.guild.id });
    const { battle: b, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar } = require(`../../languages/${LANG.lang}`);

    const bag = await bd.findOne({ userID: message.author.id });
    const profileData = await pd.findOne({ userID: message.author.id });

    let author = profileData.random;
    let timeout;
    if (bag["vip2"] === true) { timeout = 100 * 1000; } else {
      timeout = 180 * 1000;
    }
    if (author !== null && timeout - (Date.now() - author) > 0) {
      let time = new Date(timeout - (Date.now() - author));

      return error(message, b.time(time));
    }
    let text = `${this.config.name} ${b.usage}`, examples = this.config.examples;
    let a = Math.round(Math.random() * 6) + 1
    let mgs = await message.channel.send(`<a:dannloading:876008681479749662> ${b.find}`)
    setTimeout(async function () {
      mgs.delete()
      if (!args[0] || isNaN(args[0])) return await missingArgument(message, b.bet, text, examples);
      let value = Math.floor(args[0])

      if (value < 1) return error(message, b.min);

      if (!bag["vip1"] && value > games.main.none) {
        return error(message, b.vip1);
      } else if (!bag["vip2"] && value > games.main.vip) {
        return error(message, b.vip2);
      } else if (bag["vip2"] && value > games.main.premium) {
        return error(message, b.vipError);
      }

      if (value > bag.stars) return error(message, noStar);

      const mrp = await rpg.findOne({ userID: message.author.id });
      const rate = mrp.league.rate || 0;
      const league = mrp.league.id || 0;

      if (!mrp || mrp.item === null) return error(message, hm.noHero);
      const mItem = mrp.item
      let item;
      const enem = heroNames;
      const random = Math.floor(Math.random() * enem.length);
      item = enem[random]

      await bd.updateOne({ userID: message.author.id }, { $inc: { stars: -value } });
      await addCount(message.author.id, "battle");

      const data1 = heroes[mItem];
      const data2 = heroes[item];
      const get = mrp.heroes.find(x => x.name === mrp.item)
      const myLevel = get.level;
      const myHealth = await getHeroData(bot, message.author.id, mrp).then(x => x.h);
      const myDamage = await getHeroData(bot, message.author.id, mrp).then(x => x.d);
      let eLevel = myLevel;
      const rand1 = Math.floor(Math.random() * 40);
      let eHealth = myHealth;
      let eDamage = myDamage;
      
      const trues = [true, false, false, true, true, true, false];
      const randTrue = Math.floor(Math.random() * trues.length);

      let addingHealth = Math.round((data2.health / 10) * (rand1 % 10));
      let addingDamage = Math.round((data2.damage / 10) * (rand1 % 10));
      
      if (trues[randTrue]) {
        addingHealth = -addingHealth;
        addingDamage = -addingDamage;
      }
      eHealth += addingHealth;
      eDamage += addingDamage;

      if (eHealth <= 0) eHealth = myHealth;
      if (eDamage <= 0) eDamage = myDamage;
      
      let h1 = Math.round(eHealth)
      let h2 = Math.round(myHealth)
      let d1 = Math.round(eDamage)
      let d2 = Math.round(myDamage)
      let winner = false

      let damn = await message.channel.send(`<a:dannloading:876008681479749662> ${b.find}`);
      const CC = await makeCanvas(data1.path, data2.path)
      const att = new MessageAttachment(CC.toBuffer(), 'fight.png')


      let myHero = new MessageEmbed()
        .setTitle(hm.battle)
        .setImage('attachment://fight.png')
        .setThumbnail('https://media.giphy.com/media/SwUwZMPpgwHNQGIjI7/giphy.gif')
        .addField(`${message.author.username} (${LANG.lang === "ru" ? data1.nameRus : data1.name})`, `**${hm.level} ${myLevel}**`, true)
        .addField(`❤ ${hm.health} ${myHealth}`, `**⚔ ${hm.damage} ${myDamage}**`, true)
        .addField(`\u200b`, `\u200b`, false)
        .addField(`${LANG.lang === "ru" ? data2.nameRus : data2.name}`, `**${hm.level} ${Math.round(+eLevel)}**`, true)
        .addField(`❤ ${hm.health} ${Math.round(h1)}`, `**⚔ ${hm.damage} ${Math.round(d1)}**`, true)
        .setColor(main)

      let msg = await message.channel.send({ embeds: [myHero], files: [att] });
      damn.delete()
      let rand = Math.floor(Math.random() * 32)
      if (rand < 16) {
        while (true) {
          h1 -= d2
          h2 -= d1
          if (h1 <= 0) {
            winner = message.author;
            break;
          } else if (h2 <= 0) {
            break;
          }
        }
      } else {
        while (true) {
          h2 -= d1
          h1 -= d2
          if (h2 <= 0) {
            break;
          } else if (h1 <= 0) {
            winner = message.author;
            break;
          }
        }
      }

      await pd.findOneAndUpdate({ userID: message.author.id }, { $set: { random: Date.now() } })
      await rpg.findOneAndUpdate({ userID: message.author.id }, { $inc: { totalGames: 1 } })

      setTimeout(async () => {
        let winData
        if (winner) {
          const randomCandy = randomRange(1, 4);
          await addCandy(winner.id, randomCandy);
          const winCup = Rate(message).winRewardGenerator(league);
          await Rate(message).rateUpdate(message.author.id, winCup);
          await rpg.findOneAndUpdate({ userID: winner.id }, { $inc: { wins: 1 } })

          await addPremiumStar(bot, winner.id, value * 2);

          const WinData = await rpg.findOne({ userID: winner.id });
          const DATA = await getHeroData(bot, winner.id, WinData);
          winData = WinData.heroes.find(x => x.name === WinData.item)
          let hero = heroes[winData.name]
          let it = heroes[item]

          const att = new MessageAttachment(hero.path, `${hero.name}.png`);

          let winEmb = new MessageEmbed()
            .setTitle(`${b.winner} ${winner.tag || winner.user.tag} (${LANG.lang === "ru" ? hero.nameRus : hero.name})`)
            .setDescription(`${b.between} ${message.member}, ${it.name}(A.I)`)
            .setImage(`attachment://${hero.name}.png`)
            .setColor(main)
            .addField(`❤ ${hm.health} ${DATA.h}`, `**⚔ ${hm.damage} ${DATA.d}**`, true)
            .addField(`${hm.reward} ${await addPremiumStar(bot, winner.id, value * 2, true)} ${STAR} +${winCup} ${LEAGUE.cup} ${and} ${randomCandy} ${HELL.candy}`, `**🏆 ${hm.winrate} ${roundFunc(WinData.wins / WinData.totalGames * 100) || '0'}%**`, true)
          msg.delete()
          return message.channel.send({ embeds: [winEmb], files: [att] });
        } else {
          await rpg.findOneAndUpdate({ userID: message.author.id }, { $inc: { loses: 1 } })
          await Rate(message).rateUpdate(message.author.id, -45);

          let hero = heroes[item];

          const att = new MessageAttachment(hero.path, `${hero.name}.png`);

          let winEmb = new MessageEmbed()
            .setTitle(`${b.winner} ${hero.name} A.I (${LANG.lang === "ru" ? hero.nameRus : hero.name})`)
            .setDescription(`${b.between} ${message.member}, ${hero.name}(A.I) -${45} ${LEAGUE.cup}`)
            .setImage(`attachment://${hero.name}.png`)
            .setColor(main)
            .addField(`❤ ${hm.health} ${Math.round(eHealth)}`, `**⚔ ${hm.damage} ${Math.round(eDamage)}**`, true)
          msg.delete()
          return message.channel.send({ embeds: [winEmb], files: [att] })
        }




      }, 25000)

    }, a * 1000)
  }
}

async function makeCanvas(data1, data2) {
  const canvas = Canvas.createCanvas(1110, 520);
  const ctx = canvas.getContext('2d');
  const background = await Canvas.loadImage('https://i.ibb.co/SyjjcGt/vstemp.jpg');
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
  const h = 280;
  const heroHeight = 120;
  const firstW = 80;
  const secW = 750;

  const first = await Canvas.loadImage(data1);
  const second = await Canvas.loadImage(data2);

  ctx.drawImage(first, firstW, heroHeight, h, h);
  ctx.drawImage(second, secW, heroHeight, h, h);

  ctx.lineWidth = 3;
  ctx.strokeStyle = "#FDB416";
  ctx.strokeRect(firstW, heroHeight, h, h)

  ctx.lineWidth = 3;
  ctx.strokeStyle = "#FDB416";
  ctx.strokeRect(secW, heroHeight, h, h)

  return canvas
}

