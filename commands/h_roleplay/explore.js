const { main } = require('../../JSON/colours.json');
const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment, MessageSelectMenu } = require("discord.js");
const {STAR, AGREE, DISAGREE } = require("../../config");
const {error, embed, perms, firstUpperCase, makeTimestamp, delay, roundFunc} = require("../../functions/functions");
const {serverFind, rpgFind, addStar, bagFind, rpg, profileFind, profile, power, powerFind, powersFind } = require("../../functions/models");
const powers = require("../../JSON/powers.json");

module.exports = {
    config: {
        name: "explore",
        aliases: ['изучать'],
        category: 'h_roleplay',
        cooldown: 20
    },
    run: async (bot, msg, args, ops) => {
        const server = msg.guild;
        const user = msg.author;
        const channel = msg.channel;

        const data = await powersFind(user.id);
        const dataPower = await powerFind(user.id);
        const sd = await serverFind(server.id);
        const { noStar, explore: ex } = require(`../../languages/${sd.lang}`);
        
        if (dataPower) return error(msg, `${ex.ends} <t:${makeTimestamp(dataPower.date.getTime())}:R>`);
        ops.explore.set(user.id, {exp: true});
        
        const arr = [];
        for (let item in powers) {
            const i = powers[item];
            if (i.available) {
                const l = data[i.id] ? data[i.id].level : 1;
                const cost = l * i.cost;
                arr.push({
                    label: sd.lang === "en" ? i.nameEN : i.nameRU,
                    description: `${sd.lang === "en" ? "Cost:" : "Цена:"} ${cost || i.cost}`,
                    value: i.id,
                    emoji: i.emoji
                })
            }
        }

        const collector = channel.createMessageComponentCollector({
            time: 15000,
            filter: i => i.isSelectMenu() && i.user.id === user.id,
            max: "1"
        });

        const row = new MessageActionRow().addComponents(new MessageSelectMenu(
            new MessageSelectMenu()
         .setCustomId("gettingItem")
         .setPlaceholder(ex.place)
         .addOptions(arr)
        ));

        const m = await channel.send({content: "ㅤ", components: [row]});

        let bool = false;
        
        collector.on("collect", async (i) => {
            bool = true;
            collector.stop();
            m.delete();
            const val = i.values[0];
            const newest = await powersFind(user.id);


            let v, l;
            if (!newest || !newest[val] || !powers[val]) {
                v = powers[val]["default"];
                l = 1;
            } else {
                const {value, level} = newest[val];
                v = value;
                l = level;
            }

            const currentTime = new Date();
            const expireTime = new Date( currentTime.getTime() + ( 6 * 3600000 * (v/powers[val]["default"] || 1) ) )

            const cost = l * powers[val]["cost"];
            
            const bag = await bagFind(user.id);
            if (bag.stars < cost) {
                ops.explore.delete(user.id);
                return error(msg, noStar)
                };
            await addStar(user.id, -cost);
            
            const newData = await power.create({
                userID: user.id,
                date: expireTime,
                name: powers[val]["id"],
                value: powers[val]["adding"]
            });
            ops.explore.delete(user.id)
            await newData.save();
            
            return embed(msg, `${ex.ends} <t:${makeTimestamp(expireTime.getTime())}:R>`)

        })

        collector.on("end", () => {
            if (!bool) {
                ops.explore.delete(user.id);
                m.delete();
                msg.react(DISAGREE);
            }
        })
        
    }

}
