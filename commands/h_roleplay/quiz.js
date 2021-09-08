const quiz = require('../../JSON/quiz.json');
const { cyan } = require('../../JSON/colours.json');
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed } = require("discord.js");
const { COIN, STAR, AGREE, DISAGREE } = require("../../config");
const { shuffle } = require("../../functions");
const respA = ['A', 'а', "1"]
const respB = ['B', 'b', "2"]
const respC = ['C', 'c', "3"]
const respD = ['D', 'd', "4"]
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);


module.exports = {
  config: {
    name: "викторина",
    aliases: ['quiz'],
    category: 'h_roleplay',
    description: "Отвечать на вопросы и получать награды.",
    usage: "",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    
    let limited = rateLimiter.take(message.author.id)
    if(limited) return
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
    bag = await bd.findOne({userID: message.author.id});
    const filter = m => m.author.id === message.author.id;
    let Emb = new MessageEmbed()
    .setColor(cyan)
    .setTimestamp()
    .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
    let msg = await embed(message, `
У вас 15 секунд.
Вопрос:
\`${getQuestion}\`

:regional_indicator_a: | ${a}
:regional_indicator_b: | ${b}
:regional_indicator_c: | ${c}
:regional_indicator_d: | ${d}
   `, false);
    await message.channel.awaitMessages({
    filter, 
    max: 1, // leave this the same
    time: 15000,
    errors: ['time'] // time in MS. there are 1000 MS in a second
  }).then(async (collected) => {
    if (respA.includes(collected.first().content)) {
      userResponse = a
      if (userResponse === getAnswer) {
        await bd.findOneAndUpdate({userID: message.author.id}, {$inc: {stars: reward}});
        if (bag["vip2"] && rp.quizCount !== 20) {
          await rpg.updateOne({userID: message.author.id}, {$inc: {quizCount: 1}});
        } else if (!bag["vip2"] && rp.quizCount < 10) {
          await rpg.updateOne({userID: message.author.id}, {$inc: {quizCount: 1}});
        }
        return msg.edit({embeds: [Emb.setDescription(`${AGREE} Вы ответили правильно, ваша награда — __${reward}__ ${STAR}.`)]})

      } else {
        await rpg.updateOne({userID: message.author.id}, {$set: {quizCount: 1}});

        return msg.edit({embeds: [Emb.setDescription(`${DISAGREE} Вы ответили неправильно.`)]})
      }
    } else if (respB.includes(collected.first().content)) {
      userResponse = b
      if (userResponse === getAnswer) {
        await bd.findOneAndUpdate({userID: message.author.id}, {$inc: {stars: reward}}); 
        if (bag["vip2"] && rp.quizCount !== 20) {
          await rpg.updateOne({userID: message.author.id}, {$inc: {quizCount: 1}});
        } else if (!bag["vip2"] && rp.quizCount < 10) {
          await rpg.updateOne({userID: message.author.id}, {$inc: {quizCount: 1}});
        }
         return msg.edit({embeds: [Emb.setDescription(`${AGREE} Вы ответили правильно, ваша награда — __${reward}__ ${STAR}.`)]})

      } else {
        await rpg.updateOne({userID: message.author.id}, {$set: {quizCount: 1}});

        return msg.edit({embeds: [Emb.setDescription(`${DISAGREE} Вы ответили неправильно.`)]})
      }
    } else if (respC.includes(collected.first().content)) {
      userResponse = c
      if (userResponse === getAnswer) {
        await bd.findOneAndUpdate({userID: message.author.id}, {$inc: {stars: reward}});
        if (bag["vip2"] && rp.quizCount !== 20) {
          await rpg.updateOne({userID: message.author.id}, {$inc: {quizCount: 1}});
        } else if (!bag["vip2"] && rp.quizCount < 10) {
          await rpg.updateOne({userID: message.author.id}, {$inc: {quizCount: 1}});
        }
        return msg.edit({embeds: [Emb.setDescription(`${AGREE} Вы ответили правильно, ваша награда — __${reward}__ ${STAR}.`)]})

      } else {
        await rpg.updateOne({userID: message.author.id}, {$set: {quizCount: 1}});

        return msg.edit({embeds: [Emb.setDescription(`${DISAGREE} Вы ответили неправильно.`)]})
      }
        } else if (respD.includes(collected.first().content)) {
      userResponse = d
      if (userResponse === getAnswer) {
        await bd.findOneAndUpdate({userID: message.author.id}, {$inc: {stars: reward}});
        if (bag["vip2"] && rp.quizCount !== 20) {
          await rpg.updateOne({userID: message.author.id}, {$inc: {quizCount: 1}});
        } else if (!bag["vip2"] && rp.quizCount < 10) {
          await rpg.updateOne({userID: message.author.id}, {$inc: {quizCount: 1}});
        }
        return msg.edit({embeds: [Emb.setDescription(`${AGREE} Вы ответили правильно, ваша награда — __${reward}__ ${STAR}.`)]})

      } else {
        await rpg.updateOne({userID: message.author.id}, {$set: {quizCount: 1}});

        return msg.edit({embeds: [Emb.setDescription(`${DISAGREE} Вы ответили неправильно.`)]})
      }
    } else {
        await rpg.updateOne({userID: message.author.id}, {$set: {quizCount: 1}});

      return msg.edit({embeds: [Emb.setDescription(`${DISAGREE} Вы ответили неправильно.`)]});
    }
    console.log('collected :' + collected.first().content)
  }).catch(async() => {
    await rpg.updateOne({userID: message.author.id}, {$set: {quizCount: 1}});
    return msg.edit({embeds: [Emb.setDescription(`${DISAGREE} Время вышло, попробуйте снова.`)]});
    });

  }
};
