const { main, greenlight, reddark } = require('../../JSON/colours.json');
const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment } = require("discord.js");
const {STAR, AGREE, DISAGREE } = require("../../config");
const {error, embed, perms, firstUpperCase, makeTimestamp, delay, roundFunc, randomRange} = require("../../functions/functions");
const {serverFind, rpgFind, addStar, bagFind, rpg, profileFind, profile } = require("../../functions/models");

module.exports = {
    config: {
        name: "guess",
        category: "h_roleplay",
        aliases: ["уг-число"],
        cooldown: 15
    },

    run: async (bot, msg, args) => {
        
        const user = msg.author;
        const server = msg.guild;
        const channel = msg.channel;

        const sd = await serverFind(server.id);
        const { guess: g, heroModel: hm, timeOut} = require(`../../languages/${sd.lang}`);
        
        const data = await rpgFind(user.id);
        const bagData = await bagFind(user.id);

        const reward = 500;
        
        let made = 2;
        if (bagData.vip2) {
            made += 2;
        } else if (bagData.vip1) {
            made += 1;
        }

        const current = made;
        const min = 1;
        const max = 30
        
        const random = randomRange(min, max);
        let m = undefined;

        const EmbLose = new MessageEmbed()
            .setColor(reddark)
            .setAuthor(user.username, user.displayAvatarURL({dynamic: true}))
            .setDescription(g.lose)
        
        await game_start();
        async function game_start () {
            if (made === 0) {
                if (!m) return error(msg, g.lose);
                return m.edit({embeds: [EmbLose]});
            }

            console.log(random);
            const Emb = new MessageEmbed()
            .setColor(main)
            .setAuthor(user.username, user.displayAvatarURL({dynamic: true}))
            .setDescription(g.guess(min, max))
            .setTitle(`${hm.health} ${"❤".repeat(made)}`)

            const EmbWin = new MessageEmbed()
            .setColor(greenlight)
            .setAuthor(user.username, user.displayAvatarURL({dynamic: true}))
            .setDescription(`${AGREE} ${g.win} ${reward} ${STAR}`)
            
            if (made !== current) Emb.setTitle(`${hm.health} ${"❤".repeat(made)}\n${DISAGREE} ${g.wrong}`)
            if (m) {
                m.edit({embeds: [Emb]});
            } else {
                m = await channel.send({embeds: [Emb]});
            }


            const collector = await channel.createMessageCollector({
                filter: i => i.author.id === user.id,
                time: 15000
            });

            let bool = false;

            collector.on("collect", async (message) => {
                if (!isNaN(message.content)) {
                    message.delete();
                    bool = true;
                    collector.stop();
                    if (message.content == random) {
                        await addStar(user.id, reward);
                        return m.edit({embeds: [EmbWin]})
                    } else {
                        made -= 1;
                        await game_start();
                    }
                }
            });

            collector.on("end" , () => {
                if (!bool) {
                    m.delete();
                    return error(msg, timeOut);
                }
            })
            
        };

    }
}