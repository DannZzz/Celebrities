const { event, eventFind, cardFind, bagFind, serverFind, card: cd, bag, addStar, rpgFind } = require("./models");
const { error, embed, firstUpperCase, randomRange, delay, sendToMail, pagination } = require("./functions");
const { none, main } = require("../JSON/colours.json");
const { AGREE, DISAGREE, STAR, LEFT, RIGHT, HELL } = require("../config");
const { stripIndents } = require("common-tags");
const ITEMS = require("../JSON/items.js");
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageCollector, MessageButton } = require("discord.js");

class EventClass {
    constructor(id) {
        this.id = id;
    };

    async checkDocument() {
        const data = await eventFind(this.id);
        if (!data) {
            const newData = await event.create({
                userID: this.id
            });
            await newData.save();
        };
        return;
    };
    
};

module.exports = function(id) {
    return new EventClass(id);
};