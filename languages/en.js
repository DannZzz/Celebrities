const { MessageEmbed } = require("discord.js");
const { COIN, BANK, STAR, status, CRYSTAL, HELL } = require('../config');
const { greenlight, redlight, main } = require('../JSON/colours.json');
const { makeTimestamp, rubToDollar, formatNumber } = require("../functions/functions");
const item = require('../JSON/items');
const heroes = require('../JSON/heroes.json');
const { games } = require("../rewards.json");
const { donate, shop } = require("./costs.json");
const { stripIndents } = require("common-tags");

module.exports = {
    "previous": "Previous",
    "next": "Next",
    "notUser": "User not found",
    "specify": "Specify a member.",
    "specifyT": "Specify a text.",
    "vipOne": "This command is available only for __VIP__ users.",
    "vipTwo": "This command is available only for __Premium__ users.",
    "maxLimit": num => `Maximum symbol count of the text must be __${num}__!`,
    "perm": "You don't have enough permissions.",
    "specifyL": "Specify a link.",
    "waiting": "Wait...",
    "loading": "Looking for an enemy.",
    "and": "and",
    "again": "Try again",
    "buttonYes": "Yes",
    "buttonNo": "No",
    "noStar": "You don't have enough golds.",
    "noCandy": "You don't have enough candies.",
    "noCrystal": "You don't have enough selendians.",
    "cardcooldown": "Please end the actions with the cards.",
    "cooldown": (time, cmd) => `Wait __${time}__ seconds, before using __${cmd}__.`,
    "cardFix": "Your payment will be completed within a few minutes.",
    "banned": "Your account was banned until",
    "timeOut": "Time out.",
    "ERROR": "Interaction error",
    "interError": "This button is not available to you!",
    "crystal": "Selendian:",

    "afkMess": (name, res) => `User **${name}** is currently in AFK mode\nBy reason: **${res}**`,



    "promoClass": {
        "noCode": "Please enter a promo code.",
        "noPromo": "This promo code does not exist.",
        "subReq": "This promo code is only available to subscribers",
        "noAvailable": "This promo code is no longer available.",
        "already": "You have already used this promo code.",
        "done": "You have successfully used the promo code, your reward"
    },



    "promocode": {
        "desc": "Use promo code.",
        "usage": "[promo code]",
        "access": "For everyone",
    },



    "special": {
        "desc": "Special temporary offer.",
        "usage": "",
        "access": "For everyone",
    },



    "vote": {
        "desc": "Vote for bot.",
        "usage": "",
        "access": "For everyone",
    },



    "breeding": {
        "desc": "Breed the heroes.",
        "usage": "[first hero] [second hero]",
        "access": "For everyone",
    },



    "collect": {
        "desc": "Collect the hero.",
        "usage": "[breeding number]",
        "access": "For everyone",
    },



    "skip": {
        "desc": "Skip the breeding.",
        "usage": "",
        "access": "For everyone",
    },



    "throw": {
        "desc": "Throw the hero.",
        "usage": "[breeding number]",
        "access": "For everyone",
    },



    "captcha": {
        "desc": "Solve the captcha and get gold.",
        "usage": "",
        "access": "For everyone",
    },



    "bank": {
        "desc": "Invest money and get more.",
        "usage": "[invest | card]",
        "access": "For everyone",
    },



    "2v2": {
        "desc": "Fight against bots with somewone.",
        "usage": "[ID | mention]",
        "access": "For everyone",
    },



    "forbs": {
        "desc": "List of the most richest members.",
        "usage": "",
        "access": "For everyone",
    },



    "heroes-rate": {
        "desc": "Rate of Heroes.",
        "usage": "",
        "access": "For everyone",
    },



    "combine": {
        "desc": "Combine 2 heroes.",
        "usage": "[name of the main hero] [name of the minor hero]",
        "access": "For everyone",
        "time": "Try again",
        "spec": "Specify the heroes!",
        "err": "The heroes not found!",
        "private": "Private hero can not be combined!"
    },


    "slots": {
        "desc": "Play the slot game.",
        "usage": "<bet>",
        "access": "For everyone",
        "win": "You won",
        "lose": "YOu lose"
    },



    "collection": {
        "desc": "View the collections.",
        "usage": "(check)",
        "access": "For everyone",
    },


    "locations": {
        "desc": "Explore locations and earn rewards.",
        "usage": "",
        "access": "For everyone",
    },



    "partner": {
        "desc": "View your personal donation code.",
        "usage": "(create)",
        "access": "For everyone",
    },



    "mail": {
        "desc": "Just mail.",
        "usage": "",
        "access": "For everyone",
    },



    "explore": {
        "desc": "Explore souls.",
        "usage": "",
        "access": "For everyone",
        "ends": "Exploring ends",
        "place": "What to explore..."
    },



    "stats": {
        "desc": "View your stats.",
        "usage": "",
        "access": "For everyone",
        "trial": "Max. trial stage:"
    },



    "guess": {
        "desc": "Game \"Guess a number\".",
        "usage": "",
        "access": "For everyone",
        "lose": "You lose...",
        "guess": (f, s) => `Guess a number between ${f} and ${s}.`,
        "win": "You answered correctly and won",
        "wrong": "You answered incorrectly."
    },



    "cardClass": {
        "specCode": "Please enter another card number. \`0123-4567\`",
        "specAmount": "Please enter the amount.",
        "already": "You already have this card.",
        "done1": "Map was created successfully!",
        "choose": "Select the desired card",
        "chs": "Choose your payment method",
        "custom1": "dep",
        "noCard": "You have no card.",
        "custom2": "giving",
        "min": "The minimum amount is 1",
        "dm": "Open your DM.",
        "findError": "Card not found.",
        "addContent": "Select a card to pay.",
        "max": "There is not that much space on the specified map.",
        "maxGive": "The maximum transfer amount for this card is",
        "typePin": "Enter the pin code of your card, you have 30 seconds.\nEnter \`cancel\` to reject the action.",
        "declined": "The action was successfully declined.",
        "done2": "Payment completed.",
        "timeOut": "Time out.",
        "custom3": "closing",
        "contentClose": "Select the card to close.",
        "closed": "The card has been closed successfully.",
        "bal": "Balance:",
        "custom4": "dep",
        "specDep": "Please enter the card you want to recharge.",
        "wait": "Please wait.",
        "another": "Please enter another card.",
        "custom5": "with",
        "cont": "Specify the card from which you want to withdraw."
    },



    "cards": {
        "desc": "Look at your credit cards.",
        "usage": "",
        "access": "For everyone",
        "number": "Number:",
        "balance": "Balance:",
        "createdAt": "Created at",
        "maxSpace": "Max. space:",
        "maxAmount": "Max. amount of transfers:",
        "perc": "Percentage:"
    },



    "link": {
        "desc": "Add site links to profile.",
        "usage": "[site name] [link]",
        "access": "For everyone",
        "link": "Specify a site name."
    },



    "close": {
        "desc": "Close the credit card.",
        "usage": "",
        "access": "For everyone",
    },



    "gcard": {
        "desc": "Replenish the credit card.",
        "usage": "[amount]",
        "access": "For everyone",
    },



    "take": {
        "desc": "Take credits from the card.",
        "usage": "[amount]",
        "access": "For everyone",
    },



    "open": {
        "desc": "Open a credit card.",
        "usage": "",
        "access": "For everyone",
        "cost": "Cost:"
    },



    "pins": {
        "desc": "Get the pin codes of your credi cards.",
        "usage": "",
        "access": "For everyone",
    },



    "send": {
        "desc": "Send golds to another cred card.",
        "usage": "[card number] <amount>",
        "access": "For everyone",
    },



    "trial": {
        "desc": "Start trial for 500 gold.",
        "trial": time => `Try again <t:${makeTimestamp(time)}:R>`,
        "usage": "",
        "access": "For everyone",
    },



    "heroModel": {
        "force": "Force:",
        "health": "Health:",
        "damage": "Damage:",
        "level": "Level:",
        "battle": "Battle started!",
        "winrate": "WinRate:",
        "reward": "Gain:",
        "noHero": "You don't have a hero.",
        "notHero": "Hero not found.",
        "common": "Common",
        "elite": "Elite",
        "furious": "Furious",
        "mythical": "Mythical",
        "private": "Legendary"

    },



    "clanModel": {
        "noClan": "You are not a member of a guild.",
        "clan": "You are already a member of a guild.",
        "notClan": "Guild not found.",
        "leader": "Leader:",
        "level": "Level:",
        "budget": "Budget:",
        "reward": "Reward:",
        "members": "Members",
        "noMembers": "Empty",
        "specN": "Please enter a number.",
        "notLeader": "You are not a guild leader.",
        "noApps": "There are no applications.",
        "noHero": "No hero"
    },



    "teamModel": {
        "noTeam": "Your clan does not have a military team.",
        "kicked": "The member was successfully kicked.",
        "gg": "Team is full!",
        "done1": "The member was successfully added to the team.",
        "notThisLeader": "The leader of this clan is not on this server.",
        "thisClanNotTeam": "This clan does not have a war team.",
        "youBudget": "You don't have enough rubies.",
        "targetBudget": "This clan doesn't have that many rubies.",
        "declined": "The leader of this clan declined.",
        "winner": "Winner",
        "req": bet => `your clan has been challenged to __ ${bet}__.`,
        "waiting": "Wait..."
    },



    "tchange": {
        "desc": "Change clan name.",
        "usage": "[member number | clear]",
        "access": "For everyone",
        "check": "Enter the number or `clear`"
    },



    "team": {
        "desc": "View the clan's team.",
        "usage": "",
        "access": "For everyone"
    },



    "war": {
        "desc": "Start a clan war.",
        "usage": "[clan number] <bet>",
        "access": "For everyone",
        "bet": "Enter your bet.",
        "betError": "Maximum bet - 50,000"
    },



    "tasks": {
        "desc": "Get your tasks.",
        "usage": "",
        "access": "For everyone",
    },



    "leaderboard": {
        "desc": "Get all leaderboards.",
        "usage": "[type]",
        "access": "For everyone",
        "no": "Please specify a type of leaderboard(`total`).",
        "games": "Top by games",
        "journey": "Adventure Top"
    },



    "channel-enable": {
        "desc": "Enable channel for commands.",
        "usage": "[mention | ID]",
        "access": "For Administrator",
        "no": "Please specify a channel.",
        "all": "This channel is already enabled.",
        "err": "Not found."
    },



    "channel-disable": {
        "desc": "Disable channel for commands.",
        "usage": "[mention | ID]",
        "access": "For Administrator",
        "no": "Please specify a channel.",
        "all": "This channel is already disabled.",
        "err": "Not found."
    },



    "enable": {
        "desc": "Enable command.",
        "usage": "[command name]",
        "access": "For Administrator",
        "no": "Please specify a command.",
        "all": "This command is already enabled.",
        "err": "Not found."
    },



    "disable": {
        "desc": "Disable the command.",
        "usage": "[command name]",
        "access": "For Administrator",
        "no": "Please specify a command.",
        "all": "This command is already disabled.",
        "err": "Not found."
    },



    "give": {
        "desc": "Give the hero to the member for the number of selendians.",
        "usage": "[hero name] [mention | ID] [price]",
        "access": "For everyone",
        "specH": "Specify a hero.",
        "cost": "Specify the price.",
        "noHero": "No hero found.",
        "min": "The minimum amount is __10__.",
        "not": "You cannot sell this hero.",
        "double": "The price cannot be more than twice.",
        "sure": (trans, cost) => `offers you a __${trans}__ hero for __${cost}__`,
        "find": "Looking for a member...",
        "place": "This member has enough heroes.",
        "already": "This member already has this hero.",
        "star": "This member does not have that many selendians.",
        "sell": (name, cost) => `You sold the hero: __${name}__ for __${cost}__ (20% tax)`
    },



    "reputation": {
        "desc": "Raise the reputation of the server.",
        "usage": "",
        "access": "For everyone",
        "done": "You have successfully raised the server reputation.",
        "time": time => `Try again in **${time.getUTCHours()} hours ${time.getMinutes()} minutes.**`
    },



    "bag": {
        "desc": "View your items.",
        "usage": "",
        "access": "For everyone",
    },



    "use": {
        "desc": "Use an item.",
        "usage": "[number of items]",
        "access": "For everyone",
        "err": "You do not have this item.",
        "boxDone": "You got:",
        "hero": name => `You got hero - __${name}__`
    },



    "language": {
        "desc": "Change the bot language on the server.",
        "usage": "[ru | en]",
        "access": "For Administrator",
        "err": "Specify language: **en, ru**",
        "done": "Language changed successfully."
    },



    "heroes": {
        "desc": "Heroes information.",
        "usage": "",
        "access": "For everyone",
        "cost": "Price:",
        "avail": "Available:",
        "donate": "Donate",
        "noavail": "No",
        "loc": "Can be found by exploring locations",
        "pack": "Temporary pack",
        "nocost": "Unknown",
        "yes": "Yes",
        "t1": "Previous",
        "t2": "Next",
    },



    "enemies": {
        "desc": "Enemy information.",
        "usage": "",
        "access": "For everyone",
        "t1": "Previous",
        "t2": "Next",
        "boss": "Boss"
    },



    "donate": {
        "desc": "Payment information.",
        "usage": "",
        "access": "For everyone",
        "donate1": () => {
            return new MessageEmbed()
                .setColor(main)
                .addFields(
                    {
                        name: `Support the developer, and buy premium access.`,
                        value: '**[Link to donate](https://www.donationalerts.com/r/adanadiscord)**',
                        inline: false
                    },
                    {
                        name: `Everything you need to specify!`,
                        value: '• Your ID\n • What exactly do you want, for example **VIP** or **Premium**.',
                        inline: false
                    },
                )
                .setTimestamp()
                .setFooter("Send your questions by command ?message")
        },
        "donate2": () => {
            return new MessageEmbed()
                .setColor(main)
                .addFields(
                    {
                        name: `Support the developer`,
                        value: `**[${rubToDollar(donate.just, formatNumber)} Monthly](https://boosty.to/iamdann/purchase/575340?ssource=DIRECT&share=subscription_link)**`,
                        inline: false
                    },
                    {
                        name: `Classic Boost 💛`,
                        value: `**[~~${rubToDollar(donate.classicBoost, formatNumber)}~~ ${rubToDollar(donate.classicBoost/2, formatNumber)} Monthly](https://boosty.to/iamdann/purchase/575346?ssource=DIRECT&share=subscription_link)**\n**Access to Private heroes**\n**+1 breeding slot**\n**+1 mining slot**\n+10% Soul of Tyrus\n+10% Soul of Ancalgon\n+5% Soul of Darius\nPrivate channel access`,
                        inline: false
                    },
                    {
                        name: `Average Boost 💚`,
                        value: `**[~~${rubToDollar(donate.averageBoost, formatNumber)}~~ ${rubToDollar(donate.averageBoost/2, formatNumber)} Monthly](https://boosty.to/iamdann/purchase/575347?ssource=DIRECT&share=subscription_link)**\n**Access to Private heroes**\n**+2 breeding slot**\n**+2 mining slot**\n+15% Soul of Tyrus\n+15% Soul of Ancalgon\n+10% Soul of Darius\nPrivate channel access`,
                        inline: false
                    },
                    {
                        name: `Maximum Boost 💜`,
                        value: `**[~~${rubToDollar(donate.maximumBoost, formatNumber)}~~ ${rubToDollar(donate.maximumBoost/2, formatNumber)} Monthly](https://boosty.to/iamdann/purchase/575348?ssource=DIRECT&share=subscription_link)**\n**Access to Private heroes**\n**+3 breeding slot**\n**+3 mining slot**\n+20% Soul of Tyrus\n+20% Soul of Ancalgon\n+15% Soul of Darius\nPrivate channel access`,
                        inline: false
                    },
                )
                .setTitle("Any subscription gives access to secret promocodes!")
                .setDescription(`Please be on [Support Server](https://discord.gg/Q6Guf7MmsT) to getting Boosts`)
                .setFooter("Send your questions by command ?message")
        }
    },


    
    "shop": {
        "desc": "Bun Shop.",
        "usage": "[pack | packs]",
        "access": "For everyone",
        "shop": () => {
            return new MessageEmbed()
                .setColor(main)
                .setAuthor("All information about transfers and monthly subscriptions: ?donate")
                .addFields(
                    {
                        name: `Developer's Boosty Account:`,
                        value: `**[boosty.to/iamdann](https://boosty.to/iamdann)**`,
                        inline: false
                    },
                    {
                        name: `${status.vip} VIP`,
                        value: `Access to commands - AFK, embed, channel, and bio profile, and also increases the cost of fish (by 33%), increases the max value of gift to 5000, and also increases the bet of all games.`,
                        inline: false
                    },
                    {
                        name: `${status.premium} Premium`,
                        value: `Gives access to unique heroes, reduces **cooldown** for all commands **two** times, and also gives more bet limit for all games, increases the max value of gift to 1000.`,
                        inline: false
                    },
                    {
                        name: `Prices in dollars.`,
                        value: stripIndents`
                        • VIP + 10000 ${STAR} - ~~${rubToDollar(shop.vip, formatNumber)}~~ ${rubToDollar(shop.vip/2, formatNumber)}
                        • Premium + 20000 ${STAR} - ~~${rubToDollar(shop.premium, formatNumber)}~~ ${rubToDollar(shop.premium/2, formatNumber)}
                        • 1 ${CRYSTAL} = 10 ${HELL.candy} (\`?buy candy 10\`)
                        • 1 ${CRYSTAL} = 5.000 ${STAR} (\`?buy golds 100000\`)
                        • 1000 ${CRYSTAL} - ~~${rubToDollar(shop.hazarCrystal, formatNumber)}~~ ${rubToDollar(shop.hazarCrystal/2, formatNumber)}
                        • 350 ${CRYSTAL} - ~~${rubToDollar(shop.ereq50Crystal, formatNumber)}~~ ${rubToDollar(shop.ereq50Crystal/2, formatNumber)}
                        • 100 ${CRYSTAL} - ~~${rubToDollar(shop.haryurCrystal, formatNumber)}~~ ${rubToDollar(shop.haryurCrystal/2, formatNumber)}
                        • Donate-box (50k-200k) - ${rubToDollar(shop.donateBox, formatNumber)}`,
                        inline: false
                    }
                )
                .setTitle("Any subscription gives you access to secret promotional codes!")
                .setFooter("Send your questions by command ?message")
        },
        "items": () => {
            return new MessageEmbed()
                .setColor(main)
                .setAuthor("Buff Shop")
                .addField(`${item.box.emoji} ${item.box.NAMEEN} : ~~${item.box.cost*2}~~ ${item.box.cost} ${STAR}`, `Gives a random item and up to ${item.box.max} golds`)
                .addField(`${item.megabox.emoji} ${item.megabox.NAMEEN} : ~~${item.megabox.cost*2}~~ ${item.megabox.cost} ${STAR}`, `Gives a random items up to 5 and up to ${item.megabox.max} golds`)
                .addField(`${item.hlt.emoji} ${item.hlt.NAMEEN} : ~~${item.hlt.cost*2}~~ ${item.hlt.cost} ${STAR}`, `Adds ${item.hlt.effect} health to the hero`)
                .addField(`${item.dmg.emoji} ${item.dmg.NAMEEN} : ~~${item.dmg.cost*2}~~ ${item.dmg.cost} ${STAR}`, `Adds ${item.dmg.effect} damage to the hero`)
                .addField(`${item.lvl.emoji} ${item.lvl.NAMEEN} : Can be obtained by opening boxes.`, `Increases the level of the hero ${item.lvl.effect} times`)
                .addField(`${item.meat.emoji} ${item.meat.NAMEEN} : Obtainable by defeating bosses or opening boxes.`, `Adds ${item.meat.effect} health to the hero`)
                .addField(`Packs`, "** **")
                .addField(`${item.pack1.emoji} ${item.pack1.NAMEEN} : ~~${item.pack1.cost*2}~~ ${item.pack1.cost} ${STAR}`, `Open and get one of these common heroes: \`${item.pack1.list.join(", ")}\``)
                .addField(`${item.pack2.emoji} ${item.pack2.NAMEEN} : ~~${item.pack2.cost*2}~~ ${item.pack2.cost} ${STAR}`, `Unlock and get one of these elite heroes: \`${item.pack2.list.join(", ")}\``)
                .addField(`${item.pack3.emoji} ${item.pack3.NAMEEN} : ~~${item.pack3.cost*2}~~ ${item.pack3.cost} ${STAR}`, `Open and get one of these Premium heroes: \`${item.pack3.list.join(", ")}\``)
                .addField(`${item.heroPack.emoji} ${item.heroPack.NAMEEN} : ~~${item.heroPack.cost*2}~~ ${item.heroPack.cost} ${CRYSTAL}`, `Open and get one random hero.`)
                .addField(`${item.tempPack.emoji} ${item.tempPack.NAMEEN} : ~~${item.tempPack.cost*2}~~ ${item.tempPack.cost} ${HELL.candy} __available until 11/30/2021__`, `Open and get one of these Temporary heroes: \`${item.tempPack.list.join(", ")}\``)
                .addField(`${item.donateBox.emoji} ${item.donateBox.NAMEEN} : ${rubToDollar(15, formatNumber)}`, `Open and get ${item.donateBox.winEN}`)
                .addField(`${item.goldBox.emoji} ${item.goldBox.NAMEEN} : ${rubToDollar(25, formatNumber)}`, `Open and get: __50-250__ ${CRYSTAL}`)

        }
    },



    "help": {
        "desc": "Help command.",
        "usage": "[command name]",
        "access": "For everyone",
        "t1": "Hello! I am",
        "t2": "My global prefix:",
        "t3": "My prefix on this server is:",
        "t4": "You can view all information about the team by writing:",
        "t5": "Number of commands:",
        "info": "Information",
        "vip": "VIP",
        "rpg": "Role Playing Game (RPG)",
        "react": "Reactive",
        "cards": "Cards and Teams",
        "fun": "Fun",
        "settings": "Settings",
        "Usage": "Usage:",
        "avail": "Available:",
        "nousage": "No usage.",
        "aliases": "Aliases:",
        "dm": "Open your DM messages, and try again.",
        "noaliases": "There are no aliases.",
        "cmd": "Command:",
        "Desc": "Description:",
        "cat": "Category:",
        "non": "Wrong command!",
        "nono": prefix => `**Write \`${prefix}help\` to see all the available bot commands!**`
    },



    "upgrade": {
        "desc": "Upgrade your hero.",
        "usage": "[info]",
        "access": "For everyone",
        "info": "Information about leveling up to",
        "cost": "Upgrade cost:",
        "err": "You don't have enough golds.\nCost of leveling up to the next level",
        "done": "Level successfully upped to"
    },



    "break-up": {
        "desc": "Break up...",
        "usage": "[username | mention | ID]",
        "access": "For everyone",
        "err": "You are not married.",
        "err1": "You have not enough golds - 150",
        "sure": "Are you sure you want to part? You will pay 150 for this",
        "action": "The action was successfully rejected.",
        "done": "you are now free..."
    },



    "journey": {
        "desc": "Go on an adventure.",
        "usage": "(info)",
        "access": "For everyone",
        "err1": "Buy a hero first.",
        "now": "your current adventure level:",
        "enemy": "Enemy",
        "find": "Looking for an enemy ...",
        "time": time => `You recently returned from an adventure. Rest **${time.getMinutes()} minutes ${time.getSeconds()} seconds.**.`,
        "done": "You are stronger.",
        "rew": "Level reward:",
        "he": "turned out to be stronger.",
        "err": "Come back in a while."
    },



    "sell": {
        "desc": "Sell fish.",
        "usage": "[fish number]",
        "access": "For everyone",
        "err": "ID fish not found:",
        "err1": 'I wonder how to sell "nothing".',
        "d1": "You sold",
        "d2": "for only"
    },



    "replace": {
        "desc": "Replace your main character.",
        "usage": "[hero number]",
        "access": "For everyone",
        "done": "Your main hero is now",
        "err": "You have one hero."
    },



    "quiz": {
        "desc": "Answer questions and receive rewards.",
        "usage": "",
        "access": "For everyone",
        "time": "You have 15 seconds.",
        "question": "Question:",
        "done": "You answered correctly, your reward",
        "else": "You answered incorrectly.",
        "err": "Time is up, please try again."
    },



    "battle": {
        "desc": "Go to battle against a random hero.",
        "usage": "",
        "access": "For everyone",
        "time": time => `Try again in **${time.getMinutes()} minutes ${time.getSeconds()} seconds.**.`,
        "find": "Looking for an enemy...",
        "bet": "Enter your bet.",
        "min": "Minimum bet **1**.",
        "vip1": `Maximum rate **${games.main.none}**!\nOr buy __VIP__`,
        "vip2": `Maximum rate **${games.main.vip}**!\nOr buy __Premium__`,
        "vipError": `Maximum bet **${games.main.premium}**!`,
        "winner": "Winner:",
        "between": "Battle between",
    },



    "profile": {
        "desc": "Get the user's profile.",
        "usage": "[username | mention | ID]",
        "access": "For everyone",
        "pr": "Profile:",
        "status": "Status:",
        "subs": "Subscription:",
        "none": "Unknown",
        "clan": "Guild:",
        "level": "Level:",
        "noclan": "Not a member of a guild.",
        "quiz": "Quiz:",
        "gg": "Spouse:",
        "from": "from",
        "fishes": "Fishes",
        "junk": "Junk",
        "common": "Common",
        "unc": "Uncommon",
        "rare": "Rare",
        "leg": "Legendary",
        "bio": "About me:"
    },



    "my": {
        "desc": "Information about your heroes.",
        "usage": "",
        "access": "For everyone",
        'b1': "Previous",
        "b2": "Next"
    },



    "marry": {
        "desc": "Get married...",
        "usage": "[mention | ID]",
        "access": "For everyone",
        "err1": "You are already married.",
        "time": time => `Try again in **${Math.round(Math.abs(time) / 86400000)} days**.`,
        "err2": "This member already has a partner.",
        "err3": "You have not enough golds - 150",
        "sure": "Offers you his hand and heart",
        "ref": "refused.",
        "done": "got married."
    },



    "kill": {
        "desc": "Kill your hero.",
        "usage": "",
        "access": "For everyone",
        "error": "Enter the hero you want to kill.",
        "notHero": "No hero found!",
        "done": "You have successfully killed your hero.",
    },



    "join": {
        "desc": "Apply to join the guild.",
        "usage": "[number of the guild]",
        "access": "For everyone",
        "time": time => `Try again in **${time.getMinutes()} minutes ${time.getSeconds()} seconds**.`,
        "offed": "Applications to join this guild are disabled!",
        "limit": "There are enough members in this guild!",
        "done": "You have successfully submitted your application."
    },



    "hero": {
        "desc": "View your hero's stats.",
        "usage": "",
        "access": "For everyone",
        "all": "Games played:",
        "win": "Games won:",
        "lose": "Lost games:",
        "journey": "Adventure"
    },



    "gift": {
        "desc": "Give golds to member.",
        "usage": "[username | mention | ID] [number of golds]",
        "access": "For everyone",
        "error1": "You cannot give gifts to yourself.",
        "error2": "Enter the number of golds to gift.",
        "error3": "You must get married first.",
        "error4": "This is not your soul mate.",
        "vip1": "Maximum amount **2500**!\nOr buy __VIP__",
        "vip2": "Maximum amount **5000**!\nOr buy __Premium__",
        "vipError": "Maximum amount **10000**!",
        "time": time => `Try again in **${time.getUTCHours()} hours ${time.getMinutes()} minutes**`,
        "doing": "A gift is being sent...",
        "min": "Minimum amount **10**.",
    },



    "ship": {
        "desc": "Shows compatibility with members and common items.",
        "usage": "[username | mention | ID | some item]",
        "access": "For everyone",
        "error": "Please specify something.",
        "done1": "Your compatibility with",
        "done2": "Love between"
    },



    "buy": {
        "desc": "Buy a hero.",
        "usage": "[slot or hero]",
        "access": "For everyone",
        "time": time => `You recently bought a hero.\nTry again in **${Math.round(Math.abs(time) / 86400000)} days ${time.getUTCHours()} hours.**.`,
        "specHero": "Specify an item.",
        "req": "How many items you want?\nExample: `3`",
        "need": "You need - ",
        "itemErr": "Item not found.",
        "noItem": "This item is not available.",
        "nh": "Hero not found.",
        "event": (f, s, fe, se) => `You successfully bought __${f}__ ${fe} for __${s}__ ${se}`,
        "vip": "This hero is available only for __Premium__ users.",
        "love": "You must be in love to buy this hero.",
        "place": "You don't have enough place.",
        "subError": "You need to have at least subscription",
        "already": "You already have this hero.",
        "donePlace": "You successfuly bought an extra slot for heroes.",
        "errPlace": "You already have an extra slot.",
        "error": "You don't have enough golds, or the hero is not available.",
        "done": name => `You have successfully bought — __${name}__.`,
        "not": "The hero is not available.",
        "pick": "Choose a hero",
        "err": "You already have enough heroes, first kill one to buy a new one."
    },



    "fish": {
        "desc": "Catch a fish.",
        "usage": "(list)",
        "access": "For everyone",
        "time": time => `You recently fished.\nTry again in **${time.getMinutes()} minutes ${time.getSeconds()} seconds.**`,
        "done": symbol => `**🎣 You dropped your line and caught ${symbol}**!`,
        "title": "List of fish, their rarity.",
        "list": () => {
            return `
        \`\`\`🔧Junk :: [ID: 1]
🐟Common :: [ID: 2]
🐠Uncommon :: [ID: 3]
🦑Rare :: [ID: 4]
🐋Legendary :: [ID: 5] \`\`\`
        
The more fish, the higher the price!
       `}
    },



    "guilds": {
        "desc": "All guilds.",
        "usage": "",
        "access": "For everyone",
        "lvl": "Lvl.",
        "members": "Members:",
        "budget": "Budget:",
        "clans": "All guilds",
        "noClans": "No one guild not found."
    },



    "daily": {
        "desc": "1 selendian and loot-box daily.",
        "usage": "",
        "access": "For everyone",
        "time": time => `You have already collected your daily prize.\nTry again in **${time.getUTCHours()} hours ${time.getMinutes()} minutes.**`,
        "done": "Your daily prize:"
    },


    "duel": {
        "desc": "Go to battle with a member.",
        "usage": "[nickname | mention | ID]",
        "access": "For everyone",
        "time": time => `Try again in **${time.getMinutes()} minutes ${time.getSeconds()} seconds**.`,
        "bot": "Fight the bot...hmm",
        "error1": "Please enter another member.",
        "error2": "You don't have a hero.",
        "error3": "The member does not have a hero.",
        "buttonReject": "Reject",
        "buttonAccept": "Accept",
        "invite": "you have 20 seconds to accept the duel.",
        "refused": "refused.",
        "find": "Looking for an enemy...",
        "winner": "Winner:",
        "among": "Duel between:",
    },



    "guild": {
        "desc": "Guild information.",
        "usage": "[help]",
        "access": "For everyone",
        "trans": "I am translating...",
        "unk": "Unknown",
        "min": star => `The minimum amount is __10__ ${star}`,
        "done": (val, emoji) => `You have successfully transferred __ ${val} __ ${emoji} to your guild`,
        "actions": "All available functions!",
        "helpCommand": (star, clan) => {
            const text = `
            \`guild (number)\` - Drop golds to the guild budget. (__2 ${star}__ = __1 ${clan}__)
            \`guild create [name]\` - Create your own guild (price 5000 ${star})
            \`guild kick [member number]\` - Kick a member out of the guild.
            \`guild up [member number]\` - Promote member.
            \`guild down [member number]\` - Demote member.
            \`guild apps\` - View guild applications.
            \`guild apps clear\` - Delete all orders.
            \`guild apps enable\` — Enable applications for joining the guild.
            \`guild apps disable\` — Disable applications for joining a guild.
            \`guild reject [номер заявки]\` — Reject the member's application..
            \`guild accept [номер заявки]\` — Accept a member to the guild..
            \`guild upgrade (info)\` — Upgrade the guild.
            \`guild description [текст]\` — Description for the guild.
            \`guild logo [ссылка на лого]\` — Logo for the guild.
            \`guild reward\` — Get daily golds.
            \`guild leave\` — Leave the guild.
            \`guild delete\` — Delete a guild.
            \`guild message\` — Send a message to every member of the guild.
            \`guild give (amount)\` — Use budget and give some golds to every member.
            \`guild shop\` — Guild shop.
            `
            return text;
        },
         // shop
        "cost": "Price:",
        "shopName": "Guild Shop",
        "bonusHealth": "Heroes life bonus:",
        "bonusDamage": "Heroes attack bonus:",
        "forEach": "for all member.",
        "write": "Write the number of item, to buy it.",
        "notAvailableLimit": "This item is not available anymore for your guild!",
        // create
        "doing": "Executing a request...",
        "name": "Enter your guild name.",
        "doneC": "You have successfully created your guild!",
        // kick
        "noMember": "No guild member found!",
        "uLeader": "You are the leader of the guild.",
        "uStaff": "Can't kick employee out.",
        "kicked": name => `You have successfully kicked the member __${name}__.`,
        // apps
        "appsE": "Applications have been successfully enabled.",
        "appsEE": "Applications are already included!",
        "appsD": "Applications have been successfully disabled.",
        "appsDD": "Applications are already disabled!",
        "appsClear": "All applications were rejected.",
        "appsError": "You are not the guild leader, or you specified something incorrectly.",
        "appType": {
            "m": 'Member:',
            "h": "Hero:",
            "l": "Level:"
        },
        "apps": "All applications!",
        // reject
        "appError": "Application not found.",
        "rejDone": "Application was successfully rejected.",
        // accept
        "accepting": "I accept...",
        "enoughMembers": "There are enough members in your guild, upgrade your guild.",
        "already": "This member is already in another guild.",
        "acceptDone": "The application was successfully accepted.",
        // upgrade
        "upLimit": "Your guild has been maximized!",
        "upInfoTitle": "guild upgrade information.",
        "upInfo": (cost, emoji, space, level) => `Price - __${cost}__ ${emoji}\nNumber of maximum members: __${space}__ + __5__\n${level === 5 ? 'Guild description and logo will be available!' : ''}`,
        "upVip": "You must have at least __VIP__ to upgrade your guild.",
        "upDo": "Improving...",
        "errorRub": "Not enough rubies!",
        "upped": level => `Guild level successfully upgraded to __${level}__.`,
        // description
        "descError": "Please provide a description.",
        "clanLevel5": "This feature is available for guilds with level 5 or higher.",
        "descDone": "The guild description was successfully set.",
        // logo
        "logoDone": "The guild logo was successfully installed.",
        // delete
        "quest": "Are you sure you want to delete the guild?",
        "canceled": "Action was successfully canceled",
        "deleteDone": "You have successfully deleted your guild.",
        // reward
        "rewardTime": time => `Try again in **${time.getUTCHours()} hours ${time.getMinutes()} minutes**.`,
        "getReward": (val, emoji) => `All guild members received each - __${val}__ ${emoji}`,
        // leave
        "leaveQuest": "Are you sure you want to leave the guild?",
        "ldCant": "Leader can't leave the guild.",
        "leaveDone": "You have successfully left the guild.",
        // up
        "uError": "You have already promoted this member.",
        "uLimit": "You already have enough employees.",
        "uDone": "You have successfully promoted a member.",
        // down
        "dError": "Could not demote this member.",
        "dDone": "You have successfully demoted a member.",
        // message
        "mDone": "The message was successfully sent to everyone.",
        "mTitle": "You have a message from the guild leader",
        // action error
        "actionError": "Specify an action.\n\`guild help\`"
    },

    "boss": {
        "desc": "Battle with a boss.",
        "usage": "[username | mention | ID] 2 members",
        "access": "For everyone",
        "wait": "Wait a minute.",
        "time": time => `Try again in __${time.getUTCHours()} hours ${time.getMinutes()} minutes__.`,
        "error": "Specify 2 members.",
        "error1": "Specify another member.",
        "secondH": "The second member doesn't have a hero.",
        "thirdH": "The third member doesn't have a hero.",
        "invite": "You are invited to fight the boss, you have 20 seconds to accept\n\`Press on your nickname\`",
        "got1": "The first member agreed.",
        "got2": "The second member agreed.",
        "ref1": "The first member refused.",
        "ref2": "The second member refused.",
        "timeError": "Time is up!",
        "connect": "Connecting with the boss.",
        "turned": "turned out to be stronger.",
        "gaveUp": "gave up.",
        "gets": "Everyone gets",
        "lost": "lost",
        "won": "won",
        "button1": "Refuse",
        "button2": "Agree"
    },



    "avatar": {
        "desc": "Get a user's avatar.",
        "AVATAR": "Avatar",
        "usage": "[username | mention | ID] (Optional)",
        "access": "For everyone"
    },


    "botinfo": {
        "desc": "Information about me.",
        "usage": "",
        "access": "For everyone",
        "title": "Information about the bot!",
        "field1": "Name:",
        "create": "Created at:",
        "dev": "Developer: ",
        "prefix": "Global prefix: ",
        "link": "Boosty",
        "inv": "Developer's Boosty account:",
        "support": "Our discord server:"
    },


    "ranks": {
        "desc": "Get top of active members",
        "usage": "(delete) [rank]",
        "access": "For everyone",
        "f1": "Top of 10 members!",
        "f2": "**The level system for this server is disabled!**",
        "f3": "**There is no one here yet.**",
        "del": "delete",
        "buttonName1": "Cancel",
        "buttonName2": "Delete",
        "serious": "Are you sure you want to delete member details?",
        "canceled": "Action rejected successfully.",
        "done": "You have successfully deleted the member data.",
        "level": "Level:",
        "xp": "XP:",
        "top20": "Top of 20 active members!",
        "top30": "Top of 30 active members!"
    },


    "message": {
        "desc": "Send message to developer of the bot.",
        "usage": "[your message]",
        "access": "For everyone",
        "time": time => `Try again in **${time.getMinutes()} minutes ${time.getSeconds()} seconds**.`,
        "error": "Leave a message",
        "done": "Thank you for your feedback, we will review your message.\nPlease make sure your DM is open.",
    },



    "rank": {
        "desc": "Get the rank of the member.",
        "usage": "[member]",
        "access": "For everyone",
        "offed": "The level system for this server is disabled!!",
        "notBot": "Bots don't have a profile!",
        "error": "The user don't have a rank yet.",
        "level": "Level",
        "xp": "XP",
        "rank": "Rank"
    },



    "server": {
        "desc": "Get information about the server.",
        "usage": "",
        "access": "For everyone",
        "f1": 'Information about the server',
        "f2": 'Channels:',
        "f3": 'Joined:',
        "f4": 'Created at:',
        "f5": 'Owner:',
        "f6": 'Members:',
        "f7": 'Online:',
        "f8": 'Offline:',
        "f9": 'Categories:',
        "f10": 'Verified:',
        "f11": 'Custom commands.'
    },



    "status": {
        "desc": "Information about the user's status.",
        "usage": "[username | mention | ID]",
        "access": "For everyone",
        "error1": "Status not found!",
        "error2": 'This user don\'t have any status!',
        "custom": "Custom Status",
        "type": "Type:",
        "playing": "Playing:",
        "game": "Game:",
        "details": "Details:",
        "not": "Not found",
        "working": "Working on:",

        "title": "Spotify Track Info",
        "name": "Song's name:",
        "album": "Album",
        "author": "Author",
        "listen": "Listen in Spotify"
    },



    "user": {
        "desc": "Get information about the user.",
        "usage": "[username | mention | ID]",
        "access": "For everyone",
        "custom": "Custom Status",
        "playing": "Playing:",
        "listening": "Listening:",
        "watching": "Wathcing:",
        "streaming": "Streaming:",
        "name": "Username:",
        "author": "Information about the user",
        "f1": "Created at:",
        "f2": "Joined at:",
        "f3": "Count of the roles:",
        "f4": "The highest role:",
        "f5": "Number of messages within one day:"
    },



    "bite": {
        "desc": "Bite the user.",
        "usage": "[username | mention | ID]",
        "access": "For everyone",
        "error1": "You can't bite yorself.",
        "done": "bit"
    },



    "cry": {
        "desc": "Just cry...",
        "usage": "(username | mention | ID)",
        "access": "For everyone",
        "done1": "burst into tears because of",
        "done2": "burst into tears."
    },



    "feed": {
        "desc": "Feed someone.",
        "usage": "[username | mention | ID]",
        "access": "For everyone",
        "error": "You can't feed yorself.",
        "done": "fed"
    },



    "hug": {
        "desc": "Hug someone.",
        "usage": "[username | mention | ID]",
        "access": "For everyone",
        "error": "You can't hug yorself.",
        "done": "hugged"
    },



    "kiss": {
        "desc": "Kiss someone.",
        "usage": "[username | mention | ID]",
        "access": "For everyone",
        "error": "You can't kiss yorself.",
        "done": "kissed",
        "already": "This member already has someone.",
        "fidelity": "Where is your fidelity?",
        "button1": "Refuse",
        "button2": "Agree",
        "question": "Wants to kiss you",
        "refused": "refused"
    },



    "pat": {
        "desc": "Pat someone.",
        "usage": "[username | mention | ID]",
        "access": "For everyone",
        "error": "You can't pat yorself.",
        "done": "pat"
    },



    "poke": {
        "desc": "Poke someone.",
        "usage": "[username | mention | ID]",
        "access": "For everyone",
        "error": "You can't poke yorself.",
        "done": "poked"
    },



    "slap": {
        "desc": "Slap someone.",
        "usage": "[username | mention | ID]",
        "access": "For everyone",
        "error": "You can't slap yorself.",
        "done": "slapped"
    },



    "smoke": {
        "desc": "Just smoke",
        "usage": "",
        "access": "Для всех",
        "done": "smokes."
    },



    "tickle": {
        "desc": "Tickle someone.",
        "usage": "[username | mention | ID]",
        "access": "For everyone",
        "error": "You can't tickle yorself.",
        "done": "tickled"
    },



    "afk": {
        "desc": "Enter the AFK mode.",
        "usage": "[message]",
        "access": "For VIP",
        "error": "Message can't be a link.",
        "done1": "You entered the AFK mode.",
        "done2": "You are out of the AFK mode.",
        "args": "Specufy a reason to enter the AFK mode."
    },



    "embed": {
        "desc": "Send an embed message in the specified text channel.",
        "usage": "[mention channel] [colour hex] [text]",
        "access": "For VIP and Administrator",
        "error1": "Specify a text channel.",
        "error2": "Specify an embed colour.",
        "error3": "Specify a valid text channel."
    },



    "channel": {
        "desc": "Send a message in the specified text channel.",
        "usage": "[mention channel] [text]",
        "access": "For VIP and Administrator",
        "error1": "Specify a text channel.",
        "error2": "Specify a valid text channel."
    },



    "bio": {
        "desc": "Description for your profile.",
        "usage": "[text]",
        "access": "For VIP",
        "done": "A new bio-profile has been successfully installed."
    },



    "profile-image": {
        "desc": "Image for your profile.",
        "usage": "[link]",
        "access": "For Premium",
        "done": "A new image-profile has been successfully installed."
    },



    "rank-color": {
        "desc": "Colour for the text in rank-card.",
        "usage": "[hex colour]",
        "access": "For Premium",
        "error": "Specify a hex colour.\nExample: \`#ff00ff or ff00ff\`",
        "done": "A new colour for your rank-card successfully installed."
    },



    "rank-image": {
        "desc": "Image for your rank-card.",
        "usage": "[link]",
        "access": "For Premium",
        "done": "A new rank-card image has been successfully installed."
    },



    "burn": {
        "desc": "Burn users.",
        "usage": "(mention | ID | username)",
        "access": "For everyone",
    },



    "rip": {
        "desc": "Damn...",
        "usage": "(mention | ID | username)",
        "access": "For everyone",
    },



    "trigger": {
        "desc": "Triggered users's avatar.",
        "usage": "(mention | ID | username)",
        "access": "For everyone",
    },



    "custom": {
        "desc": "Create a new custom command.",
        "usage": "[name] [response]",
        "access": "For Administrator",
        "name": "Specify a name.",
        "resp": "Specify a command response.",
        "done": "New command successfully created",
        "updated": "The command successfully updated.",
    },



    "delete": {
        "desc": "Delete a custom command.",
        "usage": "[name]",
        "access": "For Administrator",
        "name": "Specify a name.",
        "err": cmd => `Command __${cmd}__ not found.`,
        "done": "The command successfully deleted",
    },



    "ranking": {
        "desc": "Enable/Disable ranking system.",
        "usage": "[enable | disable]",
        "access": "For Administrator",
        "error": "Specify an action\nExample: \`?ranking enable\`.",
        "button1": "Cancel",
        "button2": "Delete",
        "sure": "Are you sure to disable and reset ranking system?",
        "canceled": "An action successfully canceled",
        "done": "Ranking system successfuly disabled.",
        "done1": "Ranking system already disabled.",
        "done2": "Ranking sytem enabled now.",
        "done3": "Ranking system already enabled.",
        "done4": "An action not found",
    },



    "prefix": {
        "desc": "Change the server prefix.",
        "usage": "[prefix]",
        "access": "For Administrator",
        "now": "Server's prefix:",
        "err": "Specify a new prefix.",
        "err1": "Specify another prefix.",
        "done": "Server's new prefix:"
    },



    "welcome": {
        "desc": "Enable/Disable server welcoming system.",
        "usage": "[action] [parametr]",
        "access": "For Administrator",
        "error": "Specify an action\n\`?welcome info\`\nActions: \`image, text, color, channel\`",
        "done": "Welcoming enabled.",
        "done1": "Welcoming already enabled.",
        "done2": "Welcoming disabled.",
        "done4": "Welcoming already disabled.",
        "now": "Server's welcoming.",
        "image": "Image",
        "text": "Text",
        "color": "Color",
        "channel": "Channel",
        "not": "Not found.",
        "spec": "Specify a parametr\nHelp: \`?welcome image help\`",
        "helpImage": "\`?welcome image [link]\`",
        "imageDone": "A new welcoming image successfully instaled.",
        "LINK": "Link",
        "helpText": "\`?welcome text [your text]\`",
        "textDone": "A new welcoming text successfully instaled.",
        "helpColor": "\`?welcome color [hex color]\`",
        "colorDone": "A new welcoming color successfully instaled.",
        "channelHelp": "\`?welcome channel [channel name | ID | mention]\`",
        "channelDone": "A new welcoming channel successfully instaled.",
        "channelError": "Channel not found.",
        "err": "Action not found."
    }

}