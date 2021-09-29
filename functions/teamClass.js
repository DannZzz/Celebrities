const { clan, clanFind, rpg, rpgFind, bagFind, serverFind, bag, addStar } = require("./models");
const { error, embed, firstUpperCase, randomRange, delay } = require("./functions");
const heroes = require("../JSON/heroes.json");
const {none, main} = require("../JSON/colours.json");
const {AGREE, DISAGREE, STAR, HERO, CLAN} = require("../config");
const {MessageAttachment, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageCollector, MessageButton} = require("discord.js");
const Canvas = require("canvas");

class TeamClass {
    constructor (msg) {
        this.msg = msg;
        this.user = msg.author;
        this.channel = msg.channel;
        this.server = msg.guild;
    }

    async getTeam(bot) {
        const sd = await serverFind(this.server.id);
        const { clanModel: cm, teamModel: tm} = require(`../languages/${sd.lang}`);
        const check1 = await checkClan(this.user.id);
        if (!check1) return error(this.msg, cm.noClan);

        this.clan = await getClan(this.user.id);

        const team = this.clan.team;
        if (!team || team.length === 0) return error(this.msg, tm.noTeam);        
        
        const mapped = await Promise.all(team.map(async (userId, pos) => {
            const data = await rpgFind(userId);
            let hero;
            if (data.item) {
                const func = data.heroes.find(x => x.name === data.item);
                const heroData = heroes[func.name];
                hero = `${HERO} ${sd.lang === "en" ? heroData.name : heroData.nameRus} | ❤ ${func.health} ⚔ ${func.damage}`
            } else {
                hero = sd.lang === "en" ? "No hero" : "Нет героя";
            }
            
            const check = bot.users.cache.get(userId);
            let userName;
            if (check) {
                userName = check.tag ;
            } else {
                userName = sd.lang === "en" ? "Unknown" : "Неизвестный";
            }
            
            return `${pos+1}. ${userName} | ${hero}`;
        }));

        return embed(this.msg, mapped.join("\n\n"), false);
    }

    async changeTeam(number) {
        const sd = await serverFind(this.server.id);
        const { clanModel: cm, teamModel: tm, notUser} = require(`../languages/${sd.lang}`);

        const check1 = await checkClan(this.user.id);
        if (!check1) return error(this.msg, cm.noClan);

        const ThisClan = await getClan(this.user.id);

        const check2 = await checkOwner(this.user.id, ThisClan.ID);
        if (!check2) return error(this.msg, cm.notLeader);

        if (!number || isNaN(number)) return error(this.msg, cm.specN);
        const idd = ThisClan.ID;
        
        const members = await rpg.find({clanID: idd}).exec();
        const index = number - 1;
        if (number <= 0 || number > members.length) return error(this.msg, notUser);
        const user = members[index]["userID"];

        if (ThisClan.team.includes(user)) {
            ThisClan.team.splice(ThisClan.team.indexOf(user));
            ThisClan.save();
            return embed(this.msg, tm.kicked);
        } else {
            if (ThisClan.team.length === 5) return error(this.msg, tm.gg);
            ThisClan.team.push(user);
            ThisClan.save()
            return embed(this.msg, tm.done1);
        }
    }


