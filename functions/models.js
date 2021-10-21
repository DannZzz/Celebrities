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
const powers = require("../models/powers.js");
const mail = require("../models/mail.js");
const lf = require("../models/locationFarm.js");
const partner = require("../models/partner.js");

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
    powers,
    lf,
    mail,
    partner,

    partnerFindCode: async (code) => {
        const data = await partner.findOne({code: code});
        if (!data) {
            return false;
        } else {
            return data;
        };
    },

    partnerFind: async (id) => {
        const data = await partner.findOne({userID: id});
        if (!data) {
            return false;
        } else {
            return data;
        };
    },

    mailFind: async (id) => {
        const data = await mail.findOne({userID: id});
        if (!data) {
            return false;
        } else {
            return data;
        };
    },

    lfFind: async (id) => {
        const data = await lf.findOne({userID: id});
        if (!data) {
            return false;
        } else {
            return data;
        };
    },

    powersFind: async (id) => {
        const data = await powers.findOne({userID: id});
        if (!data) {
            return false
        } else {
            return data;
        };
    },
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

    addCrystal: async (id, amount) => {
        await bag.updateOne({userID: id}, {$inc: {crystal: Math.round(amount)}}).catch(() => false);
    },
    
    addStar: async (id, amount) => {
        await bag.updateOne({userID: id}, {$inc: {stars: Math.round(amount)}}).catch(() => false);
    },
    addPremiumStar: async (bot, id, amount, number = false) => {
        const server = bot.guilds.cache.get("882589567377637408");

        const boosterRoleIds = {
            classic: "897172766929858601",
            premium: "897172906021371926",
            premiumPlus: "897172954411053098"
        };

        let boostCount = 0;
        if (server) {
            const member = server.members.cache.get(id);
            if (member) {
                if (member.roles.cache.get(boosterRoleIds.premiumPlus)) {
                    boostCount = 15;
                } else if (member.roles.cache.get(boosterRoleIds.premium)) {
                    boostCount = 10;
                } else if (member.roles.cache.get(boosterRoleIds.classic)) {
                    boostCount = 5;
                }
            }
        };

        const data = await powers.findOne({userID: id});
        let dataValue = 0;
        if (data && data.gold) dataValue = data.gold.value;

        const finPerc = dataValue + boostCount;

        let finalAmount = Math.round(amount + (amount * finPerc / 100));

        if (amount < 0)
            finalAmount = amount;

        if (number) {
            return finalAmount;
        }

        await bag.updateOne({ userID: id }, { $inc: { stars: Math.round(finalAmount) } }).catch(() => false);
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