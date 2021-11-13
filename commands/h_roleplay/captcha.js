const { main, reddark, greenlight } = require('../../JSON/colours.json');
const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require("discord.js");
const { STAR, AGREE } = require("../../config");
const { error, embed, perms, firstUpperCase, makeTimestamp, delay, roundFunc, getHeroData } = require("../../functions/functions");
const { serverFind, rpgFind, addStar, bagFind, rpg, profileFind, profile, addPremiumStar } = require("../../functions/models");
const { Captcha } = require("captcha-canvas");
const cd = new Map();
const { games } = require("../../rewards.json");

module.exports = {
  config: {
    name: "captcha",
    category: "h_roleplay",
    aliases: ["капча"],
    cooldown: 60
  },
  run: async (bot, msg, args, ops) => {
    const server = msg.guild;
    const user = msg.author;
    const channel = msg.channel;

    const sd = await serverFind(server.id);
    const { timeOut } = require(`../../languages/${sd.lang || "ru"}`);
    const now = cd.get(user.id);
    if (now) return;
    cd.set(user.id, "captcha");
    let captchaObj = async () => {
        const c = new Captcha();
        c.async = true;
        c.drawCaptcha({"characters": 10, });
        c.addDecoy();
        c.drawTrace();
        
        return c;
    }
    let reward = games.captcha.none;

    const bag = await bagFind(user.id);
    if (bag.vip2) {
        reward = games.captcha.premium;
    } else if (bag.vip1) reward = games.captcha.vip;
    
    let captcha = await captchaObj();

    let ca = new MessageAttachment(await captcha.png, "captcha.png");
    let m1 = await msg.reply({files: [ca]});


    let bool = false;

    const collector = await channel.createMessageCollector({
        filter: m => m.author.id === user.id,
        time: 30000
    });

    collector.on("collect", async message => {
        const m = message.content;
        if (captcha.text.toLowerCase() === m.toLowerCase()) {
            captcha = await captchaObj();
            ca = new MessageAttachment(await captcha.png, "captcha.png");
            m1.delete();

            const emb = new MessageEmbed()
            .setColor(greenlight)
            .setImage(`attachment://captcha.png`)
            .setAuthor(user.username, user.displayAvatarURL({dynamic: true}))
            .setTitle(sd.lang === "en" ? `Write \`exit\` to stop the action.` : "Напишите \`exit\`, чтобы остановить действие.")
            .setDescription(`${sd.lang === "en" ? `You answered correctly and got ` : "Вы ответили правильно и получили "}${reward} ${STAR}`)
            collector.resetTimer();
            await addStar(user.id, reward);
            m1 = await msg.reply({embeds: [emb], files: [ca]})
        } else if (["exit"].includes(m.toLowerCase())) {
            bool = true;
            collector.stop();
            message.react(AGREE);
        }
        
    });
    collector.on("end", () => {
        m1.delete();
        cd.delete(user.id);
        if (bool) return;
        return error(msg, timeOut)
    })
    
  }
}
