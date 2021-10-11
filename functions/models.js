const rpg = require("../models/rpgSchema");
const bag = require("../models/begSchema");
const clan = require("../models/clanSchema");
const custom = require("../models/customSchema");
const marry = require("../models/marry");
const member = require("../models/memberSchema");
const profile = require("../models/profileSchema");
const server = require("../models/serverSchema");
const vip = require("../models/vipSchema");
const card = require("../models/cards");
const promocodes = require("../models/promocodes");
const bans = require("../models/banning");
const power = require("../models/powerUpdating.js");

module.exports = {
    rpg,
    bag,
    clan,
    custom,
    marry,
    profile,
    member,
    server,
    vip,
    card,
    promocodes,
    bans,
    power,
    powerFind: async (id) => {
        const data = await power.findOne({userID: id});
        if (!data) {
            return false
        } else {
            return data;
        };
    },
    bansFind: async (id) => {
        const data = await bans.findOne({userID: id});
        if (!data) {
            return false
        } else {
            return data;
        };
    },
    promoFind: async (code) => {
        const data = await promocodes.findOne({code: code});
        if (!data) {
            return false
        } else {
            return data;
        };
    },
    cardFind: async (id, name) => {
        const data = await card.findOne({userID: id, name: name});
        if (!data) {
            return false
        } else {
            return data;
        };
    },
    addStar: async (id, amount) => {
        await bag.updateOne({userID: id}, {$inc: {stars: Math.round(amount)}}).catch(() => false);
    },
    rpgFind: async (id) => {
        const data = await rpg.findOne({userID: id});
        if (!data) {
            return false
        } else {
            return data;
        };
    },
    profileFind: async (id) => {
        const data = await profile.findOne({userID: id});
        if (!data) {
            return false
        } else {
            return data;
        };
    },
    bagFind: async (id) => {
        const data = await bag.findOne({userID: id});
        if (!data) {
            return false
        } else {
            return data;
        };
    },
    clanFind: async (id) => {
        const data = await clan.findOne({ID: id});
        if (!data) {
            return false;
        } else {
            return data;
        };
    },
    memberFind: async (userId, serverId) => {
        const data = await member.findOne({userID: userId, serverID: serverId});
        if (!data) {
            return false
        } else {
            return data;
        };
    },
    serverFind: async (id) => {
        const data = await server.findOne({serverID: id});
        if (!data) {
            return false;
        } else {
            return data;
        };
    },
    vipFind: async (id) => {
        const data = await vip.findOne({userID: id});
        if (!data) {
            return false;
        } else {
            return data;
        };
    }
};