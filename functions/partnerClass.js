const { server, cardFind, bagFind, serverFind, card: cd, bag, addStar, rpgFind, partner, partnerFind, partnerFindCode, addCrystal } = require("./models");
const { error, embed, firstUpperCase, randomRange, delay, sendToMail, pagination, makeTimestamp } = require("./functions");
const { none, main } = require("../JSON/colours.json");
const { AGREE, DISAGREE, STAR, LEFT, RIGHT, CRYSTAL } = require("../config");
const { partnerServer } = require("../rewards.json");
const { stripIndents } = require("common-tags");
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageCollector, MessageButton } = require("discord.js");

const donator = 25;
const part = 15;

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
                first: `You can give this promo code to your friend or acquaintance, and if, during the subsequent donation, a person indicates your promo code, he will receive ${donator} ${CRYSTAL} as a bonus, and you will also receive a bonus of ${part} ${CRYSTAL} for using your promo code.\n\nA server with ${partnerServer.requiredCountOfMembers} members can connect your code, you will get ${partnerServer.reward} ${CRYSTAL}. Only the owner of the server can connect!\n\n**Important!\nYou will not be able to use your personal code for yourself.**`,
                already: "You already have a personal code.",
                canceled: "Action canceled successfully.",
                done: "You have successfully created a personal code - ",
                req: stripIndents`\`Specify username now\`, for personal code, maximum length - 15 characters (__this code cannot be changed!__)\nWrite \`cancel\` to cancel the action.`
            },

            ru: {
                first: `Вы можете дать этот промо-код своему другу или знакомому и, если при последующем донате человек укажет Ваш промо-код, то он получит - ${donator} ${CRYSTAL} бонусом, Вам же будет бонус в размере - ${part} ${CRYSTAL} за использование вашего промо-кода.\n\nСервер, имеюший ${partnerServer.requiredCountOfMembers} участников, может подключить ваш код, вы получите ${partnerServer.reward} ${CRYSTAL}. Подключить может только Владелец сервера!\n\n**Важно!\nВы не сможете использовать свой персональный код для себя.**`,
                already: "Вы уже имеете персональный код.",
                canceled: "Действие успешно отменено.",
                done: "Вы успешно создали персональный код - ",
                req: stripIndents`\`Укажите ник сейчас\`, для персонального кода, максимальная длина - 15 символов (__этот код изменить нельзя!__)\nНапишите \`cancel\`, чтобы отменить действие.`
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

    async serverCode(code) {
        let sd = await serverFind(this.server.id);
        const { again } = require(`../languages/${sd.lang || "ru"}`);
        if (!sd.partnerCode || (sd.partnerCode && sd.partnerCode.date < new Date)) {
            await server.updateOne({serverID: this.server.id}, {$set: {partnerCode: undefined}});
            sd = await serverFind(this.server.id);
            const partner = await partnerFindCode(code);
            if (!partner) return error(this.msg, sd.lang === "en" ? "Partner not found." : "Партнер не найден!");
            
            const memberCount = this.server.members.cache.filter(member => !member.user.bot);
            if (partnerServer.requiredCountOfMembers > (memberCount.length || memberCount.size)) return error(this.msg, sd.lang === "en" ? `This server need ${partnerServer.requiredCountOfMembers} for connecting a partner code.` : `Сервер должен иметь не менее ${partnerServer.requiredCountOfMembers} участников, чтобы подключить партнер-код.`);

            await server.updateOne({serverID: this.server.id}, {$set: {partnerCode: {
                code,
                date: new Date(Date.now() + (86400000 * 7) )
            }}});

            await addCrystal(partner.userID, partnerServer.reward);

            await sendToMail(partner.userID, {textMessage: `+ ${partnerServer.reward} ${CRYSTAL}, Server: \`${this.server.name}\`.`, createdAt: new Date()});
            
            return this.msg.react(AGREE);
        } else {
            return error(this.msg, `${sd.lang === "en" ? "This server's partner code -" : "Партнер-код этого сервера -"} \`${sd.partnerCode.code}\`\n${again} <t:${makeTimestamp(sd.partnerCode.date.getTime())}:R>`);
        }
        
        
    }

    async getData() {
        const sd = await serverFind(this.server.id);
        const bool = sd.lang === "en";
        const data = await partnerFind(this.id);
        if (!data) return error(this.msg, bool ? "You don't have a personal partner code." : "Вы не имеете персональный партнер-код.");

        const emb = new MessageEmbed()
            .setColor(main)
            .setAuthor(this.user.username, this.user.displayAvatarURL({ dynamic: true }))
            .setTitle(bool ? "Your personal code is:" : "Твой персональный код:")
            .setDescription(bool ? `\`${data.code}\`\n\nYou can give this promo code to your friend or acquaintance, and if, during the subsequent donation, a person indicates your promo code, he will receive ${donator} ${CRYSTAL} as a bonus, and you will also receive a bonus of ${part} ${CRYSTAL} for using your promo code.\n\nA server with ${partnerServer.requiredCountOfMembers} members can connect your code, you will get ${partnerServer.reward} ${CRYSTAL}. Only the owner of the server can connect!\n\n**Important!\nYou will not be able to use your personal code for yourself.**` : `\`${data.code}\`\n\nВы можете дать этот промо-код своему другу или знакомому и, если при последующем донате человек укажет Ваш промо-код, то он получит - ${donator} ${CRYSTAL} бонусом, Вам же будет бонус в размере - ${part} ${CRYSTAL} за использование вашего промо-кода.\n\nСервер, имеюший ${partnerServer.requiredCountOfMembers} участников, может подключить ваш код, вы получите ${partnerServer.reward} ${CRYSTAL}. Подключить может только Владелец сервера!\n\n**Важно!\nВы не сможете использовать свой персональный код для себя.**`)

        return this.msg.reply({ embeds: [emb] });
    };

    async addNewPartner(code, id) {
        const data = await partnerFindCode(code);
        if (!data) return error(this.msg, "Персональный код не найден!");
        const user = this.bot.users.cache.get(id);
        if (!user) return error(this.msg, "Айди донатера не найден!");
        if (data.userID === id) return error(this.msg, "Айди донатера и партнера совпадает!");
        await addCrystal(data.userID, part);
        await addCrystal(id, donator);

        await sendToMail(data.userID, {textMessage: `+ ${part} ${CRYSTAL}, Partner: \`${code}\`.`, createdAt: new Date()});
        await sendToMail(id, {textMessage: `+ ${donator} ${CRYSTAL}, Partner: \`${code}\`.`, createdAt: new Date()});
        this.msg.react(AGREE);
    }


};

module.exports = function (bot, msg) {
    return new PartnerClass(bot, msg);
}