    async startBattle(targetID, bet) {
        const sd = await serverFind(this.server.id);
        const { heroModel: hm, clanModel: cm, buttonYes, buttonNo, teamModel: tm} = require(`../languages/${sd.lang}`);

        const check1 = await checkClan(this.user.id);
        if (!check1) return error(this.msg, cm.noClan);

        const my = await getClan(this.user.id);
        const check2 = await checkOwner(this.user.id, my.ID);
        if (!check2) return error(this.msg, cm.notLeader);
        
        
        const target = await clanFind(targetID);
        if (!target) return error(this.msg, cm.notClan);

        if (target.ID === my.ID) return error(this.msg, cm.notClan);
        //return this.channel.send({files: [att], embeds: [emb.setImage("attachment://fight.png")]})
        
        const targetOwner = this.server.members.cache.get(target.owner);
        if (!targetOwner) return error(this.msg, tm.notThisLeader);

        if (!my.team || my.team.length === 0) return error(this.msg, tm.noTeam);
        if (!target.team || target.team.length === 0) return error(this.msg, tm.thisClanNotTeam);

        let my_health = 0;        
        let my_damage = 0;

        let target_health = 0;        
        let target_damage = 0;
        
        my.team.forEach( async (id) => {
            const rpgData = await rpgFind(id);
            if (rpgData.item && rpgData.heroes.length !== 0) {
                const get = rpgData.heroes.find(x => x.name === rpgData.item);
                my_health += get.health;
                my_damage += get.damage;
            } else {
                my_health += 0;
                my_damage += 0;
            }
        });

        target.team.forEach( async (id) => {
            const rpgData = await rpgFind(id);
            if (rpgData.item && rpgData.heroes.length !== 0) {
                const get = rpgData.heroes.find(x => x.name === rpgData.item);
                target_health += get.health;
                target_damage += get.damage;
            } else {
                target_health += 0;
                target_damage += 0;
            }
        });
        await delay(2000);

        if (my.budget < bet) return error(this.msg, tm.youBudget);
        if (target.budget < bet) return error(this.msg, tm.targetBudget);

        const h1 = my_health;
        const d1 = my_damage;
        const h2 = target_health;
        const d2 = target_damage;
        
        const b1 = new MessageButton()
        .setEmoji("🏳️")
        .setStyle("DANGER")
        .setCustomId("surr")
        
        const b2 = new MessageButton()
        .setEmoji("⚔️")
        .setStyle("SUCCESS")
        .setCustomId("fight")

        const emb = new MessageEmbed()
        .setColor(main)
        .setAuthor(hm.battle)
        .addField(`${my.name} (${my.level})`, `❤ ${my_health}\n⚔ ${my_damage}`, false)
        .addField(`${target.name} (${target.level})`, `❤ ${target_health}\n⚔ ${target_damage}`, false)
        .setThumbnail("https://media.giphy.com/media/SwUwZMPpgwHNQGIjI7/giphy.gif")
        
        const row = new MessageActionRow().addComponents([b1, b2]);

        const EMB = new MessageEmbed()
        .setColor(main)
        .setAuthor(this.user.tag, this.user.displayAvatarURL({dynamic: true}))
        .setDescription(`${targetOwner}, ${tm.req(bet)} ${CLAN}`)
        
        
        const message = await this.channel.send({embeds: [EMB], components: [row]});
        const collector = await message.createMessageComponentCollector({
            filter: i => i.user.id === target.owner && (i.customId === b1.customId || i.customId === b2.customId),
            time: 30000
        })

        collector.on("collect", async i => {
            switch (i.customId) {
                case b1.customId:
                    i.deferUpdate();
                    collector.stop();

                    return embed(this.msg, tm.declined, false);
                case b2.customId:
                    i.deferUpdate();
                    collector.stop();
            
                    if (my.budget < bet) return error(this.msg, tm.youBudget);
                    if (target.budget < bet) return error(this.msg, tm.targetBudget);

                    const damn = await this.channel.send(tm.waiting);
                    const CC = await makeCanvas(my.logo, target.logo)
                    const att = new MessageAttachment(CC.toBuffer(), 'fight.png')

                    
                    await clan.updateOne({ID: my.ID}, {$inc: {budget: -bet, total: 1}});
                    await clan.updateOne({ID: target.ID}, {$inc: {budget: -bet, total: 1}});

                    await clan.updateOne({ID: my.ID}, {$set: {war: new Date(Date.now() + 86400000)}});
                    await clan.updateOne({ID: target.ID}, {$set: {war: new Date(Date.now() + 86400000)}});
                    
                    const msg = await this.channel.send({embeds: [emb.setImage("attachment://fight.png")], files: [att]})
                    damn.delete();
                    setTimeout( async () => {
                        let winner;
                        let loser;
                        msg.delete()
                        let rand = Math.floor(Math.random() * 32)
                        if (rand < 16) {
                            while (true) {
                            my_health -= target_damage;
                            target_health -= my_damage;
                            if(target_health <= 0) {
                                winner = my;
                                loser = target;
                                break;
                            } else if (my_health <= 0) {
                                winner = target;
                                loser = my;
                                break;
                            }
                            }
                        } else {
                            while (true) {
                            my_health -= target_damage;
                            target_health -= my_damage;
                            if(my_health <= 0) {
                                winner = target;
                                loser = my;
                                break;
                            } else if (target_health <= 0) {
                                winner = my;
                                loser = target;
                                break;
                            }
                            }
                        }

                        await clan.updateOne({ID: winner.ID}, {$inc: {budget: bet*2, wins: 1}});
                        
                        const msgEmbed = new MessageEmbed()
                        .setColor(none)
                        .setAuthor(tm.winner)
                        .setTitle(winner.name)
                        .setDescription(`**${hm.reward} ${bet*2}** ${CLAN}`)
                        .addField(`❤ ${winner === my ? h1 : h2}`, `**⚔ ${winner === my ? d1 : d2}**`)

                        if (winner.logo) msgEmbed.setImage(winner.logo);

                        return this.channel.send({embeds: [msgEmbed]});
                        
                    }, 10000)
                    break;
                default:
                    break;
            }
        });

        collector.on("end", () => {
            const disabledRow = new MessageActionRow().addComponents(
                b1.setDisabled(true),
                b2.setDisabled(true)
            );

            message.edit({components: [disabledRow]})
        })
        
    }

