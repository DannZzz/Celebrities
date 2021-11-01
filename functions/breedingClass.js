const { bank, bankFind, rpg, profile, profileFind, cardFind, bagFind, serverFind, card: cd, addStar, rpgFind, addPremiumStar, addCandy } = require("./models");
const { error, embed, firstUpperCase, randomRange, delay, sendToMail, pagination, getMember, getHeroData, makeTimestamp, formatNumber } = require("./functions");
const heroes = require("../JSON/heroes.json");
const elements = require("../JSON/elements.json");
const { none, main } = require("../JSON/colours.json");
const { AGREE, DISAGREE, STAR, LEFT, RIGHT, heroNames, LEAGUE, HELL, LOADING } = require("../config");
const { stripIndents } = require("common-tags");
const Rate = require("./rateClass");
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageCollector, MessageButton, MessageAttachment } = require("discord.js");


class breedingClass {
    constructor(bot, msg, sd) {
        this.msg = msg;
        this.user = msg.author;
        this.id = msg.author.id;
        this.server = msg.guild;
        this.channel = msg.channel;
        this.bot = bot;
        this.sd = sd;
    };

    async createInterface() {
        const data = await rpgFind(this.id);
        
        const emb = new MessageEmbed()
        .setColor(main)
        .setThumbnail(this.user.displayAvatarURL({dynamic: true}))
        .setAuthor(this.user.tag, this.user.displayAvatarURL({dynamic: true}))
        
        if (!data.breeding || data.breeding.length === 0) {
            emb.setTitle(`${this.sd.lang === "en" ? "You don't have any breedings!" : "У тебя нет никаких разведений!"}`).setDescription(`${this.sd.lang === "en" ? "For start breeding, write `breeding [first hero] [second hero]`" : "Чтобы начать разведение, напиши `breeding [первый герой] [второй герой]`"}`);
        } else {
            emb.setTitle(`${this.sd.lang === "en" ? "Your currently breedings!" : "Ваши текущие разведения!"}`)
            emb.setDescription(`${this.sd.lang === "en" ? "For getting, write \`collect [number of breeding]\`\nFor throwing, write \`throw [number of breeding]\`" : "Чтобы забрать, напишите \`collect [номер скрещиваний]\`\nЧтобы удалить, напиште \`throw [номер скрещиваний]\`"}`)
            data.breeding.forEach((obj, pos) => {
                if (obj.date < new Date()) {
                    return emb.addField(`${pos+1}. ${this.sd.lang === "en" ? "Breeding ended!" : "Скрещивание закончилось!"}`, `${this.sd.lang === "en" ? `You got hero: ${obj.hero}` : `Вы получили героя: ${heroes[obj.hero].nameRus}`}`)
                } else {
                    return emb.addField(`${pos+1}. ${this.sd.lang === "en" ? `Breeding ends <t:${makeTimestamp(obj.date.getTime())}:R>` : `Скрещивание закончится <t:${makeTimestamp(obj.date.getTime())}:R>`}`, `${this.sd.lang === "en" ? `Heroes:\n${obj.first}\n${obj.second}` : `Герои:\n${heroes[obj.first].nameRus}\n${heroes[obj.second].nameRus}`}`)
                }
            });
        }

        return this.msg.reply({embeds: [emb]});

    }

    async collect(number) {
        const data = await rpgFind(this.id);

        if (!data.breeding || data.breeding.length === 0) return error(this.msg, this.sd.lang === "en" ? "You don't have any breedings!" : "У тебя нет никаких разведений!");
        if (data.itemCount <= data.heroes.length) return error(this.msg, this.sd.lang === "en" ? "You don't have enough place!" : "У тебя недостаточно мест!");
        

        const index = number - 1;
        if (number > data.breeding.length || number <= 0) return error(this.msg, this.sd.lang === "en" ? "Breeding not found." : "Скрещивание не найдено.");
        if (data.breeding[index]["date"] > new Date()) return error(this.msg, this.sd.lang === "en" ? "This breeding is not ended." : "Этот скрещивание не закончилось.")

        const hero = heroes[data.breeding[index]["hero"]];
        const get = data.heroes.find(x => x.name === hero.name);
        if (get) return error(this.msg, this.sd.lang === "en" ? "You already have this hero!" : "Ты уже имеешь этого героя!");

        data.breeding.splice(index, 1)
        data.heroes.push({
            name: hero.name,
            level: 1,
            health: hero.health,
            damage: hero.damage
        });
        await data.save();

        return embed(this.msg, this.sd.lang === "en" ? `You got hero: __${hero.name}__` : `Вы получили героя: __${hero.nameRus}__`);
    };


