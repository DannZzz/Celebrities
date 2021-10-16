const { lf, lfFind, mailFind, mail, rpg, rpgFind, bagFind, serverFind, bag, addStar, addPremiumStar, promocodes, promoFind } = require("./models");
const { error, embed, firstUpperCase, randomRange, delay, pagination, makeTimestamp } = require("./functions");
const {none, main, reddark} = require("../JSON/colours.json");
const {AGREE, DISAGREE, STAR, HERO, CLAN, LEFT, RIGHT, box: B} = require("../config");
const {MessageAttachment, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageCollector, MessageButton} = require("discord.js");
const Subs = require("./subscriptionClass");
const locs = require("../JSON/locations.js");
const { stripIndents } = require("common-tags");

class Location {
    constructor (bot, msg) {
        this.server = msg.guild;
        this.msg = msg;
        this.user = msg.author;
        this.bot = bot;
        this.channel = msg.channel;
    };

    async startLocationFarm () {
        const data = await lfFind(this.user.id);
        
        const sd = await serverFind(this.server.id);
        if (data) return error(this.msg, `Ждите, пока изучение локации закончится, <t:${makeTimestamp(data.date.getTime())}:R>.`);
        const { timeOut, ERROR, interError } = require(`../languages/${sd.lang || "ru"}`)
        
        const gold = await locs.tropicalForest.reward.generateReward(this.bot, this.msg, true).then(d => d.gold);
        const box = await locs.tropicalForest.reward.generateReward(this.bot, this.msg, true).then(d => d.box);

        const ld = {
            en: `
            1. ${locs.tropicalForest.nameEN} | ${locs.tropicalForest.reward.emoji || ""} Reward: \`${gold.min}-${gold.max}\` ${STAR} or \`${box.min}-${box.max}\` ${B}
            Cost: \`${locs.tropicalForest.cost}\` | Duration: \`1 hour\`
            `,
            ru: `
            1. ${locs.tropicalForest.nameRU} | ${locs.tropicalForest.reward.emoji || ""} Награда: \`${gold.min}-${gold.max}\` ${STAR} или \`${box.min}-${box.max}\` ${B}
            Цена: \`${locs.tropicalForest.cost}\` | Длительность: \`1 час\`
            `
        };

        const validLocs = ["1"];

        const emb = new MessageEmbed()
        .setColor(main)
        .setAuthor(this.user.username, this.user.displayAvatarURL({dynamic: true}))
        .setTitle(sd.lang === "en" ? "Enter the number of location!" : "Введите номер локации!")
        .setDescription(stripIndents`${ld[sd.lang || "ru"]}`);

        const button = new MessageButton()
        .setCustomId("cancelingLocation")
        .setStyle("DANGER")
        .setLabel(sd.lang === "en" ? "Exit" : "Выйти")

        const row = new MessageActionRow().addComponents([button]);

        const m1 = await this.channel.send({embeds: [emb], components: [row]});

        const filter = i => {
            if (i.customId === button.customId && i.user.id === this.user.id) {
                return true;
            } else if (i.user.id !== this.user.id) {
                const intEmbed = new MessageEmbed()
                .setColor(reddark)
                .setTitle(ERROR)
                .setDescription(interError)
            
                return i.reply({embeds: [intEmbed], ephemeral: true})
            }
        };


        const cl1 = await m1.createMessageComponentCollector({
            time: 30000,
            filter,
            max: 1
        });

        const cl2 = await this.channel.createMessageCollector({
            time: 29000,
            filter: m => m.author.id === this.user.id,
        });

        let b1 = false;

        cl1.on("collect", async i => {
            m1.delete();
            b1 = true;
            i.deferUpdate();
            cl1.stop();
            cl2.stop();
            return embed(this.msg, `${sd.lang === "en" ? `Action successfuly declined.` : "Действие успешно отклонено."}`);
        });

        cl1.on("end", () => {
            if (b1) return;
            m1.delete();
            cl2.stop();
            return error(this.msg, timeOut);
        });

        cl2.on("collect", async m => {
            if (!isNaN(m.content) && validLocs.includes(m.content)) {
                if (m.content == 1) {
                    b1 = true;
                    cl1.stop();
                    cl2.stop();
                    m1.delete();
                    const Data = locs["tropicalForest"];
                    await addStar(this.user.id, Data.cost || 0);
                    const newData = await lf.create({
                        userID: this.user.id,
                        date: new Date(Date.now() + Data.time),
                        locationId: Data.id
                    });

                    newData.save();

                    return embed(this.msg, `Изучение локации закончится <t:${makeTimestamp(Date.now() + Data.time)}:R>.`)
                    
                };
            };
        });


        
    }
}

const func = function(bot, msg) {
    return new Location(bot, msg);
};

module.exports = func;