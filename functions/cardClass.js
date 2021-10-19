const { cardFind, bagFind, serverFind, card: cd, bag, addStar } = require("./models");
const { error, embed, firstUpperCase, randomRange, delay, sendToMail } = require("./functions");
const cards = require("../JSON/cards.json");
const {none, main} = require("../JSON/colours.json");
const cardModel = require("../models/cards");
const {AGREE, DISAGREE, STAR} = require("../config");
const {MessageEmbed, MessageActionRow, MessageSelectMenu, MessageCollector} = require("discord.js");

class CardClass {
    constructor(msg, vipLevel = 0) {
        this.msg = msg;
        this.user = msg.author;
        this.vip = vipLevel;
    }

    async openCard(cardName) {
        const serverLang = await serverFind(this.msg.guild.id) || "ru";
        const data = await bagFind(this.user.id);
        const cardData = await cardFind(this.user.id, cardName);
        const { cardClass: cc, vipTwo, noStar } = require(`../languages/${serverLang.lang}`);
        if (cardData) return error(this.msg, cc.already);
        
        const card = cards[cardName];

        const random = Math.ceil(Math.random() * 5);
        const m = await this.msg.channel.send(cc.wait);
        await delay(random * 1000)
        m.delete();
        
        if (card.available === "vip2" && !data.vip2) return error(this.msg, vipTwo);
        if (data.stars < card.cost) return error(this.msg, noStar);

        function getCode() {
            return `${randomRange(1000, 9999)}-${randomRange(1000, 9999)}`
        }

        async function getUser() {
            const code = getCode()
            const data = await cd.findOne({code: code});
            while (data) {
                getUser()
            }
            return code;
        }
        
        const pinCode = randomRange(1000, 9999);
        
        const newCard = await cardModel.create({
            userID: this.user.id,
            name: cardName,
            createdAt: new Date(),
            code: await getUser(),
            pin: pinCode,
            amount: 0
        });
        
        newCard.save().then(() => embed(this.msg, cc.done1)).catch(() => this.msg.react(DISAGREE));
        await addStar(this.user.id, -(card.cost))
        return 
    }

    async sendPin() {
        const ln = await serverFind(this.msg.guild.id);
        const { cardClass: cc } = require(`../languages/${ln.lang}`);
        
        const data = await cardModel.find({userID: this.user.id}).exec();
        const emb = new MessageEmbed()
        .setThumbnail(this.user.displayAvatarURL({dynamic: true}))
        .setColor(none)
        if (data && data.length !== 0) {
            const mapped = data.map( (card, p) => {
                const cd = cards[card.name];
                return emb.addField(`${p+1}. ${cd.emoji} ${card.code}`, `PIN: ||${card.pin}||`, false);
            });
        
        return this.user.send({embeds: [emb]}).catch( () =>  error(this.msg, cc.dm))
        
        } else {
            return false;
        }
    }

    async getCards() {
        const data = await cardModel.find({userID: this.user.id}).exec();
        if (data && data.length !== 0) {
            return data;
        } else {
            return false;
        }
    }


    async deposit(amount) {
        const ln = await serverFind(this.msg.guild.id);
        const { cardClass: cc, noStar } = require(`../languages/${ln.lang}`);

        const row = await getCardMenu(this.msg, {
            custom: cc.custom4,
            placeHolder: cc.choose,
        }); 

        if (!row) return error(this.msg, cc.noCard)

        const message = await this.msg.channel.send({content: cc.specDep, components: [row]});
        const collector = await message.createMessageComponentCollector({
            filter: i => i.isSelectMenu() && i.user.id === this.user.id,
            time: 45000,
            max: "1"
        });
        let bool = false;
        collector.on("collect", async (i) => {
            message.delete()
            bool = true;
            i.deferUpdate();
            collector.stop();
            let val = i.values[0];
            let data = await cardFind(this.user.id, val);
            let cardData = cards[val];
            const am = Math.floor(amount);
            let total = am;
            const random = randomRange(5, 10)
            const m = await this.msg.channel.send(cc.wait);
            await delay(random * 1000)
            data = await cardFind(this.user.id, val);
            cardData = cards[val];
            if (cardData.percentage !== 0) total = Math.round(am - (am * cardData.percentage / 100));
            if (total + data.amount > cardData.maxSpace) return error(this.msg, cc.max);
            const bd = await bagFind(this.user.id);
            if (am > bd.stars) return error(this.msg, noStar);

            await bag.updateOne({userID: this.user.id}, {$inc: {stars: -am}});
            await cd.updateOne({name: val, userID: data.userID}, {$inc: {amount: total}});

            this.msg.react(AGREE)
            m.delete();
            embed(this.msg, `${am} --> ${total} (${cardData.percentage}%)`, false)
        });

        collector.on("end", () => {
            if (!bool) {
                message.delete()
                return error(this.msg, cc.timeOut)};  
        })
    }