    async throw(number) {
        const data = await rpgFind(this.id);

        if (!data.breeding || data.breeding.length === 0) return error(this.msg, this.sd.lang === "en" ? "You don't have any breedings!" : "У тебя нет никаких разведений!");
        
        const index = number - 1;
        if (number > data.breeding.length || number <= 0) return error(this.msg, this.sd.lang === "en" ? "Breeding not found." : "Скрещивание не найдено.");
        if (data.breeding[index]["date"] > new Date()) return error(this.msg, this.sd.lang === "en" ? "This breeding is not ended." : "Этот скрещивание не закончилось.")

        const hero = heroes[data.breeding[index]["hero"]];

        data.breeding.splice(index, 1)
        await data.save();

        return embed(this.msg, this.sd.lang === "en" ? `You threw hero: __${hero.name}__` : `Вы получили героя: __${hero.nameRus}__`);
    }

    async addBreeding (hero1, hero2) {
        let data = await rpgFind(this.id);
        if (data.breeding && data.breeding.length >= 3) return error(this.msg, `${this.sd.lang === "en" ? "Wait for the breeding to end." : "Дождитесь окончания разведения."}`);
        if (!data.breeding) await rpg.updateOne({userID: this.id}, {$set: {breeding: []}});
        data = await rpgFind(this.id);
        const percs = {
            common: 50,
            elite: 30,
            furious: 15,
            mythical: 4,
            private: 1
        };

        const dates = {
            common: 1000 * 60 * 5,
            elite: 60 * 60 * 1000,
            furious: 43200 * 1000,
            mythical: 86400 * 1000,
            private: 86400 * 1000 * 2
        };

        const el1 = hero1.elements;

        const el2 = hero2.elements;

        let validHeroes = [];

        for (let i in heroes) {
            const heroObj = heroes[i];
            if (heroObj.available !== "Под") {
                el1.forEach(element => {
                    if (heroObj.elements.includes(element) && !validHeroes.includes(heroObj) && element !== "legendary") validHeroes.push(heroObj);
                });
    
                el2.forEach(element => {
                    if (heroObj.elements.includes(element) && !validHeroes.includes(heroObj) && element !== "legendary") validHeroes.push(heroObj);
                });
            }  
        };
        const heroTypeTaker = randomRange(0, 100);
        let ht = heroTypeTaker;
        if (el1.length === 1 && el2.length ===1) {
            ht += 9;
        } else if (el1.length === 1 || el2.length ===1) {
            ht += 5;
        }
        let heroType;
        if (ht >= percs.common) {
            heroType = "common";
        } else if (ht >= percs.elite) {
            heroType = "elite";
        } else if (ht >= percs.furious) {
            heroType = "furious";
        } else if (ht >= percs.mythical) {
            heroType = "furious";
        } else if (ht <= percs.private) {
            heroType = "private";
        };

        let heroTypeHeroes = validHeroes.filter(obj => obj.type === heroType);
        if (!heroTypeHeroes || heroTypeHeroes.length === 0) {
            const r1 = Math.floor(Math.random() * validHeroes.length);
            heroTypeHeroes = [validHeroes[r1]];
        }

        const random = Math.floor(Math.random() * heroTypeHeroes.length);
        const reward = heroTypeHeroes[random];

        data.breeding.push({
            first: hero1.name,
            second: hero2.name,
            hero: reward.name,
            date: new Date(Date.now() + dates[reward.type])
        });
        await data.save();
        return embed(this.msg, `${this.sd.lang === "en" ? `Breeding will end` : "Разведение закончится"} <t:${makeTimestamp(Date.now() + dates[reward.type])}:R>`)
        
    }
};

module.exports = function(bot, msg, sd) {
    return new breedingClass(bot, msg, sd);
} 
