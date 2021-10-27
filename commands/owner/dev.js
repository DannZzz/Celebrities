const {rpg} = require("../../functions/models");
const F = require("../../functions/functions");
const {STAR, AGREE, DISAGREE, devID, adminID} = require('../../config')

module.exports = {
    config: {
        name: "dev",
        aliases: ''
    },
    run: async (bot, msg, args) => {
        if(!devID.includes(msg.author.id)) return;
        await rpg.updateMany({}, {$unset: {
            loses: "",
            spendTask: "",
            spencAll: "",
            spendAll: "",
            tasks: "",
            task1: "",
            task2: "",
            openedPacks: "",
            tasksCount: "",
            level: "",
            health: "",
            damage: "",
        }});
        return msg.react(AGREE);
    }
}