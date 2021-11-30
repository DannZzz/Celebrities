const yes = ['yes', 'y', 'ye', 'yea', 'correct', 'да', 'Да'];
const no = ['no', 'n', 'nah', 'nope', 'fuck off', 'нет', 'Нет', 'не'];
const MONEY = ['', 'k', 'M', 'G', 'T', 'P', 'E'];
const { bag: bd, rpg, rpgFind } = require("./../functions/models");
const inviteRegex = /(https?:\/\/)?(www\.|canary\.|ptb\.)?discord(\.gg|(app)?\.com\/invite|\.me)\/([^ ]+)\/?/gi;
const botInvRegex = /(https?:\/\/)?(www\.|canary\.|ptb\.)?discord(app)\.com\/(api\/)?oauth2\/authorize\?([^ ]+)\/?/gi;
const { DISAGREE, AGREE, adminID, devID, STAFF } = require('./../config')
const {  MessageActionRow,
  Message,
  MessageEmbed,
  MessageButton,} = require('discord.js');
const {main, none, greenlight, reddark} = require('./../JSON/colours.json')
const heroes = require('./../JSON/heroes.json')
const { voteFind, powersFind, powers, serverFind, mail, mailFind, clanFind, botData } = require("./models.js");
const Subs = require("./subscriptionClass");
const badges = require("./../JSON/badges.json");
const levels = require("./../JSON/starLevels.json");

async function template (action, data = {}) {
    // data = {
    //   id: discordUserId,
    //   rpg: rpgModel,
    //   item: "heroName",
    //   countToAdd: 3,
    //   type: "common",
    //   stars: 3
    // }
    const actions = {
      "get": async function () {
        let rp;
        if (data.rpg) {
          rp = data.rpg;
        } else if (!data.rpg && !data.id) {
          throw new Error("Rpg model or userID not found!");
        } else {
          rp = await rpgFind(data.id);
          if (!rp) throw new Error("User data not found!");
        }

        let heroName = data.item || rp.item;
        const heroInHeroes = rp.heroes.find(heroObj => heroObj.name === heroName);
        if (!heroName || !heroInHeroes) throw new Error("Hero not found!");

        const starCount = heroInHeroes.stars || 1;
        const addedHeroes = heroInHeroes.addedHeroes || 0;

        return {
          stars: starCount,
          added: addedHeroes
        };

      },
      "update": async function () {
         let rp;
        if (data.rpg) {
          rp = data.rpg;
        } else if (!data.rpg && !data.id) {
          throw new Error("Rpg model or userID not found!");
        } else {
          rp = await rpgFind(data.id);
          if (!rp) throw new Error("User data not found!");
        }

        let heroName = data.item || rp.item;
        const heroInHeroes = rp.heroes.find(heroObj => heroObj.name === heroName);
        const heroIndex = rp.heroes.findIndex(heroObj => heroObj.name === heroName);
        if (!heroName || !heroInHeroes) throw new Error("Hero not found!");

        let count = 1;
        if (data.countToAdd && !isNaN(data.countToAdd) && Math.round(data.countToAdd) > 0) count = Math.round(data.countToAdd);

        const storage = rp.storage || [];

        const heroStorage = storage.find(obj => obj.name === heroName);
        if (!heroStorage) {
          return false;
        } else {
          if (heroStorage.count < 0) return false;
          if (heroStorage.count < count) count = heroStorage.count;

          let stars = await this.get().then(data => data.stars);
          let need = this.need(heroes[heroName].type, heroInHeroes.stars || 1);
          if (count + (heroInHeroes.addedHeroes || 0) > need) count = need - (heroInHeroes.addedHeroes || 0);

          await rpg.updateOne({userID: rp.userID}, {$inc: { [`heroes.${heroIndex}.addedHeroes`]: count, [`storage.${rp.storage.indexOf(heroStorage)}.count`]: -count}});

          rp = await rpgFind(rp.userID);
          const updatedHero = rp.heroes.find(heroObj => heroObj.name === heroName);
          if (updatedHero.addedHeroes >= need) {
            await rpg.updateOne({userID: rp.userID}, {$set: {
             [`heroes.${heroIndex}.addedHeroes`]: 0,
             },
             $inc: {
              [`heroes.${heroIndex}.stars`]: heroInHeroes.stars ? 1 : 2
             }
           });
            return true;
          }
        }

      },
      "need": function (type = data.type, stars = data.stars) {
        if (!type || !stars) throw new Error("need Error");
        return Math.round(levels[type] * stars);
      }

    }

    if (!action || !actions[action]) {
      throw new Error("Action not found");
    } else {
      const result = await actions[action]();
      return result;
    }

  }

