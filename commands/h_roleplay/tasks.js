const {rpg, rpgFind, serverFind} = require("../../functions/models");
const {error, embed, roundFunc} = require("../../functions/functions");
const {STAR, AGREE, DISAGREE, devID} = require('../../config');
const {MessageEmbed} = require("discord.js");
const {main} = require('../../JSON/colours.json');

module.exports = {
    config: {
        name: "tasks",
        aliases: ["task", "задания"],
        category: "h_roleplay"
    },
    run: async (bot, msg, args) => {
        const user = msg.author;
        const LANG = await serverFind(msg.guild.id);
        const {tasks: t, buy: b, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   

        const data = await rpgFind(user.id);
        if(!data || data.tasks.length === 0) return error(msg, "Не имеете заданий.");
        const {spendTask: cur, tasks} = data;
        const goal = tasks[0].goal;
        const progress = customBar(cur, goal, 20, "█", "-")
        const emb = new MessageEmbed()
        .setColor(main)
        .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
        .addField(`1. ${LANG.lang === "ru" ? data.tasks[0].RU : data.tasks[0].EN}`, `${cur} ${progress} — ${tasks[0].reward} ${STAR}`)
        
        msg.channel.send({embeds: [emb]})
    }
}

function customBar(perc, ofMaxValue, size, line = '❤', slider = '🖤') {
    if (!perc) throw new Error('Perc value is either not provided or invalid');
    if (!perc && perc !== 0) throw new Error('Perc value is either not provided or invalid');
    if (isNaN(perc)) throw new Error('Perc value is not an integer');
    if (isNaN(ofMaxValue)) throw new Error('ofMaxValue value is not an integer');
    if (isNaN(size)) throw new Error('Size is not an integer');
    const percentage = perc / ofMaxValue; // Calculate the percentage of the bar
    const progress = Math.round((size * percentage)); // Calculate the number of square caracters to fill the progress side.
    const emptyProgress = size - progress; // Calculate the number of dash caracters to fill the empty progress side.
  
    const progressText = line.repeat(progress); // Repeat is creating a string with progress * caracters in it
    const emptyProgressText = slider.repeat(emptyProgress); // Repeat is creating a string with empty progress * caracters in it
    const percentageText = roundFunc(percentage * 100) + '%'; // Displaying the percentage of the bar
  
    const bar = ' ' + progressText + emptyProgressText + ' |' + percentageText; // Creating the bar
    return bar;
}