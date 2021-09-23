const {rpg} = require("../../functions/models");
const F = require("../../functions/functions");
const {STAR, AGREE, DISAGREE, devID} = require('../../config')

module.exports = {
    config: {
        name: "addtask",
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
        await rpg.updateMany({["tasks.1"]: {$exists: false}}, {$set: {task2: 1, ["tasks.1"]: packData, openedPacks: 0}});
       
        msg.react(AGREE)
    }
}