    async withdraw(amount) {
        const ln = await serverFind(this.msg.guild.id);
        const { cardClass: cc, noStar } = require(`../languages/${ln.lang}`);

        const row = await getCardMenu(this.msg, {
            custom: cc.custom5,
            placeHolder: cc.choose,
        }); 

        if (!row) return error(this.msg, cc.noCard)

        const message = await this.msg.channel.send({content: cc.cont, components: [row]});
        const collector = await message.createMessageComponentCollector({
            filter: i => i.isSelectMenu() && i.user.id === this.user.id,
            time: 45000,
            max: "1"
        });
        let bool = false;
        collector.on("collect", async (i) => {
            message.delete()
            bool = true;
            i.deferUpdate();
            collector.stop();
            let val = i.values[0];
            let data = await cardFind(this.user.id, val);
            let cardData = cards[val];
            const am = Math.floor(amount);
            let total = am;
            const random = randomRange(5, 10)
            const m = await this.msg.channel.send(cc.wait);
            await delay(random * 1000)
            data = await cardFind(this.user.id, val);
            cardData = cards[val];
            if (cardData.percentage !== 0) total = Math.round(am - (am * cardData.percentage / 100));
            if (am > data.amount) return error(this.msg, noStar);

            await bag.updateOne({userID: this.user.id}, {$inc: {stars: total}});
            await cd.updateOne({name: val, userID: data.userID}, {$inc: {amount: -am}});

            this.msg.react(AGREE)
            m.delete();
            embed(this.msg, `${am} --> ${total} (${cardData.percentage}%)`, false)
        });

        collector.on("end", () => {
            if (!bool) {
                message.delete()
                return error(this.msg, cc.timeOut)};  
        })
    }


    async addMoney(code, amount) {
        const ln = await serverFind(this.msg.guild.id);
        const { cardClass: cc, noStar, cardFix } = require(`../languages/${ln.lang}`);

        const row = await getCardMenu(this.msg, {
            custom: cc.custom2,
            placeHolder: cc.choose,
        });
        if (!row) return error(this.msg, cc.noCard);
        if (amount <= 0) return error(this.msg, cc.min);
        let target = await cardModel.findOne({code: code});
        if (!target) return error(this.msg, cc.findError);
        

        const message = await this.msg.channel.send({content: cc.addContent, components: [row]})
        const collector = await message.createMessageComponentCollector({
            filter: i => i.isSelectMenu() && i.user.id === this.user.id,
            time: 45000,
            max: "1"
        })
        let bool = false;
        collector.on("collect", async (i) => {
            message.delete()
            bool = true;
            i.deferUpdate();
            collector.stop();
            let val = i.values[0];
            let data = await cardFind(this.user.id, val);
            let cardData = cards[val];
            if (data.amount < amount) return error(this.msg, noStar);
            let total = Math.floor(amount);
            if (cardData.percentage !== 0) total = Math.floor(amount) - (Math.floor(amount) * cardData.percentage / 100);
        
            let targetData = cards[target.name];
            if (Math.floor(amount) > cardData.maxGiveAmount) return error(this.msg, cc.maxGive);
            if (target.amount + total > targetData.maxSpace) return error(this.msg, cc.max + `${targetData.maxSpace}`);
            if (target.code === data.code) return error(this.msg, cc.another);
            
            const mess = await embed(this.msg, cc.typePin, false);
            const msgCollector = this.msg.channel.createMessageCollector({
                filter: i => i.author.id === this.user.id,
                time: 30000
            })
            let bool2 = false;
            msgCollector.on("collect", async (message)=> {
                if (message.content.toLowerCase() === "cancel") {
                    bool2 = true;
                    mess.delete();
                    msgCollector.stop();
                    return embed(this.msg, cc.declined);
                } else if (message.content === data.pin) {
                    bool2 = true;
                    message.delete();
                    mess.delete();
                    msgCollector.stop();

                    const random = 5 //randomRange(60, 180)
                    this.msg.react(AGREE);
                    await embed(this.msg, cardFix).then( (msg) => setTimeout(() => msg.delete(), 10000));
                    await delay(random * 1000);
                    data = await cardFind(this.user.id, val);
                    target = await cardModel.findOne({code: code});

                    if(!target) return this.msg.react(DISAGREE);
                    if (!data) return this.msg.react(DISAGREE);

                    cardData = cards[val];
                    if (data.amount < amount) return this.msg.react(DISAGREE);
                    total = Math.floor(amount);
                    if (cardData.percentage !== 0) total = Math.floor(amount) - (Math.floor(amount) * cardData.percentage / 100);
        
                    targetData = cards[target.name];
                    if (Math.floor(amount) > cardData.maxGiveAmount) return this.msg.react(DISAGREE);
                    if (target.amount + total > targetData.maxSpace) return this.msg.react(DISAGREE);

                    
                    await cardModel.updateOne({code: target.code}, {$inc: {amount: total}});
                    await cardModel.updateOne({code: data.code}, {$inc: {amount: -Math.floor(amount)}});

                    let langMessage = `__${total}__ золото добавлено на вашу карту с номером \`${target.code}\`.`;
                    if (ln.lang === "en") langMessage = `__${total}__ gold has been added to your card with the number \`${target.code}\`.`;

                    await sendToMail(target.userID, {
                        textMessage: langMessage,
                        createdAt: new Date()
                    })
                    
                    return
                }


            })

            msgCollector.on("end", () => {
                if (!bool2) {
                    mess.delete();
                    return error(this.msg, cc.timeOut)};
            })
        

        })

        collector.on("end", () => {
            if (!bool) {
                message.delete()
                return error(this.msg, cc.timeOut)};  
        })

    }