module.exports = {
  heroStarsGenerator: template,

  getPrivilege: async (id) => {
    let finallArrEmojies = [];

    if (devID.includes(id)) {
      finallArrEmojies.push(STAFF.dev);
    } else if (adminID.includes(id)) {
      finallArrEmojies.push(STAFF.owner);
    }

    const bot = await botData.findOne({name: "main"});

    bot.bugHunter && bot.bugHunter.includes(id) && finallArrEmojies.push(badges.bugHunter.emoji);
    bot.idea && bot.idea.includes(id) && finallArrEmojies.push(badges.idea.emoji);
    
    return finallArrEmojies;
  },

  HealthToZero: (obj1 = {}, obj2 = {}) => { 
    // {
    //   id: "user1",
    //   health: 100000,
    //   damage: 1000
    // }
    if ( !obj1 || !obj2 || obj1 === {} || obj2 === {} ) return false;
    const random = Math.ceil(Math.random() * 40);
    let winner, loser;
    if (random <= 20) {
      while (true) {
        obj1.health -= obj2.damage;
        obj2.health -= obj1.damage;
        if (obj1.health <= 0) {
          winner = obj2.id;
          loser = obj1.id;
          break;
        } else if (obj2.health <= 0) {
          winner = obj1.id;
          loser = obj2.id;
          break;
        }
      }
    } else {
      while (true) {
        obj1.health -= obj2.damage;
        obj2.health -= obj1.damage;
        if (obj2.health <= 0) {
          winner = obj1.id;
          loser = obj2.id;
          break;
        } else if (obj1.health <= 0) {
          winner = obj2.id;
          loser = obj1.id;
          break;
        }
      }
    }

    return {
      winner,
      loser
    }
  },
  
  getHeroData: async function (sponsorID, data) {

    const starData = await template("get", {
      rpg: data,
      item: data.item
    });

    const starBonus = Math.round(starData.stars * levels.bonus);
    
    const dataPow = await Subs.getSubId(sponsorID);
    const get = data.heroes.find(x => x.name === data.item);
    const {health, damage} = get;

    let healthFromClan = 0;
    let damageFromClan = 0;

    if(data.clanID) {
      const clanData = await clanFind(data.clanID);

      healthFromClan += (clanData.addHealth || 0);
      damageFromClan += (clanData.addDamage || 0);
    };

    const hero = heroes[get.name];
    let perc = 1;
    switch (hero.type) {
      case "private":
        perc = 5;
        break;
      case "mythical":
        perc = 4;
        break;
      case "furious":
        perc = 3;
        break;
      case "elite":
        perc = 2;
        break;
      default:
        break;
    };


    let boostCount = 0;
    if (dataPow) {
      if (dataPow == 3) {
        boostCount = 20;
      } else if (dataPow == 2) {
        boostCount = 15;
      } else if (dataPow == 1) {
        boostCount = 10;
      }
    };
    
    let pows;
    let powData = await powersFind(sponsorID);
    if (!powData) {
      const newData = await powers.create({
        userID: sponsorID
      })
      newData.save();
    }
    powData = await powersFind(sponsorID);

    pows = {
      h: (powData.health.value || 0.2) + boostCount,
      d: (powData.damage.value || 0.2) + boostCount,
    };
    

    let finalHealth = Math.round(health + (health * pows.h / 100) + (health * starBonus / 100));
    let finalDamage = Math.round(damage + (damage * pows.d / 100) + (damage * starBonus / 100));

    finalHealth += (finalHealth * perc / 100);
    finalHealth += (health * healthFromClan / 100);
    finalDamage += (damage * damageFromClan / 100); 
    
    return {
      h: Math.round(finalHealth),
      d: Math.round(finalDamage)
    }
  },

  getPowers: async function (sponsorID) {
    const dataPow = await Subs.getSubId(sponsorID);
    
    let boostCount = 0;
    
    if (dataPow) {
      if (dataPow == 3) {
        boostCount = 20;
      } else if (dataPow == 2) {
        boostCount = 15;
      } else if (dataPow == 1) {
        boostCount = 10;
      }
    };
  

    let pows;

    let powData = await powersFind(sponsorID);
    if (!powData) {
      const newData = await powers.create({
        userID: sponsorID
      })
      newData.save();
    }
    powData = await powersFind(sponsorID);
    
    
    return {
      h: (powData.health.value || 1.2) + boostCount,
      d: (powData.damage.value || 1.2) + boostCount,
      g: (powData.gold.value || 0) + (boostCount !== 0 ? boostCount-5 : 0)
    }

  },

  sendToMail: async function(id, {
    textMessage,
    createdAt
  }) {
    let data = await mailFind(id);
    if (!data) {
        const newData = await mail.create({
            userID: id
        });
        await newData.save();
    }
    data = await mailFind(id);
    
    data.messages.unshift({
      message: textMessage,
      date: createdAt
    })
    data.save();
  },

  forceGenerator(f, s, t) {
    const numb = (f + s + t) / 3000;
    return numb.toFixed(1);
  },

  roundFunc: function (num, precision = 1) {
    precision = Math.pow(10, precision)
    return Math.round(num * precision) / precision
  }, 
  perms: function (msg, perm) {
    return msg.member.permissions.has(perm)
  },
  embed: function (msg, text= '', isEm = true) {
    const Emb = new MessageEmbed()
    .setColor(greenlight)
    .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
    if(isEm === true) {Emb.setDescription(`${AGREE} ${text}`)}
    else if (isEm === false) {
      Emb.setDescription(`${text}`).setColor(none)
    } else if (isEm === "dm") {
      return Emb.setDescription(`${text}`).setColor(none)
    }
    return msg.channel.send({embeds: [Emb]})
  },

  missingArgument: async (msg, description, usage = "", examples = []) => {
    const sd = await serverFind(msg.guild.id);
    
    const Emb = new MessageEmbed()
    .setColor(reddark)
    .setDescription(DISAGREE + " " + description)
    .addField(sd.lang === "en" ? "Usage" : "Применение", `\`${usage}\``)
    .addField(sd.lang === "en" ? "Examples" : "Примеры", `\`${examples.join("\n")}\``)

    return msg.reply({embeds: [Emb]}).then(message => setTimeout(() => message.delete(), 30000))
  },
  
  error: function (msg, text = 'Ошибка') {
    const Emb = new MessageEmbed()
    .setColor(reddark)
    //.setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
    .setDescription(`${DISAGREE} ${text}`)

    function _getCallerFile() {
      try {
          var err = new Error();
          var callerfile;
          var currentfile;
  
      Error.prepareStackTrace = function (err, stack) { return stack; };
  
      currentfile = err.stack.shift().getFileName();
  
      while (err.stack.length) {
          callerfile = err.stack.shift().getFileName();
  
          if(currentfile !== callerfile) return callerfile;
      }
    } catch (err) {}
    return undefined;  
    }
   

    const button = new MessageButton()
      .setStyle("LINK")
      .setLabel("Commands")
      .setURL("https://adanabot.github.io/pages/commands.html")

    const row = new MessageActionRow().addComponents([button]);
    
    msg.react(DISAGREE)
    return msg.reply({embeds: [Emb]}).then(message => setTimeout(() => message.delete(), 15000))
  },

  voteTime: async function (id, lang) {
    const vote = await voteFind(id);

    if (!vote.topggDate || (vote.topggDate < new Date()) ) {
      if (lang === "en") {
        return `You are ready for voting!`;
      } else {
        return `Вы готовы для голосования!`;
      }
    } else {
      if (lang === "en") {
        return `You can vote <t:${Math.round(vote.topggDate.getTime() / 1000)}:R>`;
      } else {
        return `Ты можешь голосовать <t:${Math.round(vote.topggDate.getTime() / 1000)}:R>`
      }
    }
  },
  
  progressBar: function (perc, ofMaxValue, size, line = '❤', slider = '🖤') {
  if (!perc && perc !== 0) throw new Error('Perc value is either not provided or invalid');
  if (isNaN(perc)) throw new Error('Perc value is not an integer');
  if (isNaN(ofMaxValue)) throw new Error('ofMaxValue value is not an integer');
  if (isNaN(size)) throw new Error('Size is not an integer');
  const percentage = perc / ofMaxValue; // Calculate the percentage of the bar
  const progress = Math.round((size * percentage)); // Calculate the number of square caracters to fill the progress side.
  const emptyProgress = size - progress; // Calculate the number of dash caracters to fill the empty progress side.

  const progressText = line.repeat(progress); // Repeat is creating a string with progress * caracters in it
  const emptyProgressText = slider.repeat(emptyProgress); // Repeat is creating a string with empty progress * caracters in it
  const percentageText = Math.round(percentage * 100) + '%'; // Displaying the percentage of the bar

  const bar = '**[' + progressText + emptyProgressText + ']' + percentageText + '**'; // Creating the bar
  return bar;
  },
  checkValue: async function (user, val) {
    const pr = await bd.findOne({userID: user.id});
    if (pr.stars < val){ return true}
    else {return false};
  },

  getMember(message, toFind = false) {
    var target;

    if (!message.mentions.members && !toFind) target = message.member;
    
    if (message.mentions.members) target = message.mentions.members.first();

    if (toFind && !message.mentions.members) {
      target = message.guild.members.cache.get(toFind);
      if (!target) target = message.member;
    }

    return target;
  },

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  makeTimestamp(timestamp, add = 0) {
    return Math.round((timestamp + add) / 1000);
  },

  formatDate: function (date) {
    return new Intl.DateTimeFormat('en-US').format(date);
  },

  promptMessage: async function (message, author, time, validReactions) {
    time *= 1000;

    for (const reaction of validReactions) await message.react(reaction);

    const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

    return message
      .awaitReactions(filter, { max: 1, time: time })
      .then(collected => collected.first() && collected.first().emoji.name);
  },

  drawImageWithTint: function (ctx, image, color, x, y, width, height) {
    const { fillStyle, globalAlpha } = ctx;
    ctx.fillStyle = color;
    ctx.drawImage(image, x, y, width, height);
    ctx.globalAlpha = 0.5;
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = fillStyle;
    ctx.globalAlpha = globalAlpha;
  },

  randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  shuffle: function (array) {
    const arr = array.slice(0);
    for (let i = arr.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  },

  verify: async function (channel, user, { time = 30000, extraYes = [], extraNo = [] } = {}) {
    const filter = res => {
      const value = res.content.toLowerCase();
      return (user ? res.author.id === user.id : true)
        && (yes.includes(value) || no.includes(value) || extraYes.includes(value) || extraNo.includes(value));
    };
    const verify = await channel.awaitMessages({
      filter,
      max: 1,
      time
    });
    if (!verify.size) return 0;
    const choice = verify.first().content.toLowerCase();
    if (yes.includes(choice) || extraYes.includes(choice)) return true;
    if (no.includes(choice) || extraNo.includes(choice)) return false;
    return false;
  },

  chunk: function (array, chunkSize) {
    const temp = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      temp.push(array.slice(i, i + chunkSize));
    }
    return temp;
  },

  getWrapText: function (text, length) {
    const temp = [];
    for (let i = 0; i < text.length; i += length) {
      temp.push(text.slice(i, i + length));
    }
    return temp.map(x => x.trim());
  },

  crFormat: function (number) {
    const ranking = Math.log10(number) / 3 | 0;
    if (!ranking) return number.toString();
    const last = MONEY[ranking];
    const scale = Math.pow(10, ranking * 3);
    const scaled = number / scale;
    return `${scaled.toFixed(2)}${last}`;
  },

  formatNumber: (number, minimumFractionDigits = 0) => {
    return Number.parseFloat(number).toLocaleString(undefined, {
      minimumFractionDigits,
      maximumFractionDigits: 2
    });
  },

  list: function (arr, conj = 'and') {
    const len = arr.length;
    if (len === 0) return '';
    if (len === 1) return arr[0];
    return `${arr.slice(0, -1).join(', ')}${len > 1 ? `${len > 2 ? ',' : ''} ${conj} ` : ''}${arr.slice(-1)}`;
  },

  firstUpperCase(text, split = ' ') {
    return text.split(split).map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join(' ');
  },

  shorten(text, maxLen = 2000) {
    return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text;
  },

  stripInvites(str, { guild = true, bot = true, text = '[redacted invite]' } = {}) {
    if (guild) str = str.replace(inviteRegex, text);
    if (bot) str = str.replace(botInvRegex, text);
    return str;
  },

  wrapText (ctx, text, maxWidth) {
		return new Promise(resolve => {
			if (ctx.measureText(text).width < maxWidth) return resolve([text]);
			if (ctx.measureText('W').width > maxWidth) return resolve(null);
			const words = text.split(' ');
			const lines = [];
			let line = '';
			while (words.length > 0) {
				let split = false;
				while (ctx.measureText(words[0]).width >= maxWidth) {
					const temp = words[0];
					words[0] = temp.slice(0, -1);
					if (split) {
						words[1] = `${temp.slice(-1)}${words[1]}`;
					} else {
						split = true;
						words.splice(1, 0, temp.slice(-1));
					}
				}
				if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
					line += `${words.shift()} `;
				} else {
					lines.push(line.trim());
					line = '';
				}
				if (words.length === 0) lines.push(line.trim());
			}
			return resolve(lines);
		});
	},

  rubToDollar: function (rub, func, lang = "en") {
    if (lang === "ru") {
      return `${rub}₽`
    } else {
      const f = amount => func(amount*0.014, 2);
      return `${f(rub)}$`
    }
  },

  async pagination(interaction, pages, buttonList, timeout = 120000, ids) {
    //if (!msg && !msg.channel) throw new Error("Channel is inaccessible.");
    if (!pages) throw new Error("Pages are not given.");
    if (!buttonList) throw new Error("Buttons are not given.");
    if (buttonList[0].style === "LINK" || buttonList[1].style === "LINK")
      throw new Error(
        "Link buttons are not supported with discordjs-button-pagination"
      );
    if (buttonList.length !== 2) throw new Error("Need two buttons.");

    let page = 0;

    const row = new MessageActionRow().addComponents(buttonList);
    const curPage = await interaction.reply({
      embeds: [pages[page].setFooter(`${page + 1} / ${pages.length}`)],
      components: [row],fetchReply: true,
    });

    const sd = await serverFind(interaction.guild.id);
    const { ERROR, interError } = require(`./../languages/${sd.lang}`);

    const filter = (i) => { if (
      (i.customId === buttonList[0].customId ||
      i.customId === buttonList[1].customId) &&
      ids.includes(i.user.id)) {
        return true;
      } else if (!ids.includes(i.user.id)) {
        const intEmbed = new MessageEmbed()
            .setColor(reddark)
            .setTitle(ERROR)
            .setDescription(interError)
          
          return i.reply({embeds: [intEmbed], ephemeral: true})
      }
        
    };

    const collector = await curPage.createMessageComponentCollector({
      filter,
      time: timeout,
    });

    collector.on("collect", async (i) => {
      switch (i.customId) {
        case buttonList[0].customId:
          page = page > 0 ? --page : pages.length - 1;
          break;
        case buttonList[1].customId:
          page = page + 1 < pages.length ? ++page : 0;
          break;
        default:
          break;
      }
      await i.deferUpdate();
      await i.editReply({
        embeds: [pages[page].setFooter(`${page + 1} / ${pages.length}`)],
        components: [row],
      }).catch(()=>interaction.react('❌'));
      collector.resetTimer();
    });

    collector.on("end", () => {
      if (!curPage.deleted) {
        const disabledRow = new MessageActionRow().addComponents(
          buttonList[0].setDisabled(true),
          buttonList[1].setDisabled(true)
        );
        curPage.edit({
          embeds: [pages[page].setFooter(`${page + 1} / ${pages.length}`)],
          components: [disabledRow],
        });
      }
    });

    return curPage;
  },

  async paginationBig(interaction, pages, buttonList, timeout = 120000, ids) {
    //if (!msg && !msg.channel) throw new Error("Channel is inaccessible.");
    if (!pages) throw new Error("Pages are not given.");
    if (!buttonList) throw new Error("Buttons are not given.");
    if (buttonList[0].style === "LINK" || buttonList[1].style === "LINK")
      throw new Error(
        "Link buttons are not supported with discordjs-button-pagination"
      );

    let page = 0;

    const sd = await serverFind(interaction.guild.id);
    const { ERROR, interError } = require(`./../languages/${sd.lang}`);
  
    const row = new MessageActionRow().addComponents(buttonList);
    const curPage = await interaction.reply({
      embeds: [pages[page].setFooter(`${page + 1} / ${pages.length}`)],
      components: [row],fetchReply: true,
    });

    const filter = (i) =>{ if (
      (i.customId === buttonList[0].customId ||
      i.customId === buttonList[1].customId ||
      i.customId === buttonList[2].customId ||
      i.customId === buttonList[3].customId ||
      i.customId === buttonList[4].customId) &&
      ids.includes(i.user.id) ) {
        return true;
      } else if (!ids.includes(i.user.id)) {
        const intEmbed = new MessageEmbed()
            .setColor(reddark)
            .setTitle(ERROR)
            .setDescription(interError)
          
          return i.reply({embeds: [intEmbed], ephemeral: true})
      }
    };

    const collector = await curPage.createMessageComponentCollector({
      filter,
      time: timeout,
    });

    collector.on("collect", async (i) => {
      let asd = false
      switch (i.customId) {
        case buttonList[0].customId:
          page = 0;
          break;
        case buttonList[1].customId:
          page = page > 0 ? --page : pages.length - 1;
          break;
        case buttonList[2].customId:
          asd = true
          break;  
        case buttonList[3].customId:
          page = page + 1 < pages.length ? ++page : 0;
          break;
        case buttonList[4].customId:
          page = pages.length-1;
          break;  
        default:
          break;
      }
      
      await i.deferUpdate();
      await i.editReply({
        embeds: [pages[page].setFooter(`${page + 1} / ${pages.length}`)],
        components: [row],
      }).catch(()=>interaction.react('❌'));
      collector.resetTimer();
      if (asd) {
        const disabledRow = new MessageActionRow().addComponents(
          buttonList[0].setDisabled(true),
          buttonList[1].setDisabled(true),
          buttonList[2].setDisabled(true),
          buttonList[3].setDisabled(true),
          buttonList[4].setDisabled(true)
        );
        curPage.edit({
          embeds: [pages[page].setFooter(`${page + 1} / ${pages.length}`)],
          components: [disabledRow],
        });
      }
    });

    collector.on("end", () => {
      if (!curPage.deleted) {
        const disabledRow = new MessageActionRow().addComponents(
          buttonList[0].setDisabled(true),
          buttonList[1].setDisabled(true),
          buttonList[2].setDisabled(true),
          buttonList[3].setDisabled(true),
          buttonList[4].setDisabled(true)
        );
        curPage.edit({
          embeds: [pages[page].setFooter(`${page + 1} / ${pages.length}`)],
          components: [disabledRow],
        });
      }
    });

    return curPage;
  }
}
