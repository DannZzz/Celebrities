const { cardFind, bagFind, serverFind, card: cd, bag, addStar, rpgFind, partner, partnerFind, partnerFindCode } = require("./models");
const { error, embed, firstUpperCase, randomRange, delay, sendToMail, pagination } = require("./functions");
const { none, main } = require("../JSON/colours.json");
const { AGREE, DISAGREE, STAR, LEFT, RIGHT } = require("../config");
const { stripIndents } = require("common-tags");
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageCollector, MessageButton } = require("discord.js");

const cost = 150000;
const donator = 35000;
const part = 25000;

class PartnerClass {
    constructor(bot, msg) {
        this.msg = msg;
        this.user = msg.author;
        this.id = msg.author.id;
        this.server = msg.guild;
        this.channel = msg.channel;
        this.bot = bot;
    };

    async createPartnerCode() {
        const langData = {
            en: {
                first: "You can give this promo code to your friend or acquaintance, and if, during the subsequent donation, a person indicates your promo code, he will receive 35k gold as a bonus, and you will also receive a bonus of 25k gold for using your promo code.",
                already: "You already have a personal code.",
                canceled: "Action canceled successfully.",
                done: "You have successfully created a personal code - ",
                req: stripIndents`Specify nickname, for personal code, maximum length - 15 characters (__this code cannot be changed!__)\nWrite \`cancel\` to cancel the action.\n\nPrice of the code: ${cost} ${STAR}`
            },

            ru: {
                first: "Вы можете дать этот промо-код своему другу или знакомому и, если при последующем донате человек укажет Ваш промо-код, то он получит - 35к голды бонусом, Вам же будет бонус в размере - 25к голды за использование вашего промо-кода.",
                already: "Вы уже имеете персональный код.",
                canceled: "Действие успешно отменено.",
                done: "Вы успешно создали персональный код - ",
                req: stripIndents`Укажите ник, для персонального кода, максимальная длина - 15 символов (__этот код изменить нельзя!__)\nНапишите \`cancel\`, чтобы отменить действие.\n\nЦена кода: ${cost} ${STAR}`
            }
        };

        const sd = await serverFind(this.server.id);
        const { noStar, timeOut, vipTwo } = require(`../languages/${sd.lang || "ru"}`)

        const lang = langData[sd.lang || "ru"];

        const checking = await partnerFind(this.id);
        if (checking) return error(this.msg, lang.already);

        const isPremium = await bagFind(this.id).then(data => data.vip2 || false);
        if (!isPremium) return error(this.msg, vipTwo);

        const cl1 = await this.channel.createMessageCollector({
            filter: m => m.author.id === this.id,
            time: 30000
        });

        const mes = await embed(this.msg, `<@${this.id}>,\n${lang.first}\n\n` + lang.req, false);

        let bool = false;

        cl1.on("collect", async m => {
            const msg = m.content.toLowerCase().split(" ").join();
            if (msg !== "cancel" && msg.length <= 15) {
                mes.delete();

                bool = true;
                cl1.stop();
                async function creating() {
                    const random = randomRange(1000, 9999);
                    const code = `${msg}%${random}`;
                    const data = await partnerFindCode(code);
                    if (data) return await creating();
                    return code;
                };

                const getCode = await creating();

                const myGold = await bagFind(this.id).then(x => x.stars || 0);

                if (myGold < cost) return error(this.msg, noStar);
                await addStar(this.id, -cost);

                const create = await partner.create({
                    userID: this.id,
                    code: getCode,
                    date: new Date()
                });

                try {
                    create.save();
                } catch {
                    return error();
                };

                return embed(this.msg, lang.done + "`" + getCode + "`");
            } else if (msg === "cancel") {
                bool = true;
                cl1.stop();

                return embed(this.msg, lang.canceled)
            };



        });

        cl1.on("end", () => {
            if (!bool) {
                mes.delete();
                return error(this.msg, timeOut);
            }
        })



    };

    async getData() {
        const sd = await serverFind(this.server.id);
        const bool = sd.lang === "en";
        const data = await partnerFind(this.id);
        if (!data) return error(this.msg, bool ? "You don't have a personal partner code." : "Вы не имеете персональный партнер-код.");

        const emb = new MessageEmbed()
            .setColor(main)
            .setAuthor(this.user.username, this.user.displayAvatarURL({ dynamic: true }))
            .setTitle(bool ? "Your personal code is:" : "Твой персональный код:")
            .setDescription(bool ? `\`${data.code}\`\n\nYou can give this promo code to your friend or acquaintance, and if, during the subsequent donation, a person indicates your promo code, he will receive 35k gold as a bonus, and you will also receive a bonus of 25k gold for using your promo code.` : `\`${data.code}\`\n\nВы можете дать этот промо-код своему другу или знакомому и, если при последующем донате человек укажет Ваш промо-код, то он получит - 35к голды бонусом, Вам же будет бонус в размере - 25к голды за использование вашего промо-кода.`)

        return this.msg.reply({ embeds: [emb] });
    };

    async addNewPartner(code, id) {
        const data = await partnerFindCode(code);
        if (!data) return error(this.msg, "Персональный код не найден!");
        const user = this.bot.users.cache.get(id);
        if (!user) return error(this.msg, "Айди донатера не найден!");
        await addStar(data.userID, part);
        await addStar(id, donator);

        await sendToMail(data.userID, {textMessage: `Вы получили ${part} ${STAR}, по персональному коду.`, createdAt: new Date()});
        await sendToMail(id, {textMessage: `Вы получили ${donator} ${STAR}, используя промокод партнера.`, createdAt: new Date()});
        this.msg.react(AGREE);
    }


};

module.exports = function (bot, msg) {
    return new PartnerClass(bot, msg);
}