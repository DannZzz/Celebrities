const {potLVL, potDMG, potHLT, meat, box, pack1, pack2, pack3} = require('../config')

module.exports = {
    dmg: {
        name: "dmg",
        emoji: potDMG,
        effect: 4,
        cost: 50
    },
    lvl: {
        name: "lvl",
        emoji: potLVL,
        effect: 1
    },
    hlt: {
        name: "hlt",
        emoji: potHLT,
        effect: 20,
        cost: 50
    },
    meat: {
        name: "meat",
        emoji: meat,
        effect: 300
    },
    box: {
        name: "box",
        emoji: box,
        cost: 100
    },
    pack1: {
        name: "pack1",
        emoji: pack1,
        cost: 350,
        list: ["Mistress-forest", "Snake-woman", "Dilan", "Archangel", "Selena", "Kumbhakarna"]
    },
    pack2: {
        name: "pack2",
        emoji: pack2,
        cost: 1000,
        list: ["Cthulhu", "Perfect-duo", "Darkangel", "Atalanta"]
    },
    pack3: {
        name: "pack3",
        emoji: pack3,
        cost: 5000,
        list: ["Blazer", "Ariel", "Athena"]
    }
}