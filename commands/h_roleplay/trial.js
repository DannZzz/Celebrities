const { main, reddark } = require('../../JSON/colours.json');
const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require("discord.js");
const {STAR, AGREE, heroNames } = require("../../config");
const {error, embed, perms, firstUpperCase, makeTimestamp, delay, roundFunc, getHeroData} = require("../../functions/functions");
const {serverFind, rpgFind, addStar, bagFind, rpg, profileFind, profile, addPremiumStar } = require("../../functions/models");
const heroes = require("../../JSON/heroes.json");
const Canvas = require("canvas");
const { games } = require("../../rewards.json");

module.exports = {
    config: {
        name: "trial",
        category: "h_roleplay",
        aliases: ["испытание"],
        cooldown: 10
    },
    run: async (bot, msg, args, ops) => {
        
        const server = msg.guild;
        const user = msg.author;
        const channel = msg.channel;

        const value = games.trial.cost;
        
        const LANG = await serverFind(server.id);
        const {interError, ERROR, trial, battle: b, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);     
        const bag = await bagFind(user.id);

        const prof = await profileFind(user.id);
        if (prof.trial && prof.trial > new Date()) {
          return error(msg, trial.trial(prof.trial.getTime()));
        }

        let time = 1800000;
        if (bag.vip2) time = time / 2;
        ops.trial.set(msg.author.id, {trial: 'on'});
        setTimeout(() => ops.trial.delete(user.id), 60 * 1000 * 7);
        const data = await rpgFind(user.id);
        if (!data.item) {
          ops.trial.delete(user.id);
          return error(msg, hm.noHero);}

        if (bag.stars < value) {
          ops.trial.delete(user.id);
          return error(msg, noStar + ` ${value} ${STAR}`);}
        
        const heroData = data.heroes.find( x => x.name === data.item);
        if (!heroData) {
           ops.trial.delete(user.id);
           return;
        }
        await profile.updateOne({userID: user.id}, {$set: {trial: new Date(Date.now() + time)}})
        try {

        

        await addStar(user.id, -(value));
        
        
        let h = await getHeroData(user.id, data).then(x => x.h);
        let d = await getHeroData(user.id, data).then(x => x.d);
        let l = heroData.level;
        const hero = heroes[data.item];
        
        const enemiesArr = heroNames;

        function getRandomEnemy(arr) {
            const random = Math.floor(Math.random() * arr.length)
            return heroes[arr[random]];
        }   

        let uppingLevel = 2;
        if (l < 15 && h > 50000) uppingLevel = 6;
        let winCount = 0;
        let reward = games.trial.none;
        if (bag.vip2) {
          reward = games.trial.premium;
        } else if (bag.vip1) {
          reward = games.trial.vip;
        }
        let totalReward = 0;

        const heroAtt = new MessageAttachment(hero.path, `${hero.name}.png`);
        
        const m = await channel.send("<a:dannloading:876008681479749662>");
        await start();
        async function start() {
            const enemy = getRandomEnemy(enemiesArr);
            
            let h1 = Math.round(enemy.health + (getUpgrade(enemy.type) * l) * uppingLevel);
            let d1 = Math.round(enemy.damage + (getUpgrade(enemy.type) / 10 * l) * uppingLevel);

            while (h / 2 > h1) h1 += Math.round(h1 * 1.5);
            while (d / 2 > d1) d1 += Math.round(d1 * 1.5);
            
            await rpg.updateOne({userID: user.id}, {$inc: {totalGames: 1}})
            uppingLevel += 2;

            const CC = await makeCanvas(hero.path, enemy.path);
            const att = new MessageAttachment(CC.toBuffer(), 'trial.png')

            const emb = new MessageEmbed()
            .setTitle(hm.battle)
            .setImage('attachment://trial.png')
            .setThumbnail('https://media.giphy.com/media/SwUwZMPpgwHNQGIjI7/giphy.gif')
            .addField(`${user.username} (${LANG.lang === "ru" ? hero.nameRus : hero.name})`, `**${hm.level} ${l}**`, true)
            .addField(`❤ ${hm.health} ${h}`, `**⚔ ${hm.damage} ${d}**`, true)
            .addField(`\u200b`, `\u200b`, false)
            .addField(`${LANG.lang === "ru" ? enemy.nameRus : enemy.name}`, `**${hm.level} ${l}**`, true)
            .addField(`❤ ${hm.health} ${h1}`, `**⚔ ${hm.damage} ${d1}**`, true)
            .setColor(main)
            
            const m2 = await channel.send({embeds: [emb], files: [att]});
            let winner;
            if (m) m.delete();
            await delay(20000);
            m2.delete();
            let rand = Math.floor(Math.random() * 32);
            if (rand < 16) {
              while (true) {
                h -= d1
                h1 -= d
                if(h <= 0) {
                  winner = false;
                  break;
                } else if (h1 <= 0) {
                  winner = true;
                  break;
                }
              }
            } else {
              while (true) {
                h1 -= d
                h -= d1
                if(h1 <= 0) {
                  winner = true
                  break;
                } else if (h <= 0) {
                  winner = false;
                  break;
                }
              }
            }

          if (winner) {
            totalReward += reward;
            let vizual = await addPremiumStar(bot, user.id, totalReward, true)
            winCount += 1;
            let newData = await rpg.findOneAndUpdate({userID: user.id}, {$inc: {wins: 1}})
            const trialMax = newData.trialMax || 0;
            if (winCount > trialMax) await rpg.updateOne({userID: user.id}, {$set: {trialMax: winCount}});

            let winEmb = new MessageEmbed()
            .setTitle(`${b.winner} ${user.username} (${LANG.lang === "ru" ? hero.nameRus : hero.name})`)
            .setDescription(`🟢 ${winCount}`)
            .setImage(`attachment://${hero.name}.png`)
            .setColor(main)
            .addField(`❤ ${hm.health} ${h}`, `**⚔ ${hm.damage} ${d}**`, true)
            .addField(`${ (LANG.lang === "ru" ? "Текущий " : "Current ") + hm.reward} ${vizual} ${STAR}`, `**🏆 ${hm.winrate} ${roundFunc(newData.wins / newData.totalGames * 100) || '0'}%**`, true)

            let bool = false;

            const button1 = new MessageButton()
            .setCustomId("gonext")
            .setLabel(LANG.lang === "ru" ? "Продолжить" : "Continue")
            .setStyle("SUCCESS")

            const button2 = new MessageButton()
            .setCustomId("goback")
            .setLabel(LANG.lang === "ru" ? "Выйти" : "Exit")
            .setStyle("DANGER")

            const row = new MessageActionRow().addComponents([button1, button2])
              
            const getNext = await channel.send({embeds: [winEmb], files: [heroAtt], components: [row]});
            
            const collector = await channel.createMessageComponentCollector({
              time: 15000,
              filter: i => {
                if ( (i.customId === button1.customId || i.customId === button2.customId) && i.user.id === user.id ) {
                  return true;
                } else if (i.user.id !== user.id) {
                  const intEmbed = new MessageEmbed()
                  .setColor(reddark)
                  .setTitle(ERROR)
                  .setDescription(interError)
                
                return i.reply({embeds: [intEmbed], ephemeral: true})
                }
              }
            });

            collector.on("collect", async (i) => {
              switch(i.customId) {
                case button1.customId:
                  i.deferUpdate();
                  bool = true;
                  collector.stop();
                  getNext.delete();
                  channel.send("<a:dannloading:876008681479749662>").then((m3) => setTimeout(() => m3.delete(), 3000))
                  
                  return await start();
                case button2.customId:
                  i.deferUpdate();
                  bool = true;
                  collector.stop();
                  ops.trial.delete(user.id);
                  getNext.delete();
                  await addPremiumStar(bot, user.id, totalReward);
                  embed(msg, `${LANG.lang === "ru" ? "Вы выиграли" : "You won"} ${vizual} ${STAR}`)
                default:
                  break;
              }
            });

            collector.on("end", async () => {
              if (!bool) {
                ops.trial.delete(user.id);
                getNext.delete();
                await embed(msg, `${LANG.lang === "ru" ? "Время вышло, вы выиграли" : "Time out, you got"} ${vizual} ${STAR}`);
              }
            })

                        
          } else {
            ops.trial.delete(user.id);

            const enemyAtt = new MessageAttachment(enemy.path, `${enemy.name}.png`);
            
            let winEmb = new MessageEmbed()
            .setTitle(`${b.winner} ${enemy.name} A.I (${LANG.lang === "ru" ? enemy.nameRus : enemy.name})`)
            .setDescription(`${b.between} ${msg.member}, ${enemy.name}(A.I)`)
            .setImage(`attachment://${enemy.name}.png`)
            .setColor(main)
            .addField(`❤ ${hm.health} ${h1}`, `**⚔ ${hm.damage} ${d1}**`, true)

            return channel.send({embeds: [winEmb], files: [enemyAtt]});
          }






        }
      } finally {
        ops.trial.delete(user.id)
      }

        

        
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
