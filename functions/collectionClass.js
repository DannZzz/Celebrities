const { cardFind, bagFind, serverFind, card: cd, bag, addStar, rpgFind } = require("./models");
const { error, embed, firstUpperCase, randomRange, delay, sendToMail, pagination } = require("./functions");
const heroes = require("../JSON/heroes.json");
const Collection = require("../JSON/collections.json");
const { none, main } = require("../JSON/colours.json");
const { AGREE, DISAGREE, STAR, LEFT, RIGHT } = require("../config");
const { stripIndents } = require("common-tags");
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageCollector, MessageButton } = require("discord.js");

class CollectionClass {
    constructor(bot, msg) {
        this.msg = msg;
        this.user = msg.author;
        this.id = msg.author.id;
        this.server = msg.guild;
        this.channel = msg.channel;
        this.bot = bot;
    };

    async showCollections() {
        const sd = await serverFind(this.server.id);

        const { } = require(`../languages/${sd.lang || "ru"}`);

        const texted = Collection.map(obj => {
            const ruFunction = function () {
                const getRuNames = obj.list.map((name, pos) => `> ${pos+1}. ${heroes[name]["nameRus"]}`);
                return stripIndents`**${obj.nameRU}**\n
                Герои нужны - ${obj.list.length}
                ${getRuNames.join("\n")}
                
                Награда: __${obj.reward} ${STAR}__`;
            };

            const enFunction = function () {
                const getEnNames = obj.list.map((name, pos) => `> ${pos+1}. ${heroes[name]["name"]}`);
                return stripIndents`**${obj.nameEN}**\n
                Need heroes - ${obj.list.length}
                ${getEnNames.join("\n")}
                
                Reward: __${obj.reward} ${STAR}__`;
            };

            return new MessageEmbed()
                .setColor(main)
                .setThumbnail(this.bot.user.displayAvatarURL({ dynamic: true }))
                .setDescription(sd.lang === "en" ? enFunction() : ruFunction())

        });

        const button1 = new MessageButton()
            .setCustomId("goleft")
            .setEmoji(LEFT)
            .setStyle("SECONDARY")
        const button2 = new MessageButton()
            .setCustomId("goright")
            .setEmoji(RIGHT)
            .setStyle("SECONDARY")

        return await pagination(this.msg, texted, [button1, button2], 100000, [this.id])
    };

    async checkData() {
        const sd = await serverFind(this.server.id);

        const { heroModel: hm } = require(`../languages/${sd.lang || "ru"}`);

        const rp = await rpgFind(this.id);

        const bool = sd.lang === "en";
        
        const myHeroes = rp.heroes || [];
        const myCollection = rp.collections || [];
        
        if (!myHeroes || myHeroes.length === 0) return error(this.msg, hm.noHero);

        let arr = [];
        const checking = function (obj) {
            const number = obj.list.filter( name => {
                const get = myHeroes.find(x => x.name === name);
                if (get) return name;
            });

            if (number.length === obj.list.length && !myCollection.includes(obj.id)) {
                return arr.push(obj);
            }; 
        };

        Collection.forEach(object => checking(object));

        if (arr.length === 0) return error(this.msg, "Вы не собрали ни одной новой коллекции!");

        arr.forEach(async obj => {
            rp.collections.push(obj.id);
            await rp.save();
            await addStar(this.id, obj.reward);
        });

        const texted = arr.map(obj => `${bool ? obj.nameEN : obj.nameRU} - ${obj.reward} ${STAR}`);

        const emb = new MessageEmbed()
        .setColor(main)
        .setAuthor(bool ? "Congratulations!" : "Поздравления!")
        .setDescription(`**${bool ? "You got new Collection!" : "У вас новая коллекция!"}**\n\n${texted.join("\n")}`);

        this.msg.reply({embeds: [emb]});
    
    }
    
};

module.exports = function(bot, msg) {
    return new CollectionClass(bot, msg);
} 