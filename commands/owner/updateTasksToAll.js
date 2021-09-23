const {rpg} = require("../../functions/models");
const F = require("../../functions/functions");
const {STAR, AGREE, DISAGREE, devID} = require('../../config')

module.exports = {
    config: {
        name: "updatetask",
        aliases: ''
    },
    run: async (bot, msg, args) => {
        if(!devID.includes(msg.author.id)) return

        let ques = 3000;
        let rew = 10000;
        
        const taskData = {
            idName: "spendStars",
            EN: `Make ${ques} messages.`,
            RU: `Написать ${ques} сообщений`,
            goal: ques,
            status: false,
            doneEN: `You successfully did the task, your reward - ${rew} ` + STAR,
            doneRU: `Вы успешно выполнили задание, ваша награда - ${rew} ` + STAR,
            reward: rew,
        }
        
        ques = 2;
        rew = 2000;

        const packData = {
            idName: "usePacks",
            EN: `Use ${ques} Egyptian packs.`,
            RU: `Открой ${ques} Египетских паков.`,
            goal: ques,
            status: false,
            doneEN: `You successfully did the task, your reward - ${rew} ` + STAR,
            doneRU: `Вы успешно выполнили задание, ваша награда - ${rew} ` + STAR,
            reward: rew,
        }

        await rpg.updateMany({tasks: {$exists: false}}, {$set: {tasks: []}})
        await rpg.updateMany({["tasks.0"]: {$exists: false}}, {$set: {["tasks.0"]: taskData, task1: 1, spendTask: 0}});
   
        msg.react(AGREE)
    }
}