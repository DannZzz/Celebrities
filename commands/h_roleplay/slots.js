const slotItems = ["🍇", "🍉", "🍌", "🍎", "🍒"];
//const slotItems = ["<a:163:849994358828171296>", "<a:164:849994326025043988>", "<a:170:849994324577878037>", "<a:166:849994325831712798>", "<a:168:849994325441773588>"];
const { MessageEmbed } = require('discord.js');
const { greenlight, redlight } = require('../../JSON/colours.json');
const { STAR, AGREE, DISAGREE } = require('../../config');
const { error, embed, perms } = require('../../functions/functions');
const { bagFind, addStar, serverFind } = require('../../functions/models');
const { games } = require("../../rewards.json");

module.exports = {
    config: {
        name: "slots",
        aliases: ["слот", "slot"],
        category: "h_roleplay",
        cooldown: 45
    },
    run: async (bot, message, args) => {
        const sd = await serverFind(message.guild.id);
        const { slots, battle : b, noStar} = require(`../../languages/${sd.lang || "ru"}`);

        let user = message.author;
        const bag = await bagFind(user.id);
        let money = Math.floor(parseInt(args[0]));
        let win = false;

        if (!args[0] || isNaN(args[0])) return error(message, b.bet);

        if (money < 1) return error(message, b.min);

        if (!bag["vip1"] && money > games.main.none) {
            return error(message, b.vip1);
        } else if (!bag["vip2"] && money > games.main.vip) {
            return error(message, b.vip2);
        } else if (bag["vip2"] && money > games.main.premium) {
            return error(message, b.vipError);
          }


        if (money > bag.stars) return error(message, noStar);
        let reward = 0;
        let number = []

        await addStar(user.id, -money);
        
        for (let i = 0; i < 3; i++) { number[i] = Math.floor(Math.random() * slotItems.length); }

        if (number[0] == number[1] && number[1] == number[2]) {
            money = money * 3;
            win = true;
        } else if (number[0] == number[1] || number[0] == number[2] || number[1] == number[2]) {
            money = money * 2;
            win = true;
        }
        if (win) {

            embed(message, `${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}\n\n${AGREE} ${slots.win} ${money} ${STAR}`, false);
            await addStar(user.id, Math.floor(money));
        } else {
            embed(message, `${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}\n\n${DISAGREE} ${slots.lose} ${money} ${STAR}`, false);

        }




    }
}
