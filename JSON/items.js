const {potLVL, potDMG, potHLT, meat, box, pack1, pack2, pack3, donate} = require('../config')

module.exports = {
    box: {
        name: "box",
        NAME: "Лут-Бокс",
        NAMEEN: "Loot-box", 
        emoji: box,
        cost: 750,
        max: 350,
        min: 100
    },
    hlt: {
        name: "hlt",
        NAME: "Зелье жизни",
        NAMEEN: "Potion of health", 
        emoji: potHLT,
        effect: 20,
        cost: 400
    },
    dmg: {
        name: "dmg",
        NAME: "Зелье атаки",
        NAMEEN: "Potion of attack", 
        emoji: potDMG,
        effect: 4,
        cost: 400
    },
    lvl: {
        name: "lvl",
        NAME: "Зелье уровня",
        NAMEEN: "Potion of level", 
        emoji: potLVL,
        effect: 1
    },
    meat: {
        name: "meat",
        NAME: "Мясо",
        NAMEEN: "Meat", 
        emoji: meat,
        effect: 300
    },
    pack1: {
        name: "pack1",
        NAME: "Обычный пак",
        NAMEEN: "Common pack", 
        emoji: pack1,
        cost: 350,
        list: ["Mistress-forest", "Snake-woman", "Dilan", "Archangel", "Selena", "Kumbhakarna"]
    },
    pack2: {
        name: "pack2",
        NAME: "Элитный пак",
        NAMEEN: "Elite pack", 
        emoji: pack2,
        cost: 1000,
        list: ["Cthulhu", "Perfect-duo", "Darkangel", "Atalanta"]
    },
    pack3: {
        name: "pack3",
        NAME: "VIP пак",
        NAMEEN: "VIP pack", 
        emoji: pack3,
        cost: 5000,
        list: ["Hunter", "Blazer", "Ariel", "Athena"]
    },
    tempPack: {
        name: "tempPack",
        NAME: "Египетский пак",
        NAMEEN: "Egyptian pac", 
        emoji: "<:egyptPack:889904478508167198>",
        cost: 6500,
        list: ["Horus", "Thoth-amon", "Anubis", "Sebek", "Hathor", "Supernatural-ramses"]
    },
    donateBox: {
        name: "donateBox",
        NAME: "Донат-бокс",
        NAMEEN: "Donate-box", 
        emoji: donate,
        winRU: "Золото 50.000-200.000",
        winEN: "Gold 50.000-200.000"
    },
    goldBox: {
        name: "goldBox",
        NAME: "Временный бокс",
        NAMEEN: "Temporary box", 
        emoji: "<:tempGold:896036200664674316>",
        list: ["box", "premium"]
    }
}