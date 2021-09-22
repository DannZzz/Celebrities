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

        const ques = 3000;
        const rew = 10000;
        
        const taskData = {
            idName: "spendStars",
            EN: `Make ${ques} messages.`,
            RU: `Написать ${ques} сообщений`,
            goal: ques,
            status: false,
            doneEN: `You successfully did the task, your reward - ${rew} ` + STAR,
            doneRU: `Вы успешно выполнили задание, ваша наград - ${rew} ` + STAR,
            reward: rew,
        }
        await rpg.updateMany({}, {$set: {tasks: []}});
        await rpg.updateMany({}, {$set: {task1: 1}});
        await rpg.updateMany({}, {$set: {["tasks.0"]: taskData}});
        await rpg.updateMany({}, {$set: {spendTask: 0}});
        msg.react(AGREE)
    }
}