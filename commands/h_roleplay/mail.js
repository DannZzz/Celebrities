const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { STAR, AGREE, MAIL, LEFT, RIGHT } = require("../../config");
const {error, embed, perms, firstUpperCase, makeTimestamp, pagination} = require("../../functions/functions");
const { serverFind, mailFind, mail, addStar } = require("../../functions/models");
const locs = require("../../JSON/locations");
const {main , none, reddark, greenlight} = require("../../JSON/colours.json");

module.exports = {
  config: {
    name: "mail",
    aliases: ['почта'],
    category: 'h_roleplay',
    cooldown: 20
  },
  run: async (bot, msg, args, ops) => {

    const cur = ops.buying.get(msg.author.id);
    if (cur) return;
    
    const LANG = await serverFind(msg.guild.id);
    const {ERROR, interError, use: u, buy: b, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   
    const l = LANG.lang || "ru";
    
    const user = msg.author;

    let data = await mailFind(user.id);
    if (!data) {
        const newData = await mail.create({
            userID: user.id
        });
        await newData.save();
    }
    data = await mailFind(user.id);

    const trop = data.tropicalForest || 0;
    const tropData = locs["tropicalForest"];

    const bode = data.bodeGalaxy || 0;
    const bodeData = locs["bodeGalaxy"];

    const messages = data.messages || [];
    
    const emb = new MessageEmbed()
    .setAuthor(user.username)
    .setThumbnail(user.displayAvatarURL({dynamic: true}))
    .setColor(main)
    .setTitle(l === "ru" ? "Почта" : "Mail")
    .addField(l === "ru" ? "Золото" : "Gold", `${data.gold || 0} ${STAR}`)

    let arr = [];
    const buttonList = [];

    const tbutton = new MessageButton()
    .setEmoji(tropData.reward.emoji)
    .setCustomId("trop")
    .setStyle("SECONDARY")
    .setLabel(l === "ru" ? "Забрать один" : "Collect one")

    const gbutton = new MessageButton()
    .setEmoji(STAR)
    .setCustomId("goldmail")
    .setStyle("SECONDARY")
    .setLabel(l === "ru" ? "Забрать" : "Collect")

    buttonList.push(gbutton)
    
    const mbutton = new MessageButton()
    .setEmoji(MAIL)
    .setCustomId("main")
    .setStyle("SECONDARY")
    .setLabel(l === "ru" ? "Прочитать" : "Read")

    const bbutton = new MessageButton()
    .setEmoji("🌠")
    .setCustomId("bode")
    .setStyle("SECONDARY")
    .setLabel(l === "ru" ? "Забрать один" : "Collect one")
    
    if (trop && trop !== 0) {
        arr.push({
        name: `${l === "ru" ? tropData.nameRU : tropData.nameEN}:`,
        value: `${trop} ${tropData.reward.emoji || ""}`
        });

        buttonList.push(tbutton)
    }

    if (bode && bode !== 0) {
        arr.push({
        name: `${l === "ru" ? bodeData.nameRU : bodeData.nameEN}:`,
        value: `${bode} ${bodeData.reward.emoji || ""}`
        });

        buttonList.push(bbutton)
    }
    

    if (messages && messages.length !== 0) {
        arr.push({
        name: `${l === "ru" ? "Кол-во Сообщений" : "Count of Messages"}:`,
        value: `${messages.length} ${l === "ru" ? "сообщений" : "messages"}`
        });

        buttonList.push(mbutton)
    }

    const row = new MessageActionRow().addComponents([buttonList])
    let m = undefined;
    if (arr.length === 0) {
        m = await msg.channel.send({embeds: [emb.setDescription(l === "ru" ? "Пусто" : "Empty")], components: [row]});
    } else {
        arr.forEach(({name, value}) => {
            return emb.addField(name, value);l
        });
        
        m = await msg.channel.send({embeds: [emb], components: [row]});
    }

    if (!m) return;
    ops.buying.set(user.id, {mail: true});
    const filter = i => {
        const get = buttonList.find(b => b.customId === i.customId);
        if (get && i.user.id === user.id) {
            return true;
        } else if (i.user.id !== user.id) {
            const intEmbed = new MessageEmbed()
            .setColor(reddark)
            .setTitle(ERROR)
            .setDescription(interError)
        
            return i.reply({embeds: [intEmbed], ephemeral: true})
        }
    }

    const collector = await m.createMessageComponentCollector({
        filter,
        time: 15000
    });

    const errEmb = new MessageEmbed()
    .setTitle(l === "ru" ? "Ошибка" : "Error")
    .setColor(reddark)

    const winEmb = new MessageEmbed()
    
    .setColor(greenlight)


    collector.on("collect", async i => {
        i.deferUpdate()
        switch (i.customId) {
            case tbutton.customId:
                collector.resetTimer();
                const newdata = await mailFind(user.id);
                const tropnew = newdata.tropicalForest || 0;
                if (tropnew <= 0) return i.followUp({embeds: [errEmb.setDescription(l === "ru" ? "Вы не имеете этот предмет." : 'You don\'t have this item.')], ephemeral: true});
                await mail.updateOne({userID: user.id}, {$inc: {tropicalForest: -1}});
                const string = await tropData.reward.generateReward(bot, msg);
                i.followUp({embeds: [winEmb.setTitle(l === "ru" ? "Вам выпало:" : "You got:").setDescription(string)], ephemeral: true});
                break;
            case gbutton.customId:
                collector.resetTimer();
                const newdata1 = await mailFind(user.id);
                const goldnew = newdata1.gold || 0; 
                if (goldnew <= 0) return i.followUp({embeds: [errEmb.setDescription(noStar)], ephemeral: true});
                await mail.updateOne({userID: user.id}, {$set: {gold: 0}});
                await addStar(user.id, Math.round(goldnew));
                i.followUp({embeds: [winEmb.setTitle(l === "ru" ? "Вы успешно забрали голды:" : "You have successfully collected golds:").setDescription(`${Math.round(goldnew)} ${STAR}`)], ephemeral: true});
                break;
            case bbutton.customId:
                collector.resetTimer();
                const newdata2 = await mailFind(user.id);
                const bodenew = newdata2.bodeGalaxy || 0; 
                if (bodenew <= 0) return i.followUp({embeds: [errEmb.setDescription(l === "ru" ? "Вы не имеете этот предмет." : 'You don\'t have this item.')], ephemeral: true});
                await mail.updateOne({userID: user.id}, {$inc: {bodeGalaxy: -1}});
                const string1 = await bodeData.reward.generateReward(bot, msg);
                i.followUp({embeds: [winEmb.setTitle(l === "ru" ? "Вам выпало:" : "You got:").setDescription(string1)], ephemeral: true});
                break;
            case mbutton.customId:
                collector.stop();
                const mapped = messages.map(({message, date}, pos) => {
                    return `\`${pos+1}.\` <t:${makeTimestamp(date.getTime())}:f>\n**${message}**`
                });

                const msgEmbed = new MessageEmbed()
                .setColor(main)
                .setAuthor(user.username, user.displayAvatarURL({dynamic: true}))
                .setTitle(l === "ru" ? "Сообщения" : "Messages")

                if (mapped.length > 5) {
                    let arr = [];
                    let i = 0;
                    
                    pages();
                    function pages () {
                        let v = mapped.slice(i, i+5);
                        arr.push(
                            new MessageEmbed()
                            .setColor(main)
                            .setAuthor(user.username, user.displayAvatarURL({dynamic: true}))
                            .setTitle(l === "ru" ? "Сообщения" : "Messages")
                            .setDescription(v.join("\n\n"))
                        );
                        i += 5;
                        if (i < mapped.length) {
                            pages();
                        }
        
                    };
        
                    const button1 = new MessageButton()
                    .setCustomId("left")
                    .setEmoji(LEFT)
                    .setStyle("SECONDARY")
                    const button2 = new MessageButton()
                    .setCustomId("right")
                    .setEmoji(RIGHT)
                    .setStyle("SECONDARY")
                    
                    await pagination(msg, arr, [button1, button2], 30000, [user.id]);
                    
                } else {
                    return msg.channel.send({embeds: [msgEmbed.setDescription(mapped.join("\n\n"))]});
                }

        };
    });

    collector.on("end", () => {
        buttonList.forEach(b => {
            b.setDisabled(true)
        });

        const row1 = new MessageActionRow().addComponents([buttonList]);

        m.edit({components: [row1]});
        ops.buying.delete(user.id);
    })


    
    
    
  }
}