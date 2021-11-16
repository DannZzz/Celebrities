const {rpg, bag} = require("../../functions/models");
const F = require("../../functions/functions");
const {STAR, AGREE, DISAGREE, devID, adminID} = require('../../config')

module.exports = {
    config: {
        name: "track",
        aliases: '',
        dev: true
    },
    run: async (bot, msg, args) => {

        let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        let numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
        const str = args[0];
        if (args[1] && args[1] == 1) {
            letters.forEach(a => msg.channel.send(str+a));
            return;
        } else if (args[1] && args[1] == 2) {
            letters.forEach(a => msg.channel.send(str+a.toUpperCase()));
            return;
        }
        numbers.forEach(a => msg.channel.send(str+a));
        return;

        
        // letters.forEach((a, p) => {
        //     let r1 = Math.floor(Math.random() * letters.length)
        //     let r2 = Math.floor(Math.random() * letters.length)
        //     msg.channel.send(`${str}${letters[r1].toUpperCase()}${letters[r2].toUpperCase()}`)
        // })
    }
}