    async clearTeam() {
        const sd = await serverFind(this.server.id);
        const { clanModel: cm, teamModel: tm} = require(`../languages/${sd.lang}`);

        const check1 = await checkClan(this.user.id);
        if (!check1) return error(this.msg, cm.noClan);

        const my = await getClan(this.user.id);
        const check2 = await checkOwner(this.user.id, my.ID);
        if (!check2) return error(this.msg, cm.notLeader);

        await clan.updateOne({ID: my.ID}, {$set: {team: []}});
        this.msg.react(AGREE);
    }

}

function teamFunc(msg) {
    return new TeamClass(msg);
}

module.exports = teamFunc;

async function getClan(id) {
    const rr = await rpgFind(id);
    if (rr.clanID) {
        const cl = await clanFind(rr.clanID);
        if (!cl) return false;
        return cl;
    } else {
        return false;
    }
    
    
}

async function checkClan(id) {
    const myData = await rpgFind(id);
    if (!myData.clanID) return false;
    return true;
}

async function checkOwner(id, clanID) {
    if (!clanID) return false;
    const clan = await clanFind(clanID);
    if (id === clan.owner) {
        return true;
    } else {
        return false;
    }
}


async function makeCanvas (data1, data2) {
    if (!data1) data1 = "https://pbs.twimg.com/profile_images/1063925348205821958/DlGcxdOl_400x400.jpg";   
    if (!data2) data2 = "https://pbs.twimg.com/profile_images/1063925348205821958/DlGcxdOl_400x400.jpg";   
    
    const canvas = Canvas.createCanvas(728, 472);
    const ctx = canvas.getContext('2d');
    const background = await Canvas.loadImage('https://i.ibb.co/kMZvThM/clanwars.png');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
    const h = 100;
    const heroHeight = 30;
    const firstW = 197;
    const secW = 384;
    
    const first = await Canvas.loadImage(data1);
    const second = await Canvas.loadImage(data2);
    
    ctx.drawImage(first, firstW, heroHeight-5, h, h);
    ctx.drawImage(second, secW, heroHeight, h, h);
  
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#579DC0";
    ctx.strokeRect(firstW, heroHeight-5, h, h)
  
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#4A393E";
    ctx.strokeRect(secW, heroHeight, h, h)
    
    return canvas
}

