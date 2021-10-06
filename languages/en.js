const {MessageEmbed} = require("discord.js");
const { COIN, BANK, STAR } = require('../config');
const {greenlight, redlight, main} = require('../JSON/colours.json');
const item = require('../JSON/items');

module.exports = {   
    "previous": "Previous",
    "next": "Next",
    "notUser": "User not found",
    "specify": "Specify a member.",
    "specifyT": "Specify a text.",
    "vipOne": "This command is available only for __VIP 1__ users.",
    "vipTwo": "This command is available only for __VIP 2__ users.",
    "maxLimit": num => `Maximum symbol count of the text must be __${num}__!`,
    "perm": "You don't have enough permissions.",
    "specifyL": "Specify a link.",
    "waiting": "Wait...",
    "loading": "Looking for an enemy.",
    "and": "and",
    "buttonYes": "Yes",
    "buttonNo": "No",
    "noStar": "You don't have enough golds.",
    "cardcooldown": "Please end the actions with the cards.",
    "cooldown": (time, cmd) => `Wait __${time}__ seconds, before using __${cmd}__.`,
    "cardFix": "Your payment will be completed within a few minutes.",

    "afkMess": (name, res) => `User **${name}** is currently in AFK mode\nBy reason: **${res}**`,
    


    "promoClass": {
        "noCode": "Please enter a promo code.",
        "noPromo": "This promo code does not exist.",
        "noAvailable": "This promo code is no longer available.",
        "already": "You have already used this promo code.",
        "done": "You have successfully used the promo code, your reward"
    },



    "promocode": {
        "desc": "Use promo code.",
        "usage": "[promo code]",
        "access": "For everyone",
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
    
    
    
    "heroModel": {
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
        "private": "Private"
    },



    "clanModel": {
        "noClan": "You are not a member of a clan.",
        "clan": "You are already a member of a clan.",
        "notClan": "Clan not found.",
        "leader": "Leader:",
        "level": "Level:",
        "budget": "Budget:",
        "reward": "Reward:",
        "members": "Members",
        "noMembers": "Empty",
        "specN": "Please enter a number.",
        "notLeader": "You are not a clan leader.",
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
        "desc": "Give the hero to the member for the number of golds.",
        "usage": "[hero name] [mention | ID] [price]",
        "access": "For everyone",
        "specH": "Specify a hero.",
        "cost": "specify the price.",
        "noHero": "No hero found.",
        "min": "The minimum amount is __100__.",
        "not": "You cannot sell this hero.",
        "double": "The price cannot be more than twice.",
        "sure": (trans, cost) => `offers you a __${trans}__ hero for __${cost}__`,
        "find": "Looking for a member...",
        "place": "This member has enough heroes.",
        "already": "This member already has this hero.",
        "star": "This member does not have that many golds.",
        "sell": (name, cost) => `You sold the hero: __${name}__ for __${cost}__(20% tax)`
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
        "usage": "[item number] [number of items]",
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
        "noavail": "Gift from the developer",
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
        "donate": () => {
            return new MessageEmbed ()
            .setColor (main)
            .addFields (
                {name: `Support the developer, and buy premium access.`,
                value: '**[Link to donate](https://www.donationalerts.com/r/danndevbot)**',
                inline: false},
                {name: `Everything you need to specify!`,
                value: '• Your ID\n • What exactly do you want, for example **Vip 1** or **Vip 2**.',
                inline: false},
            )
            .setTimestamp ()
            .setFooter ("Send your questions by command ?message")
        }
    },



    "shop": {
        "desc": "Bun Shop.",
        "usage": "[pack | packs]",
        "access": "For everyone",
        "shop": () => {
            return new MessageEmbed ()
            .setColor (main)
            .setAuthor ("All information about transfers: ?donate")
            .addFields (
                {name: `<a:vip1:867868958877810748> VIP 1`,
                value: `Access to commands - AFK, embed, channel, levels (enabling the level system) and bio profile, and also increases the cost of fish (by 33%), increases the max value of gift to 1000, and also increases the bet of batlle.`,
                inline: false},
                {name: `<a:vip2:867868958459166751> VIP 2`,
                value: `Gives access to unique heroes, reduces **cooldown** for all commands **two** times, makes it possible to issue a rank card, profile picture, and also gives more bet limit for all games, increases the max value of gift to 2500.`,
                inline: false},{name: `Prices in dollars.`,
                    value: `• Vip 1 + 1000 ${STAR} - 0,2$\n • Vip 2 + 2000 ${STAR} - 0,41$\n • Hero **Zeus** - 1,1$\n • 100000 ${STAR } - 1,1$ (47% discount)\n • 30000 ${STAR} - 0,4$ (33% discount)\n • 10000 ${STAR} - 0,2$`,
                    inline: false},
                    {name: `Extra place for heroes.`,
                    value: `• Cost: Your place count * 2000 ${STAR}\n \`?buy place\``,
                    inline: false}
                )
                .setTimestamp ()
                .setFooter ("Send your questions by command ?message")
            },
            "items": () => {
                return new MessageEmbed ()
                .setColor (main)
                .setAuthor ("Buff Shop")
                .addField(`**#1** ${item.box.emoji} Item Box: ${item.box.cost} ${STAR}`, `Gives a random item and up to 150 golds`)
                .addField(`**#2** ${item.hlt.emoji} Potion of Health: ${item.hlt.cost} ${STAR}`, `Adds ${item.hlt.effect} health to the hero`)
                .addField(`**#3** ${item.dmg.emoji} Potion of Attack: ${item.dmg.cost} ${STAR}`, `Adds ${item.dmg.effect} damage to the hero`)
                .addField(`**#4** ${item.lvl.emoji} Potion of Level: Can be obtained by opening boxes.`, `Increases the level of the hero ${item.lvl.effect} times`)
                .addField(`**#5** ${item.meat.emoji} Meat of Health: Obtainable by defeating bosses or opening boxes.`, `Adds ${item.meat.effect} health to the hero`)
                .addField(`Packs`, "** **")
                .addField(`**#6** ${item.pack1.emoji} Common Pack: ${item.pack1.cost} ${STAR}`, `Open and get one of these common heroes: \`${item.pack1.list.join(", ")}\``)
                .addField(`**#7** ${item.pack2.emoji} Elite Pack: ${item.pack2.cost} ${STAR}`, `Unlock and get one of these elite heroes: \`${item.pack2.list.join(", ")}\``)
                .addField(`**#8** ${item.pack3.emoji} VIP pack: ${item.pack3.cost} ${STAR}`, `Open and get one of these VIP heroes: \`${item.pack3.list.join(", ")}\``)
                .addField(`**#9** ${item.tempPack.emoji} Pak of Ancient Egyptian gods: ${item.tempPack.cost} ${STAR} __available until 10/31/2021__`, `Open and get one of these Temporary heroes: \`${item.tempPack.list.join(", ")}\``)
                
            }
        },



    "help": {
        "desc": "Help command.",
        "usage": "[command name]",
        "access": "For everyone",
        "t1": "Hello! I am",
        "t2": "My global prefix:",
        "t3": "My prefix on this server is:",
        "t4": "More information:",
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
        "vip1": "Maximum rate **50**!\nOr buy __VIP 1__",
        "vip2": "Maximum rate **100**!\nOr buy __VIP 2__",
        "vipError": "Maximum bet **250 **!",
        "winner": "Winner:",
        "between": "Battle between",
    },



    "profile": {
        "desc": "Get the user's profile.",
        "usage": "[username | mention | ID]",
        "access": "For everyone",
        "pr": "Profile:",
        "none": "Unknown",
        "clan": "Clan:",
        "level": "Level:",
        "noclan": "Not a member of a clan.",
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
        "time": time => `Try again in **${Math.round(Math.abs (time) / 86400000)} days**.`,
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
        "desc": "Apply to join the clan.",
        "usage": "[number of clan]",
        "access": "For everyone",
        "time": time => `Try again in **${time.getMinutes()} minutes ${time.getSeconds ()} seconds**.`,
        "offed": "Applications to join this clan are disabled!",
        "limit": "There are enough members in this clan!",
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
        "vip1": "Maximum amount **50**!\nOr buy __VIP 1__",
        "vip2": "Maximum amount **150**!\nOr buy __VIP 2__",
        "vipError": "Maximum amount **500**!",
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
        "vip": "This hero is available only for __VIP 2__ users.",
        "love": "You must be in love to buy this hero.",
        "place": "You don't have enough place.",
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
        "list": () => {return `
        \`\`\`🔧Junk :: [ID: 1]
🐟Common :: [ID: 2]
🐠Uncommon :: [ID: 3]
🦑Rare :: [ID: 4]
🐋Legendary :: [ID: 5] \`\`\`
        
The more fish, the higher the price!
       `}
    },



    "clans": {
        "desc": "All clans in current server.",
        "usage": "",
        "access": "For everyone",
        "lvl": "Lvl.",
        "members": "Members:",
        "budget": "Budget:",
        "clans": "Server's clans",
        "noClans": "No one clan not found."
    },



    "daily": {
        "desc": "10 golds and 1 box daily.",
        "usage": "",
        "access": "For everyone",
        "time": time => `You have already collected your daily prize.\nTry again in **${time.getUTCHours()} hours ${time.getMinutes()} minutes.**`,
        "done": "Your daily prize: 10"
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



    "clan": { 
        "desc": "Clan information.",
        "usage": "[help]",
        "access": "For everyone",
        "trans": "I am translating...",
        "unk": "Unknown",
        "min": star => `The minimum amount is __10__ ${star}`,
        "done": (val, emoji) => `You have successfully transferred __ ${val} __ ${emoji} to your clan`,
        "actions": "All available functions!",
        "helpCommand": (star, clan) => {
            const text = `
            \`clan (number)\` - Drop golds to the clan budget. (__2 ${star}__ = __1 ${clan}__)
            \`clan create [name]\` - Create your own clan (price 5000 ${star})
            \`clan kick [member number]\` - Kick a member out of the clan.
            \`clan up [member number]\` - Promote member.
            \`clan down [member number]\` - Demote member.
            \`clan apps\` - View clan applications.
            \`clan apps clear\` - Delete all orders.
            \`clan apps enable\` — Enable applications for joining the clan.
            \`clan apps disable\` — Disable applications for joining a clan.
            \`clan reject [номер заявки]\` — Reject the member's application..
            \`clan accept [номер заявки]\` — Accept a member to the clan..
            \`clan upgrade (info)\` — Upgrade the clan.
            \`clan description [текст]\` — Description for the clan.
            \`clan logo [ссылка на лого]\` — Logo for the clan.
            \`clan reward\` — Get daily golds.
            \`clan leave\` — Leave the clan.
            \`clan delete\` — Delete a clan.
            \`clan message\` — Send a message to every member of the clan.
            \`clan give (amount)\` — Use budget and give some golds to every member.
            `
            return text;
        },
        // create
        "doing": "Executing a request...",
        "name": "Enter your clan name.",
        "doneC": "You have successfully created your clan!",
        // kick
        "noMember": "No clan member found!",
        "uLeader": "You are the leader of the clan.",
        "uStaff": "Can't kick employee out.",
        "kicked": name => `You have successfully kicked the member __${name}__.`,
        // apps
        "appsE": "Applications have been successfully enabled.",
        "appsEE": "Applications are already included!",
        "appsD": "Applications have been successfully disabled.",
        "appsDD": "Applications are already disabled!",
        "appsClear": "All applications were rejected.",
        "appsError": "You are not the clan leader, or you specified something incorrectly.",
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
        "enoughMembers": "There are enough members in your clan, upgrade your clan.",
        "already": "This member is already in another clan.",
        "acceptDone": "The application was successfully accepted.",
        // upgrade
        "upLimit": "Your clan has been maximized!",
        "upInfoTitle": "Clan upgrade information.",
        "upInfo": (cost, emoji, space, level) => `Price - __${cost}__ ${emoji}\nNumber of maximum members: __${space}__ + __5__\n${level === 5 ? 'Clan description and logo will be available!' : ''}`,
        "upVip": "You must have at least __VIP 1__ to upgrade your clan.",
        "upDo": "Improving...",
        "errorRub": "Not enough rubies!",
        "upped": level => `Clan level successfully upgraded to __${level}__.`,
        // description
        "descError": "Please provide a description.",
        "clanLevel5": "This feature is available for clans with level 5 or higher.",
        "descDone": "The clan description was successfully set.",
        // logo
        "logoDone": "The clan logo was successfully installed.",
        // delete
        "quest": "Are you sure you want to delete the clan?",
        "canceled": "Action was successfully canceled",
        "deleteDone": "You have successfully deleted your clan.",
        // reward
        "rewardTime": time => `Try again in **${time.getUTCHours()} hours ${time.getMinutes()} minutes**.`,
        "getReward": (val, emoji) => `All clan members received each - __${val}__ ${emoji}`,
        // leave
        "leaveQuest": "Are you sure you want to leave the clan?",
        "ldCant": "Leader can't leave the clan.",
        "leaveDone": "You have successfully left the clan.",
        // up
        "uError": "You have already promoted this member.",
        "uLimit": "You already have enough employees.",
        "uDone": "You have successfully promoted a member.",
        // down
        "dError": "Could not demote this member.",
        "dDone": "You have successfully demoted a member.",
        // message
        "mDone": "The message was successfully sent to everyone.",
        "mTitle": "You have a message from the clan leader",
        // action error
        "actionError": "Specify an action.\n\`?clan help\`"
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
        "field1" : "Name:", 
        "create": "Created at ",
        "dev": "Developer: ",
        "prefix": "Global prefix: ",
        "link": "INVITE",
        "inv" : "If you want to invite me, click:",
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
        "f3": 'Joined at:',
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
        "access": "For VIP 1",
        "error": "Message can't be a link.",
        "done1": "You entered the AFK mode.",
        "done2": "You are out of the AFK mode.",
        "args": "Specufy a reason to enter the AFK mode."
    },



    "embed": {
        "desc": "Send an embed message in the specified text channel.",
        "usage": "[mention channel] [colour hex] [text]",
        "access": "For VIP 1 and Administrator",
        "error1": "Specify a text channel.",
        "error2": "Specify an embed colour.",
        "error3": "Specify a valid text channel."
    },
    
    
    
    "channel": {
        "desc": "Send a message in the specified text channel.",
        "usage": "[mention channel] [text]",
        "access": "For VIP 1 and Administrator",
        "error1": "Specify a text channel.",
        "error2": "Specify a valid text channel."
    },
    
    
    
    "bio": {
        "desc": "Description for your profile.",
        "usage": "[text]",
        "access": "For VIP 1",
        "done": "A new bio-profile has been successfully installed."
    },
    
    
    
    "profile-image": {
        "desc": "Image for your profile.",
        "usage": "[link]",
        "access": "For VIP 2",
        "done": "A new image-profile has been successfully installed."
    },
    
    
    
    "rank-color": {
        "desc": "Colour for the text in rank-card.",
        "usage": "[hex colour]",
        "access": "For VIP 2",
        "error": "Specify a hex colour.\nExample: \`#ff00ff or ff00ff\`",
        "done": "A new colour for your rank-card successfully installed."
    },
    
    
    
    "rank-image": {
        "desc": "Image for your rank-card.",
        "usage": "[link]",
        "access": "For VIP 2",
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