    async closeCard() {
        const ln = await serverFind(this.msg.guild.id);
        const { cardClass: cc, noStar } = require(`../languages/${ln.lang}`);

        const row = await getCardMenu(this.msg, {custom: cc.custom3, placeHolder: cc.choose});

        if (!row) return error(this.msg, cc.noCard);
  
        const message = await this.msg.channel.send({content: cc.contentClose, components: [row]})
        const collector = await message.createMessageComponentCollector({
            filter: i => i.isSelectMenu() && i.user.id === this.user.id,
            time: 45000,
            max: "1"
        })
        let bool = false;
        collector.on("collect", async (i) => {
            message.delete()
            bool = true;
            i.deferUpdate();
            collector.stop();
            let val = i.values[0];
            let data = await cardFind(this.user.id, val);

            const mess = await embed(this.msg, cc.typePin, false);
            const msgCollector = this.msg.channel.createMessageCollector({
                filter: i => i.author.id === this.user.id,
                time: 30000
            })
            let bool2 = false;
            msgCollector.on("collect", async (message)=> {
                if (message.content.toLowerCase() === "cancel") {
                    bool2 = true;
                    mess.delete();
                    msgCollector.stop();
                    return embed(this.msg, cc.declined);
                } else if (message.content === data.pin) {
                    message.delete()
                    bool2 = true;
                    mess.delete();
                    msgCollector.stop();
                    
                    data = await cardFind(this.user.id, val);

                    data.delete()
                    
                    return embed(this.msg, cc.closed)
                }


            })

            msgCollector.on("end", () => {
                if (!bool2) {
                    mess.delete();
                    return error(this.msg, cc.timeOut)};
            })
            
        })

        collector.on("end", () => {
            if (!bool) return error(this.msg, cc.timeOut);  
        })
        
    }
    
}

function Card(msg) {
    return new CardClass(msg)
}


module.exports = Card;


async function getCardMenu(msg, {
    custom,
    placeHolder,
}) {
    const ln = await serverFind(msg.guild.id);
    const { cardClass: cc } = require(`../languages/${ln.lang}`);

    const mine = await cardModel.find({userID: msg.author.id}).exec();
    if (!mine || mine.length === 0) return false;
    let options = mine.map(data => {
        const cardName = cards[data.name];
        return {
            label: ln.lang === "en" ? firstUpperCase(cardName.name) + " Card" : firstUpperCase(cardName.nameRus) + " Карта",
            value: cardName.name,
            description: `${cc.bal} ${data.amount}`,
            emoji: cardName.emoji
        }
    })
    
    return new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
            .setCustomId(custom)
            .setPlaceholder(placeHolder)
            .addOptions([options])
        )
}