const heroes = require("../../JSON/heroes.json");
const { main } = require("../../JSON/colours.json");
const { serverFind } = require("../../functions/models");
const { FORCE, MEDAL, LEFT, RIGHT } = require("../../config");
const { forceGenerator, pagination } = require("../../functions/functions");

const { MessageEmbed, MessageButton } = require("discord.js");

module.exports = {
    config: {
        name: "heroes-rate",
        aliases: ["рейтинг-героев"],
        category: "h_roleplay"
    },

    run: async (bot, msg) => {
        const server = msg.guild;
        const user = msg.author;
        const sd = await serverFind(server.id);

        const { } = require(`../../languages/${sd.lang || "ru"}`);

        const arr = [];
        
        for (let h in heroes) {
            const hero = heroes[h];
            arr.push({
                nameRU: hero.nameRus,
                nameEN: hero.name,
                force: forceGenerator(hero.damage, hero.health, 1)
            });
        };

        const sorted = arr.sort((a, b) => b.force - a.force);
        const texted = sorted.map((obj, pos) => {
            let emoji;
            if (pos === 0) emoji = MEDAL.gold;
            if (pos === 1) emoji = MEDAL.silver;
            if (pos === 2) emoji = MEDAL.bronze;
            if (!emoji) emoji = "";
            let position = pos + 1 +". ";
            if (emoji) position = "";

            return `${emoji} ${position} ${sd.lang === "en" ? obj.nameEN : obj.nameRU} | ${FORCE} ${obj.force}`;
        });

        let i = 0;
        let arr2 = []
        for (i; i < texted.length; i += 15) {
            arr2.push(new MessageEmbed()
            .setColor(main)
            .setAuthor(sd.lang === "en" ? "Heroes's rating" : "Рейтинг героев")
            .setDescription(texted.slice(i, i+15).join("\n"))
            .setThumbnail(bot.user.displayAvatarURL())
            );
        }


        const b1 = new MessageButton()
        .setCustomId("goLEFT")
        .setStyle("SECONDARY")
        .setEmoji(LEFT)

        const b2 = new MessageButton()
        .setCustomId("goRIGHT")
        .setStyle("SECONDARY")
        .setEmoji(RIGHT)

        await pagination(msg, arr2, [b1, b2], 100000, [user.id]);


    }
};