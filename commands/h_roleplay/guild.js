const heroes = require('../../JSON/heroes.json');
const enemies = require('../../JSON/enemies.json');
const { main } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const clan = require("../../models/clanSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { COIN, STAR, CLAN, AGREE } = require("../../config");
const {error, embed, perms, firstUpperCase, formatNumber} = require("../../functions/functions");
const {isWebUri} = require('valid-url');
const { clanFind } = require("../../functions/models");
const { stripIndents } = require("common-tags");

module.exports = {
  config: {
    name: "guild",
    aliases: ['гильдия'],
    category: 'h_roleplay',
    cooldown: 15
  },
  run: async (bot, message, args, ops) => {
    

    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {guild: cc, guilds: ccc, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar, timeOut} = require(`../../languages/${LANG.lang}`);   
   
    
    const data = await bd.findOne({userID: message.author.id})
    const user = message.author;
    let bag = await bd.findOne({userID: user.id})
    let rp = await rpg.findOne({userID: user.id});

    if (!rp) {
      let newData = await rpg.create({
        userID: user.id,
      })
      newData.save()
    }
    
    rp = await rpg.findOne({userID: user.id});
    
    const helps = ['help'];
    const creates = ['create'];
    const kicks = ["kick"];
    const apps = ['apps'];
    const accept = ['accept'];
    const reject = ['reject'];
    const upgrade = ['update', 'upgrade'];
    const logo = ['logo'];
    const description = ['description', 'desc'];
    const del = ['delete'];
    const reward = ['reward'];
    const leave = ['leave'];
    const up = ['up'];
    const down = ['down'];
    const mess = ["message"];
    const give = ["give"];
    const shop = ["shop"];
    
    if (!args[0]) {
      const mc = await clan.findOne({ID: rp.clanID});
      if (!mc) return error(message, cm.noClan);

      const addHealth = mc.addHealth || 0;
      const addDamage = mc.addDamage || 0;
      
      let a = await rpg.find({clanID: rp.clanID}).exec()
      let b = await Promise.all(a.map(async(docs, p = 0)=> {
        const rpp = await rpg.findOne({userID: docs.userID})
        let asd;
        if (rpp && rpp.item) { 
          if (LANG.lang === "ru") {
            asd =  `  <a:herodann:883382573231923201> ${heroes[rpp.item].nameRus} (${ccc.lvl} ${rpp.heroes.length !== 0 ? await rpp.heroes.find(x => x.name === rpp.item).level : ""})`
          } else {
              asd =  `  <a:herodann:883382573231923201> ${rpp.item} (${ccc.lvl} ${rpp.heroes.length !== 0 ? await rpp.heroes.find(x => x.name === rpp.item).level : ""})`
            }
          } else {
            asd = cm.noHero
          }
        return `__${p+1}.__ ${message.guild.members.cache.get(docs.userID) ? `${message.guild.members.cache.get(docs.userID)} ${docs.userID === mc.owner ? "   <:danncrown:880492405390979132>" : ""} ${mc.staff.includes(docs.userID) ? "   <:dannstaff:881110710057332766>" : ""}` : (bot.users.cache.get(docs.userID) ? `${bot.users.cache.get(docs.userID).tag} ${docs.userID === mc.owner ? "   <:danncrown:880492405390979132>" : ""}` : cc.unk)} ${asd}`
       }))
      
      
      let myClan = new MessageEmbed()
      .setColor(main)
      .setTitle(`📊 __#${mc.ID}__ — ${mc.name}`)
      .setDescription(stripIndents`
      👑 ${cm.leader} ${message.guild.members.cache.get(mc.owner) ? message.guild.members.cache.get(mc.owner) : (bot.users.cache.get(mc.owner) ? bot.users.cache.get(mc.owner).tag : LANG.lang === "en" ? "Unknown" : "Неизвестный")}
      📈 ${cm.level} ${mc.level}
      💰 ${cm.budget} ${formatNumber(mc.budget)} ${CLAN}
      🎁 ${cm.reward} ${formatNumber(mc.level * 300)} ${mc.reward && (86400 * 1000) - (Date.now() - mc.reward) > 0 ? "<:disagree:870586968734580767>" : "<:agree:870586969606979664>"}
      ❤ ${cc.bonusHealth} ${addHealth}
      ⚔ ${cc.bonusDamage} ${addDamage}${mc.description ? "\n\n" + mc.description : ''}
      
      **${cm.members} - ${a.length } / ${mc.space}**
      ${b.length !== 0 ? b.join("\n") : cm.noMembers}`)
      
      if (mc.logo) {
        if (!isWebUri(mc.logo)) {
          myClan.setThumbnail("https://pbs.twimg.com/profile_images/1063925348205821958/DlGcxdOl_400x400.jpg")
        }else {
          myClan.setThumbnail(mc.logo)
        }
      }
      return message.channel.send({embeds: [myClan]})
    }

    const resp = args[0].toLowerCase()

    if (!isNaN(resp)) {
      const mc = await clan.findOne({ID: rp.clanID});
      if (!mc) return error(message, cm.noClan);

      let value = Math.round(resp);
      const msg = await message.channel.send(`<a:dannloading:876008681479749662> ${cc.trans}`)
      let a = Math.round(Math.random() * 6) + 1
      return setTimeout(async () => {
        msg.delete()
        bag = await bd.findOne({userID: user.id})
        if (bag.stars < value) return error(message, noStar);
        if (10 > value) return error(message, cc.min(STAR));
        value = Math.floor(value / 2)
        await bd.updateOne({userID: user.id}, {$inc: {stars: -Math.round(resp)}});
        await clan.updateOne({ID: rp.clanID}, {$inc: {budget: value}});
        return embed(message, cc.done(value, CLAN));
      }, a * 1000)
     
    }
    
    if (helps.includes(resp)) {
      const helpEmb = new MessageEmbed()
      .setColor(main)
      .setTimestamp()
      .setTitle(cc.actions)
      .setDescription(cc.helpCommand(STAR, CLAN))

      return message.channel.send({embeds: [helpEmb]});
    } else if (creates.includes(resp)) {
      const msg = await message.channel.send(`<a:dannloading:876008681479749662> ${cc.doing}`)
      let a = Math.round(Math.random() * 6) + 1
      //const clanData = await clan.findOne({owner: user.id})
      setTimeout(async () => {
        msg.delete()
        if (rp.clanID !== null) return error(message, cm.clan);

        if (bag.stars < 5000) return error(message, noStar);
        
        if (!args[1]) return error(message, cc.name);
        let getLimit = args.slice(1).join(" ").split("")
        if(getLimit.length > 20) return error(message, maxLimit(20))
        const nameOfClan = firstUpperCase(args.slice(1).join(" "), " ");
        let ID = 1
        let bool = true
        while (bool) {
          let get = await clan.findOne({ID: ID});

          if(get) {
            ID += 1
            continue;
          } else {
            break;
          }
        }

        let newClan = await clan.create({
          owner: user.id,
          ID: ID,
          name: nameOfClan
        });
        newClan.save()
        await rpg.updateOne({userID: message.author.id}, {$set: {clanID: ID}})
        await bd.updateOne({userID: user.id}, {$inc: {stars: -5000}})
        return embed(message, cc.doneC)
      }, a * 1000)
      
    } else if (kicks.includes(resp)) {
      if (rp.clanID === null) return error(message, cm.noClan);
      let getCl = await clan.findOne({ID: rp.clanID});
      if(message.author.id !== getCl.owner) return error(message, cm.notLeader);
      if (!args[1] || isNaN(args[1])) return error(message, cm.specN);
      let a = await rpg.find({clanID: rp.clanID}).map(b => b);

      if(Math.round(args[1]) > a.length || Math.round(args[1]) <= 0) return error(message, cc.noMember)

      let getIndex = Math.round(args[1]) - 1;

      if(a[getIndex]["userID"] === message.author.id) return error(message, cc.uLeader);
      if (getCl.staff.includes(a[getIndex]["userID"])) return error(message, cc.uStaff);
      
      await rpg.updateOne({userID: a[getIndex]["userID"]}, {$set: {clanID: null}});

      return embed(message, cc.kicked(bot.users.cache.get(a[getIndex]["userID"]).tag))
    } else if (apps.includes(resp)) {
      
      const c = await clan.findOne({ID: rp.clanID});
      if (rp.clanID === null) return error(message, cm.noClan);
      if (message.author.id !== c.owner && !c.staff.includes(user.id)) return error(message, 'У вас недостаточно прав!');
      if (user.id == c.owner && args[1]) {
        if (args[1] && args[1] === 'enable' && user.id === c.owner) {
        if (c.appsStatus) return error(message, cc.appsEE);

        await clan.updateOne({ID: c.ID}, {$set: {appsStatus: true}});

        return embed(message, cc.appsE);
      } else if (args[1] && args[1] === 'disable' && user.id === c.owner) {
        if (!c.appsStatus) return error(message, cc.appsDD);

        await clan.updateOne({ID: c.ID}, {$set: {appsStatus: false}});

        return embed(message, cc.appsD);
      } else if (args[1] === 'clear') {
        if(c.apps.length === 0) return error(message, cm.noApps);

        await clan.updateOne({ID: c.ID}, {$set: {apps: []}});
        
        return embed(message, cc.appsClear);
      }

      } else if (args[1]){
        return error(message, cc.appsError)
      }
       
      
      if(c.apps.length === 0) return error(message, cm.noApps);
      
      const arr = c.apps.map(({tag, hero, level}, p=0) => `\`${p+1}.\` ${cc.appType.m} __${tag}__\n${cc.appType.h} __${hero}__\n${cc.appType.l} __${level}__`)

      const emb = new MessageEmbed()
      .setColor(main)
      .setTimestamp()
      .setAuthor(cc.apps)
      .setDescription(arr.join("\n\n"))

      return message.channel.send({embeds: [emb]});
    } else if (reject.includes(resp)) {
      const c = await clan.findOne({ID: rp.clanID});
      if (rp.clanID === null) return error(message, cm.noClan);
      if (message.author.id !== c.owner  && !c.staff.includes(user.id)) return error(message, perm);
      if(c.apps.length === 0) return error(message, cm.noApps);
      if(!args[1] || isNaN(args[1])) return error(message, cm.specN);

      let index = Math.round(args[1]) - 1;
      
      if(Math.round(args[1]) > c.apps.length || Math.round(args[1]) < 0) return error(message, cc.appError);

      await c.apps.splice(index);
      c.save()

      return embed(message, cc.rejDone);
    } else if (accept.includes(resp)) {
      const msg = await message.channel.send(`<a:dannloading:876008681479749662> ${cc.accepting}`)
      let a = Math.round(Math.random() * 6) + 1
      //const clanData = await clan.findOne({owner: user.id})
      setTimeout(async () => {
        msg.delete()
        const c = await clan.findOne({ID: rp.clanID});
        if (rp.clanID === null) return error(message, cm.noClan);
        if (message.author.id !== c.owner && !c.staff.includes(user.id)) return error(message, perm);
        const members = await rpg.find({clanID: c.ID});
        if(c.space === members) return error(message, cc.enoughMembers);
        if(c.apps.length === 0) return error(message, cm.noApps);
        if(!args[1] || isNaN(args[1])) return error(message, cm.specN);

        let index = Math.round(args[1]) - 1;
        
        if(Math.round(args[1]) > c.apps.length || Math.round(args[1]) < 0) return error(message, cc.appError);
        const getuser = await rpg.findOne({userID: c.apps[index]["id"]});
        if (getuser.clanID !== null) return error(message, cc.already)
        await rpg.updateOne({userID: c.apps[index]["id"]}, {$set: {clanID: c.ID}});

        await c.apps.splice(index, 1);
        c.save()

        
        return embed(message, cc.acceptDone);
      }, a * 1000);
    } else if (upgrade.includes(resp)) {
      const c = await clan.findOne({ID: rp.clanID});
      if (rp.clanID === null) return error(message, cm.noClan);
      if (user.id !== c.owner) return error(message, cm.notLeader);

      let up = 3000;
      let cost = c.level * up;
      if (c.level === 15) return error(message, cc.upLimit)
      if (args[1] && args[1] === "info") {
        const emb = new MessageEmbed()
        .setColor(main)
        .setTimestamp()
        .setAuthor(cc.upInfoTitle)
        .setDescription(cc.upInfo(cost, CLAN, c.space, c.level+1))

        return message.channel.send({embeds: [emb]})
      }
      let a = Math.round(Math.random() * 6) + 1
      if (c.level === 5 && !bag["vip1"]) return error(message, cc.upVip)
      const msg = await message.channel.send(`<a:dannloading:876008681479749662> ${cc.upDo}`)

      setTimeout(async () => {
        msg.delete()
        if (c.budget < cost) return error(message, cc.errorRub)
        
        await clan.updateOne({ID: c.ID}, {$inc: {budget: -cost}});
        await clan.updateOne({ID: c.ID}, {$inc: {level: 1}});
        await clan.updateOne({ID: c.ID}, {$inc: {space: 5}});

        return embed(message, cc.upped(c.level+1));

      }, a * 1000)
    } else if (description.includes(resp)) {
      const c = await clan.findOne({ID: rp.clanID});
      if (rp.clanID === null) return error(message, cm.noClan);
      if (user.id !== c.owner) return error(message, cm.notLeader);
      if (!args[1]) return error(message, cc.descError)
      if (c.level < 5) return error(message, cc.clanLevel5)
      let getLimit = args.slice(1).join(" ").split("")
      if(getLimit.length > 400) return error(message, maxLimit(400))
      const descriptionText = args.slice(1).join(" ");
      await clan.updateOne({ID: c.ID}, {$set: {description: descriptionText}});

      return embed(message, cc.descDone);
    } else if (logo.includes(resp)) {
      const c = await clan.findOne({ID: rp.clanID});
      if (rp.clanID === null) return error(message, cm.noClan);
      if (user.id !== c.owner) return error(message, cm.notLeader);
      if (!args[1]) return error(message, specifyL)
      if (c.level < 5) return error(message, cc.clanLevel5)
      if(!isWebUri(args.slice(1).join(""))) return error(message, specifyL)
      await clan.updateOne({ID: c.ID}, {$set: {logo: args.slice(1).join("")}});

      return embed(message, cc.logoDone);
    } else if (del.includes(resp)) {
      const now = ops.queue.get(user.id);
      if (now) return
      const c = await clan.findOne({ID: rp.clanID});
      if (rp.clanID === null) return error(message, cm.noClan);
      if (user.id !== c.owner) return error(message, cm.notLeader);

      const button1 = new MessageButton()
            .setCustomId('previousbtn')
            .setLabel(buttonNo)
            .setStyle('DANGER');

            const button2 = new MessageButton()
            .setCustomId('nextbtn')
            .setLabel(buttonYes)
            .setStyle('SUCCESS');

      let buttonList = [
          button1,
          button2
      ]

      const Emb = new MessageEmbed()
      .setColor(main)
      .setTimestamp()
      .setAuthor(user.username, user.displayAvatarURL({dynamic: true}))
      .setTitle(cc.quest)
      
      ops.queue.set(user.id, {name: "deleting"})
      
      const row = new MessageActionRow().addComponents(buttonList);
      const curPage = await message.reply({
        embeds: [Emb],
        components: [row],
      })
      
      const filter = (i) =>
      (i.customId === buttonList[0].customId ||
      i.customId === buttonList[1].customId) &&
      i.user.id === user.id;

      const collector = await curPage.createMessageComponentCollector({
      filter,
      time: 15000,
      });


      collector.on("collect", async (i) => {
        if(i.customId === buttonList[0].customId) {
          await i.deferUpdate()
          if (!curPage.deleted) {
            const disabledRow = new MessageActionRow().addComponents(
              buttonList[0].setDisabled(true),
              buttonList[1].setDisabled(true)
            );
            curPage.edit({
              embeds: [Emb.setTitle(cc.canceled)],
              components: [disabledRow],
            });
          }
          ops.queue.delete(user.id)
          collector.stop()
        } else if (i.customId === buttonList[1].customId) {
          await i.deferUpdate()
          await rpg.updateMany({clanID: c.ID}, {$set: {clanID: null}})
          await c.delete()
          const disabledRow = new MessageActionRow().addComponents(
            buttonList[0].setDisabled(true),
            buttonList[1].setDisabled(true)
          );
          curPage.edit({
            embeds: [Emb.setTitle(cc.deleteDone)],
            components: [disabledRow],
          });//
          ops.queue.delete(user.id)
          collector.stop()
        }
      })
    
      collector.on("end", () => {
        if (!curPage.deleted) {
          const disabledRow = new MessageActionRow().addComponents(
            buttonList[0].setDisabled(true),
            buttonList[1].setDisabled(true)
          );
          curPage.edit({
            components: [disabledRow],
          });
        }
        ops.queue.delete(user.id)
      });
      
      
    } else if (reward.includes(resp)) {
      const c = await clan.findOne({ID: rp.clanID});
      if (rp.clanID === null) return error(message, cm.noCLan);
      if (user.id !== c.owner && !c.staff.includes(user.id)) return error(message, perm);
      
      let author = await c.reward;
      let timeout = 86400 * 1000 
      if (author !== null && timeout - (Date.now() - author) > 0) {
          let time = new Date(timeout - (Date.now() - author));
  
          return error(message, cc.rewardTime(time));
      }

      let rew = c.level * 300

      const users = await rpg.find({clanID: c.ID}).exec()
      await clan.updateOne({ID: c.ID}, {$set: {reward: Date.now()}})
      await users.forEach(async asd => await bd.updateOne({userID: asd.userID}, {$inc: {stars: rew}}))
      
      return embed(message, cc.getReward(rew, STAR))
    } else if (leave.includes(resp)) {
      const now = ops.queue.get(user.id);
      if (now) return
      const c = await clan.findOne({ID: rp.clanID});
      if (rp.clanID === null) return error(message, cm.noClan);
      if (user.id === c.owner) return error(message, cc.ldCant);

      const button1 = new MessageButton()
      .setCustomId('previousbtn')
      .setLabel(buttonNo)
      .setStyle('DANGER');

      const button2 = new MessageButton()
      .setCustomId('nextbtn')
      .setLabel(buttonYes)
      .setStyle('SUCCESS');

      let buttonList = [
          button1,
          button2
      ]

      const Emb = new MessageEmbed()
      .setColor(main)
      .setTimestamp()
      .setAuthor(user.username, user.displayAvatarURL({dynamic: true}))
      .setTitle(cc.leaveQuest)

      ops.queue.set(user.id, {name: "deleting"})

      const row = new MessageActionRow().addComponents(buttonList);
      const curPage = await message.reply({
        embeds: [Emb],
        components: [row],
      })

      const filter = (i) =>
      (i.customId === buttonList[0].customId ||
      i.customId === buttonList[1].customId) &&
      i.user.id === user.id;

      const collector = await curPage.createMessageComponentCollector({
      filter,
      time: 15000,
      });

      collector.on("collect", async (i) => {
        if(i.customId === buttonList[0].customId) {
          await i.deferUpdate()
          if (!curPage.deleted) {
            const disabledRow = new MessageActionRow().addComponents(
              buttonList[0].setDisabled(true),
              buttonList[1].setDisabled(true)
            );
            curPage.edit({
              embeds: [Emb.setTitle(cc.canceled)],
              components: [disabledRow],
            });
          }
          ops.queue.delete(user.id)
          collector.stop()
        } else if (i.customId === buttonList[1].customId) {
          await i.deferUpdate()
          await rpg.updateOne({userID: user.id}, {$set: {clanID: null}});
          const disabledRow = new MessageActionRow().addComponents(
            buttonList[0].setDisabled(true),
            buttonList[1].setDisabled(true)
          );
          
          if (c.staff.includes(user.id)) {
            await c.staff.splice(c.staff.indexOf(user.id), 1);
            c.save()
          }
          
          curPage.edit({
            embeds: [Emb.setTitle(cc.leaveDone)],
            components: [disabledRow],
          });//
          ops.queue.delete(user.id)
          collector.stop()
        }
      })
      
      collector.on("end", () => {
        if (!curPage.deleted) {
          const disabledRow = new MessageActionRow().addComponents(
            buttonList[0].setDisabled(true),
            buttonList[1].setDisabled(true)
          );
          curPage.edit({
            components: [disabledRow],
          });
        }
        ops.queue.delete(user.id)
      });
      
    } else if (up.includes(resp)) {
      const c = await clan.findOne({ID: rp.clanID});
      if (rp.clanID === null) return error(message, cm.noClan);
      if (user.id !== c.owner) return error(message, cm.notLeader);
      const a = await rpg.find({clanID: c.ID}).exec()
      const a1 = args[1];
      
      if (!a1 || isNaN(a1)) return error(message, cm.specN);
      if (a1 > a.length || Math.round(a1) <= 0) return error(message, notUser)
      const i = a1 - 1;
      
      const memb = a[i]["userID"];
      if(memb === c.owner) return error(message, cc.uLeader);
      
      if(c.staff.includes(memb)) return error(message, cc.uError);
      const count = c.space / 5;
      if (count === c.staff.length) return error(message, cc.uLimit);

      await c.staff.push(memb);
      c.save()

      return embed(message, cc.uDone)
      
    } else if (down.includes(resp)) {
      const c = await clan.findOne({ID: rp.clanID});
      if (rp.clanID === null) return error(message, cm.noClan);
      if (user.id !== c.owner) return error(message, cm.notLeader);

      const a = await rpg.find({clanID: c.ID}).exec()
      const a1 = args[1];
      
      if (!a1 || isNaN(a1)) return error(message, cm.specN);
      if (a1 > a.length || Math.round(a1) <= 0) return error(message, notUser)
      const i = a1 - 1;
      
      const memb = a[i]["userID"];
      if(memb === c.owner) return error(message, cc.uLeader);
      
      if(!c.staff.includes(memb)) return error(message, cc.dError);
      
      await c.staff.splice(c.staff.indexOf(memb), 1);
      c.save()

      return embed(message, cc.dDone)
    } else if (mess.includes(resp)) {
      if (rp.clanID === null) return error(message, cm.noClan);
      let getCl = await clan.findOne({ID: rp.clanID});
      if(message.author.id !== getCl.owner) return error(message, cm.notLeader);

      if (!args[1]) return error(message, specifyT);
      let text = args.slice(1).join(" ").split("")
      if (text.length > 300) return error(message, maxLimit(300));
      text = text.join("")

      const users = await rpg.find({clanID: getCl.ID}).exec()

      const send = new MessageEmbed()
      .setColor(main)
      .setAuthor(cc.mTitle)
      .setFooter(bot.users.cache.get(getCl.owner).tag, bot.users.cache.get(getCl.owner).displayAvatarURL({dynamic: true}))
      users.forEach((user) => {
        if (getCl.owner !== user.userID) {
          const DM = bot.users.cache.get(user.userID)
          DM.send({embeds: [send.setDescription(text)]}).catch(() => `ID: ${user.userID}`)
        }
        
     })
     return embed(message, cc.mDone)
    } else if(give.includes(resp)) {
      if (!rp.clanID) return error(message, cm.noClan);
      let getCl = await clan.findOne({ID: rp.clanID});
      if(message.author.id !== getCl.owner) return error(message, cm.notLeader);
      let budget = getCl.budget;
      if (args[1] && !isNaN(args[1]) && args[1] <= budget) {budget = Math.floor(args[1])};
      const space = await rpg.find({clanID: getCl.ID}).exec();
      if (budget < space.length) return message.react(DISAGREE);
      let value = Math.round(budget / space.length);
      if (value <= 0) value = 1;
      
      await clan.updateOne({ID: getCl.ID}, {$inc: {budget: -budget}});
      space.forEach(async (data) => {
        await bd.updateOne({userID: data.userID}, {$inc: {stars: value}});
      })

    
      message.react(AGREE)

    } else if(shop.includes(resp)) {
      if (!rp.clanID) return error(message, cm.noClan);
      let getCl = await clan.findOne({ID: rp.clanID});
      if(message.author.id !== getCl.owner) return error(message, cm.notLeader);
      let budget = getCl.budget;

      const addHealth = getCl.addHealth || 0;
      const addDamage = getCl.addDamage || 0;
      const adding = 0.2;
      const cost = 100000;

      const hero = {
        name: "Humanoid",
        cost: 20000000
      };

      const emb = new MessageEmbed()
      .setColor(main)
      .setAuthor(cc.shopName)
      .setDescription(stripIndents`
      ${cc.write}
      
      ${cc.bonusHealth} **${addHealth}%**
      ${cc.bonusDamage} **${addDamage}%**
      `)
      .addField(`1. ❤ ${addHealth} + ${adding}`, `${cc.cost} ${formatNumber(cost)} ${CLAN}`)
      .addField(`2. ⚔ ${addDamage} + ${adding}`, `${cc.cost} ${formatNumber(cost)} ${CLAN}`)
      .addField(`3. ${cc.appType.h} __${heroes[hero.name].nameRus}__ ${cc.forEach}`, `${cc.cost} ${formatNumber(hero.cost)} ${CLAN}`)

      const m1 = await message.reply({embeds: [emb]});

      const collector = await message.channel.createMessageCollector({
        filter: m => m.author.id === message.author.id,
        time: 14000
      });

      let bool = false;
      
      collector.on("collect", async msg => {
        let m = msg.content;
        if (!isNaN(m) && Math.round(m) > 0 && Math.round(m) <= 3) {
          bool = true;
          collector.stop();
          m = Math.round(m);
          if (m === 1) {
            const newClanData = await clanFind(rp.clanID);

            if (newClanData.budget < cost) return error(message, cc.errorRub);

            await clan.updateOne({ID: rp.clanID}, {$inc: {
              addHealth: adding,
              budget: -cost
            }});
            return msg.react(AGREE);
          } else if (m === 2) {
            const newClanData = await clanFind(rp.clanID);

            if (newClanData.budget < cost) return error(message, cc.errorRub);

            await clan.updateOne({ID: rp.clanID}, {$inc: {
              addDamage: adding,
              budget: -cost
            }});
            return msg.react(AGREE);
          } else if (m === 3) {
            const newClanData = await clanFind(rp.clanID);

            if (newClanData.budget < hero.cost) return error(message, cc.errorRub);
            
            const guildMembers = await rpg.find({clanID: {$exists: true}}).exec();

            await guildMembers.forEach(async obj => {
              const checkHero = obj.heroes.find(x => x.name === hero.name);
              if (!checkHero) {
                obj.heroes.push({
                  name: hero.name,
                  health: heroes[hero.name].health,
                  damage: heroes[hero.name].damage,
                  level: 1
                });
                await obj.save();
              };
            });

            await clan.updateOne({ID: rp.clanID}, {$inc: {budget: -hero.cost}});
            return msg.react(AGREE);
          }
        }
      });

      collector.on("end", () => {
        m1.delete()
        if (!bool) return error(message, timeOut);
      })
      
    } else {
      return error(message, cc.actionError);
    }
    

  }
};
