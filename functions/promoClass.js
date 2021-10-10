const { clan, clanFind, rpg, rpgFind, bagFind, serverFind, bag, addStar, promocodes, promoFind } = require("./models");
const { error, embed, firstUpperCase, randomRange, delay } = require("./functions");
const {none, main} = require("../JSON/colours.json");
const {AGREE, DISAGREE, STAR, HERO, CLAN} = require("../config");
const {MessageAttachment, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageCollector, MessageButton} = require("discord.js");

class TeamClass {
    constructor (msg) {
        this.msg = msg;
        this.user = msg.author;
        this.channel = msg.channel;
        this.server = msg.guild;
    }

    async addPromo(code, uses, reward) {
        if (!code) return error(this.msg, "Укажите промокод.");
        if (!uses || isNaN(uses) || uses < 1) return error(this.msg, "Укажите кол-во испол.");
        if (!reward || isNaN(reward) || reward < 1) return error(this.msg, "Укажите награду.");
        
        const data = await promoFind(code);
        if (data) return error(this.msg, "Такой код уже существует.");

        const creating = await promocodes.create({
            code,
            max: uses,
            reward
        });
        creating.save().then(() => this.msg.react(AGREE)).catch(() => this.msg.react(DISAGREE));

    }

    async usePromo(code) {
        const sd = await serverFind(this.server.id);
        const {promoClass: pc} = require(`../languages/${sd.lang || en}`);

        const data = await promoFind(code);
        if (!data) return error(this.msg, pc.noPromo);

        const maxUsers = data.max; // number
        const usersArray = data.users; // array
        if (maxUsers <= usersArray.length) return error(this.msg, pc.noAvailable);
        if (usersArray.includes(this.user.id)) return error(this.msg, pc.already);

        data.users.push(this.user.id);
        await data.save()
        await addStar(this.user.id, data.reward);
        return embed(this.msg, `${pc.done} - ${data.reward} ${STAR}`)
    }

    async getAllPromo() {
        const data = await promocodes.find().exec();
        const mapped = data.map( ({reward, code, max, users}) => {
            return `Promo: ${code} | Use: ${users.length}/${max} | ${reward} ${STAR}`
        })

        return embed(this.msg, mapped.join("\n\n"), false);
    }

}

function teamFunc(msg) {
    return new TeamClass(msg);
}

module.exports = teamFunc;

