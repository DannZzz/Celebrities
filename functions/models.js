const rpg = require("../models/rpgSchema");
const bag = require("../models/begSchema");
const clan = require("../models/clanSchema");
const custom = require("../models/customSchema");
const marry = require("../models/marry");
const member = require("../models/memberSchema");
const profile = require("../models/profileSchema");
const server = require("../models/serverSchema");
const vip = require("../models/vipSchema");

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