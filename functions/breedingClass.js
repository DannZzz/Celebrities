const { bank, bankFind, rpg, profile, profileFind, cardFind, bagFind, serverFind, card: cd, addStar, rpgFind, addPremiumStar, addCandy, addCrystal } = require("./models");
const { error, embed, firstUpperCase, randomRange, delay, sendToMail, pagination, getMember, getHeroData, makeTimestamp, formatNumber } = require("./functions");
const heroes = require("../JSON/heroes.json");
const elements = require("../JSON/elements.json");
const breeding = require("../JSON/breeding.json");
const { none, main } = require("../JSON/colours.json");
const { AGREE, DISAGREE, STAR, LEFT, RIGHT, heroNames, LEAGUE, HELL, LOADING, CRYSTAL } = require("../config");
const { stripIndents } = require("common-tags");
const Rate = require("./rateClass");
const Subscription = require("./subscriptionClass");
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageCollector, MessageButton, MessageAttachment } = require("discord.js");

let allSlots = 3;

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
        const slots = await getSlots(this.bot, this.msg);
        const emb = new MessageEmbed()
        .setColor(main)
        .setThumbnail(this.user.displayAvatarURL({dynamic: true}))
        .setAuthor(this.user.tag, this.user.displayAvatarURL({dynamic: true}))
        
        if (!data.breeding || data.breeding.length === 0) {
            emb.setTitle(`${this.sd.lang === "en" ? "You don't have any breedings!" : "У тебя нет никаких разведений!"}\n${this.sd.lang === "en" ? "Your slots:" : "Твои слоты:"} ${slots}`).setDescription(`${this.sd.lang === "en" ? "For start breeding, write `breeding [first hero] [second hero]`" : "Чтобы начать разведение, напиши `breeding [первый герой] [второй герой]`"}`);
        } else {
            emb.setTitle(`${this.sd.lang === "en" ? "Your currently breedings!" : "Ваши текущие разведения!"}\n${this.sd.lang === "en" ? "Your slots:" : "Твои слоты:"} ${slots}`)
            emb.setDescription(`${this.sd.lang === "en" ? "For getting, write \`collect [number of breeding]\`\nFor throwing, write \`throw [number of breeding]\`" : "Чтобы забрать, напишите \`collect [номер скрещиваний]\`\nЧтобы удалить, напишите \`throw [номер скрещиваний]\`"}`)
            data.breeding.forEach((obj, pos) => {
                if (obj.date < new Date()) {
                    return emb.addField(`${pos+1}. ${this.sd.lang === "en" ? "Breeding ended!" : "Скрещивание закончилось!"}`, `${this.sd.lang === "en" ? `You got hero: ${obj.hero}` : `Вы получили героя: ${heroes[obj.hero].nameRus}`}`)
                } else {
                    return emb.addField(`${pos+1}. ${this.sd.lang === "en" ? `Breeding ends <t:${makeTimestamp(obj.date.getTime())}:R>` : `Скрещивание закончится <t:${makeTimestamp(obj.date.getTime())}:R>`}`, `${this.sd.lang === "en" ? `Heroes: ${obj.first}, ${obj.second}` : `Герои: ${heroes[obj.first].nameRus}, ${heroes[obj.second].nameRus}`}`)
                }
            });
        }

        return this.msg.reply({embeds: [emb]});

    }

    async collect(number) {
        const data = await rpgFind(this.id);

        if (!data.breeding || data.breeding.length === 0) return error(this.msg, this.sd.lang === "en" ? "You don't have any breedings!" : "У тебя нет никаких разведений!");
        

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
        const alls = ["all", "все"];
       

        if (isNaN(number) && alls.includes(number.toLowerCase())) {
            const ended = data.breeding.filter(obj => {
                if (obj.date > new Date()) return obj;
            });

            await rpg.updateOne({userID: this.id}, {$set: {breeding: ended}});
              
            return this.msg.react(AGREE)
        }

        const index = Math.round(number - 1);
        if (number > data.breeding.length || number <= 0) return error(this.msg, this.sd.lang === "en" ? "Breeding not found." : "Скрещивание не найдено.");
        if (data.breeding[index]["date"] > new Date()) return error(this.msg, this.sd.lang === "en" ? "This breeding is not ended." : "Этот скрещивание не закончилось.")

        const hero = heroes[data.breeding[index]["hero"]];

        data.breeding.splice(index, 1)
        await data.save();

        return embed(this.msg, this.sd.lang === "en" ? `You threw hero: __${hero.name}__` : `Вы бросили героя: __${hero.nameRus}__`);
    };

    list() {
        const arr = breeding;
        let texted = arr.map(obj => {
            if (this.sd.lang === "en") {
                return `${obj.need.map(hero => hero).join(" ❤ ")} --> ${obj.reward.map(hero => hero).join(", ")}`;
            } else {
                return `${obj.need.map(hero => heroes[hero].nameRus).join(" ❤ ")} --> ${obj.reward.map(hero => heroes[hero].nameRus).join(", ")}`;
            }
        });
        return embed(this.msg, texted.join("\n"), false);
    }


    async skip() {
        const data = await rpgFind(this.id);

        if (!data.breeding || data.breeding.length === 0) return error(this.msg, this.sd.lang === "en" ? "You don't have any breedings!" : "У тебя нет никаких разведений!");
        
        const emb = new MessageEmbed()
        .setColor(main)
        .setAuthor(this.user.tag, this.user.displayAvatarURL({dynamic: true}))
        .setTitle(this.sd.lang === "en" ? "Write number of breeding!" : "Напишите номер скрещиваний!")
        
        data.breeding.forEach((obj, pos) => {
            if (obj.date > new Date()) {
                const expire = obj.date - new Date();
                const minutes = Math.round(expire / (60 * 1000) );
                let count = Math.ceil(minutes / 20);
                if (count <= 1) count = 1;
                const cost = Math.round(count * 1);
                const name = this.sd.lang === "en" ? `${pos+1}. Ends <t:${makeTimestamp(obj.date.getTime())}:R> - ${cost} ${CRYSTAL}` : `${pos+1}. Закончится <t:${makeTimestamp(obj.date.getTime())}:R> - ${cost} ${CRYSTAL}`;
                const value = this.sd.lang === "en" ? `Heroes: \`${obj.first}, ${obj.second}\`` : `Герои: \`${heroes[obj.first].nameRus}, ${heroes[obj.second].nameRus}\``
                emb.addField(name, value);
            } else {
                const name = this.sd.lang === "en" ? `${pos+1}. Ended` : `${pos+1}. Закончился`;
                const value = this.sd.lang === "en" ? `Heroes: \`${obj.first}, ${obj.second}\`` : `Герои: \`${heroes[obj.first].nameRus}, ${heroes[obj.second].nameRus}\``
                emb.addField(name, value);
            }
        });

        const m1 = await this.msg.reply({embeds: [emb]});

        const c = await this.channel.createMessageCollector({
            filter: m => m.author.id === this.id,
            time: 15000
        });
        let bool = false;
        c.on("collect", async message => {
            const m = Math.round(message.content);
            const newData = await rpgFind(this.id);
            if (!isNaN(m) && m <= newData.breeding.length && m > 0) {
                const index = m - 1;
                bool = true;
                c.stop();
                if (newData.breeding[index]["date"] < new Date()) return error(this.msg, this.sd.lang === "en" ? "This breeding is ended." : "Этот скрещивание закончилось.");
                const obj = newData.breeding[index];
                const expire = obj.date - new Date();
                const minutes = Math.round(expire / (60 * 1000) );
                let count = Math.ceil(minutes / 20);
                if (count <= 1) count = 1;
                const cost = Math.round(count * 1);
                const bag = await bagFind(this.id);
                if (bag.crystal < cost) return error(this.msg, require(`../languages/${this.sd.lang || "ru"}`).noCrystal);
                await rpg.updateOne({userID: this.id}, {$set: {[`breeding.${index}.date`]: new Date()}});
                await addCrystal(this.id, -cost);
                return this.msg.react(AGREE);
            }
        });

        c.on("end", () => {
            m1.delete();
            if (!bool) return error(this.msg, require(`../languages/${this.sd.lang || "ru"}`).timeOut);
        })


        
    }

    async addBreeding (hero1, hero2) {
        let data = await rpgFind(this.id);

        let breedingCount = allSlots;
        const myBoostLevel = await Subscription(this.bot, this.msg, "Tyrus").getSubId();
        breedingCount += myBoostLevel;
        
        if (data.breeding && data.breeding.length >= breedingCount) return error(this.msg, `${this.sd.lang === "en" ? "Wait for the breeding to end." : "Дождитесь окончания разведения."}`);
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
            furious: 21600 * 1000,
            mythical:43200 * 1000,
            private: 86400 * 1000
        };

        const el1 = hero1.elements;

        const el2 = hero2.elements;

        let validHeroes = [];
        let mainHeroes = [];
        
        const arr = breeding;

        for (let i in heroes) {
            const heroObj = heroes[i];
            if (heroObj.available !== "Под") {
                el1.forEach(element => {
                    if (!heroObj.blockBreeding && heroObj.elements.includes(element) && !validHeroes.includes(heroObj) && element !== "legendary") validHeroes.push(heroObj);
                });
    
                el2.forEach(element => {
                    if (!heroObj.blockBreeding && heroObj.elements.includes(element) && !validHeroes.includes(heroObj) && element !== "legendary") validHeroes.push(heroObj);
                });
            }  
        };

        validHeroes.forEach(obj => {
            obj.elements.forEach(o => {
                if (el1.includes(o) && el2.includes(o) && !mainHeroes.includes(obj)) mainHeroes.push(obj);
            });
        })
        
        const heroTypeTaker = randomRange(0, 100);
        let ht = heroTypeTaker;
        if (el1.length === 1 && el2.length ===1) {
            ht += 9;
        } else if (el1.length === 1 || el2.length ===1) {
            ht += 5;
        };

        arr.forEach(obj => {
            if (obj.need.includes(hero1.name) && obj.need.includes(hero2.name)) {
                ht -= 8;
            }
        })
        
        let heroType;
        if (ht >= percs.common) {
            heroType = "common";
        } else if (ht >= percs.elite) {
            heroType = "elite";
        } else if (ht >= percs.furious) {
            heroType = "furious";
        } else if (ht >= percs.mythical || ht < -1) {
            heroType = "mythical";
        } else if (ht <= percs.private) {
            heroType = "private";
        };

        let heroTypeHeroes = mainHeroes.filter(obj => obj.type === heroType);
        if (!heroTypeHeroes || heroTypeHeroes.length === 0) {
            heroTypeHeroes = validHeroes.filter(obj => obj.type === heroType);
        }

        if (!heroTypeHeroes || heroTypeHeroes.length === 0) {
            const r1 = Math.floor(Math.random() * validHeroes.length);
            heroTypeHeroes = [validHeroes[r1]];
        }

        
        arr.forEach(obj => {
            if (obj.need.includes(hero1.name) && obj.need.includes(hero2.name)) {
                obj.reward.forEach(reward => {
                    const hd = heroes[reward] 
                    if (heroType === hd.type) heroTypeHeroes = [hd];
                })
            }
        })
        
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

async function getSlots(bot, msg) {
    const myBoostLevel = await Subscription(bot, msg, "Tyrus").getSubId();
    return allSlots + myBoostLevel;
}

