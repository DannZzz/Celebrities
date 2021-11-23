const {rpg, bag, vip, clan} = require("../../functions/models");
const {error} = require("../../functions/functions");
const {STAR, AGREE, DISAGREE, devID, adminID} = require('../../config')

const Enc = require("../../functions/encryptionClass");

module.exports = {
    config: {
        name: "dev",
        aliases: '',
        dev: true
    },
    run: async (bot, msg, args) => {
        
        const clans = await clan.find().exec();

        await clans.forEach(async clanObj => {
            const name = Enc.encrypt(clanObj.name);
            await clan.updateOne({ID: clanObj.ID}, {$set: {
                name
            }});

            if (clanObj.description) {
                const description = Enc.encrypt(clanObj.description)

                await clan.updateOne({ID: clanObj.ID}, {$set: {
                    description
                }});   
            }
             
        })

        const vips = await vip.find().exec();

        await vips.forEach(async Vip => {
            if (Vip.profileBio) {
                await vip.updateOne({userID: Vip.userID}, {$set: {
                    profileBio: Enc.encrypt(Vip.profileBio)
                }})
            }
        })
        
        return;
        if (!args[0] || !args[1] || !isNaN(args[0]) || isNaN(args[1])) return error(msg, "[gold или selendian] <кол-во>");
        if (args[0].toLowerCase() === "gold") {
            await bag.updateMany({}, {$inc: {stars: Math.round(args[1])}});
            return msg.react(AGREE);
        } else if (args[0].toLowerCase() === "selendian") {
            await bag.updateMany({}, {$inc: {crystal: Math.round(args[1])}});
            return msg.react(AGREE);
        }

    
    }
}