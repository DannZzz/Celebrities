const quiz = require('../../JSON/quiz.json');
const { main, reddark, greenlight } = require('../../JSON/colours.json');
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { COIN, STAR, AGREE, DISAGREE } = require("../../config");
const { shuffle } = require("../../functions/functions");
const respA = ['A', 'а', "1"]
const respB = ['B', 'b', "2"]
const respC = ['C', 'c', "3"]
const respD = ['D', 'd', "4"]
const {error, embed, perms} = require("../../functions/functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);


module.exports = {
  config: {
    name: "quiz",
    aliases: ['викторина'],
    category: 'h_roleplay'
  },
  run: async (bot, message, args) => {
    
    let limited = rateLimiter.take(message.author.id)
    if(limited) return

    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {quiz: q, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   
    let quiz;
    LANG.lang === "ru" ? quiz = require('../../JSON/quiz.json') : quiz = require('../../JSON/quizEN.json');
    
    let rp = await rpg.findOne({userID: message.author.id});
    if (!rp) {const asd = await rpg.create({
      userID: message.author.id
    })
    asd.save()}
    rp = await rpg.findOne({userID: message.author.id});
    const start = 1;
    const reward = start * rp.quizCount;
    
    let random = Math.floor(Math.random() * quiz.length)
    let newQuizArray = shuffle(quiz)
    let getOneQuestion = newQuizArray[random]
    let randForResp = Math.ceil(Math.random() * 4)
    let getQuestion = getOneQuestion.q;
    let getAnswer = getOneQuestion.a;
    let getResponses = getOneQuestion.r
    let shuffledRes = shuffle(getResponses)
    let a = shuffledRes[0]
    let b = shuffledRes[1]
    let c = shuffledRes[2]
    let d = shuffledRes[3]
    let userResponse;
    let bag = await bd.findOne({userID: message.author.id});
    if (!bag) {
      const asd = await bd.create({
        userID: message.author.id
      })
      asd.save()
    }
    const vip1 = 10;
    const vip2 = 15;

    bag = await bd.findOne({userID: message.author.id});
    let Emb = new MessageEmbed()
    .setColor(main)
    .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
   

   const A = "<:a_:889404071763652688>";
   const B = "<:b_:889404071923056670>";
   const C = "<:c_:889404071944019978>";
   const D = "<:d_:889404071654592562>";
   
    
   const button0 = new MessageButton()
   .setCustomId('previousbtn')
   .setEmoji(A)
   .setStyle('SECONDARY');

   const button1 = new MessageButton()
   .setCustomId('0btn')
   .setEmoji(B)
   .setStyle('SECONDARY');

   const button2 = new MessageButton()
   .setCustomId('lastbtn')
   .setEmoji(C)
   .setStyle('SECONDARY');

   const button3 = new MessageButton()
   .setCustomId('nextbtn')
   .setStyle('SECONDARY')
   .setEmoji(D);

    let buttonList = [
    button0,
    button1,
    button2,
    button3
]

    
    const row = new MessageActionRow().addComponents(buttonList);
    const curPage = await message.reply({
      embeds: [Emb.setDescription(`
${q.time}
${q.question}
\`${getQuestion}\`
      
${A} | ${a}

${B} | ${b}

${C} | ${c}

${D} | ${d}
         `)],
      components: [row],fetchReply: true,
    });
  
    const filter = (i) =>
      (i.customId === buttonList[0].customId ||
      i.customId === buttonList[1].customId ||
      i.customId === buttonList[2].customId ||
      i.customId === buttonList[3].customId) &&
      i.user.id === message.author.id;
  
    const collector = await curPage.createMessageComponentCollector({
      filter,
      time: 15000,
    });
    let asdd = true
    collector.on("collect", async (i) => {
      switch (i.customId) {
        case buttonList[0].customId:
          userResponse = a
          if (userResponse === getAnswer) {
            await bd.findOneAndUpdate({userID: message.author.id}, {$inc: {stars: reward}});
            if (bag["vip2"] && rp.quizCount !== vip2) {
              await rpg.updateOne({userID: message.author.id}, {$inc: {quizCount: 1}});
            } else if (!bag["vip2"] && rp.quizCount < vip1) {
              await rpg.updateOne({userID: message.author.id}, {$inc: {quizCount: 1}});
            }
            curPage.edit({embeds: [Emb.setDescription(`${AGREE} ${q.done} — __${reward}__ ${STAR}.`).setColor(greenlight)]})

          } else {
            await rpg.updateOne({userID: message.author.id}, {$set: {quizCount: 1}});

            curPage.edit({embeds: [Emb.setDescription(`${DISAGREE} ${q.else}`).setColor(reddark)]})
          }
          break;
        case buttonList[1].customId:
          userResponse = b
          if (userResponse === getAnswer) {
            await bd.findOneAndUpdate({userID: message.author.id}, {$inc: {stars: reward}}); 
            if (bag["vip2"] && rp.quizCount !== vip2) {
              await rpg.updateOne({userID: message.author.id}, {$inc: {quizCount: 1}});
            } else if (!bag["vip2"] && rp.quizCount < vip1) {
              await rpg.updateOne({userID: message.author.id}, {$inc: {quizCount: 1}});
            }
            curPage.edit({embeds: [Emb.setDescription(`${AGREE} ${q.done} — __${reward}__ ${STAR}.`).setColor(greenlight)]})

          } else {
            await rpg.updateOne({userID: message.author.id}, {$set: {quizCount: 1}});

            curPage.edit({embeds: [Emb.setDescription(`${DISAGREE} ${q.else}`).setColor(reddark)]})
          }
          break;
        case buttonList[2].customId:
          userResponse = c
          if (userResponse === getAnswer) {
            await bd.findOneAndUpdate({userID: message.author.id}, {$inc: {stars: reward}});
            if (bag["vip2"] && rp.quizCount !== vip2) {
              await rpg.updateOne({userID: message.author.id}, {$inc: {quizCount: 1}});
            } else if (!bag["vip2"] && rp.quizCount < vip1) {
              await rpg.updateOne({userID: message.author.id}, {$inc: {quizCount: 1}});
            }
            curPage.edit({embeds: [Emb.setDescription(`${AGREE} ${q.done} — __${reward}__ ${STAR}.`).setColor(greenlight)]})

          } else {
            await rpg.updateOne({userID: message.author.id}, {$set: {quizCount: 1}});

            curPage.edit({embeds: [Emb.setDescription(`${DISAGREE} ${q.else}`).setColor(reddark)]})
          }
          break;
        case buttonList[3].customId:
          userResponse = d
          if (userResponse === getAnswer) {
            await bd.findOneAndUpdate({userID: message.author.id}, {$inc: {stars: reward}});
            if (bag["vip2"] && rp.quizCount !== vip2) {
              await rpg.updateOne({userID: message.author.id}, {$inc: {quizCount: 1}});
            } else if (!bag["vip2"] && rp.quizCount < vip1) {
              await rpg.updateOne({userID: message.author.id}, {$inc: {quizCount: 1}});
            }
            curPage.edit({embeds: [Emb.setDescription(`${AGREE} ${q.done} — __${reward}__ ${STAR}.`).setColor(greenlight)]})

          } else {
            await rpg.updateOne({userID: message.author.id}, {$set: {quizCount: 1}});

            curPage.edit({embeds: [Emb.setDescription(`${DISAGREE} ${q.else}`).setColor(reddark)]})
          }
          break;
        default:
          break;
      }
      await i.deferUpdate();
      const disabledRow = new MessageActionRow().addComponents(
        buttonList[0].setDisabled(true),
        buttonList[1].setDisabled(true),
        buttonList[2].setDisabled(true),
        buttonList[3].setDisabled(true)
  
      );
      asdd = false
      await i.editReply({
        components: [disabledRow],
      }).catch(()=>interaction.react('❌'));
      return collector.stop();
    });
  
    collector.on("end", async () => {
      if (!curPage.deleted && asdd) {
        const disabledRow = new MessageActionRow().addComponents(
          buttonList[0].setDisabled(true),
          buttonList[1].setDisabled(true),
          buttonList[2].setDisabled(true),
          buttonList[3].setDisabled(true)
    
        );
        await rpg.updateOne({userID: message.author.id}, {$set: {quizCount: 1}});
        curPage.edit({
          embeds: [Emb.setDescription(`${DISAGREE} ${q.err}`).setColor(reddark)],
          components: [disabledRow],
        });
      }
    });
  
  }
};

