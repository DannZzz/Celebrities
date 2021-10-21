const yes = ['yes', 'y', 'ye', 'yea', 'correct', 'да', 'Да'];
const no = ['no', 'n', 'nah', 'nope', 'fuck off', 'нет', 'Нет', 'не'];
const MONEY = ['', 'k', 'M', 'G', 'T', 'P', 'E'];
const { bag: bd } = require("./../functions/models");
const inviteRegex = /(https?:\/\/)?(www\.|canary\.|ptb\.)?discord(\.gg|(app)?\.com\/invite|\.me)\/([^ ]+)\/?/gi;
const botInvRegex = /(https?:\/\/)?(www\.|canary\.|ptb\.)?discord(app)\.com\/(api\/)?oauth2\/authorize\?([^ ]+)\/?/gi;
const { DISAGREE, AGREE } = require('./../config')
const {  MessageActionRow,
  Message,
  MessageEmbed,
  MessageButton,} = require('discord.js');
const {main, none, greenlight, reddark} = require('./../JSON/colours.json')
const { powersFind, powers, serverFind, mail, mailFind } = require("./models.js");

module.exports = {
  getHeroData: async (bot, sponsorID, data) => {
    const get = data.heroes.find(x => x.name === data.item);
    const {health, damage} = get;
    const server = bot.guilds.cache.get("882589567377637408");

    const boosterRoleIds = {
      classic: "897172766929858601",
      premium: "897172906021371926",
      premiumPlus: "897172954411053098"
    }
    
    let boostCount = 0;
    if (server) {
      const member = server.members.cache.get(sponsorID);
      if (member) {
        if (member.roles.cache.get(boosterRoleIds.premiumPlus)) {
          boostCount = 20;
        } else if (member.roles.cache.get(boosterRoleIds.premium)) {
          boostCount = 15;
        } else if (member.roles.cache.get(boosterRoleIds.classic)) {
          boostCount = 10;
        }
      }
    }
    
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
    

    const finalHealth = Math.round(health + (health * pows.h / 100));
    const finalDamage = Math.round(damage + (damage * pows.d / 100));
    return {
      h: finalHealth,
      d: finalDamage
    }
  },

  getPowers: async function (bot, sponsorID, data) {
    const server = bot.guilds.cache.get("882589567377637408");

    const boosterRoleIds = {
      classic: "897172766929858601",
      premium: "897172906021371926",
      premiumPlus: "897172954411053098"
    }
    
    let boostCount = 0;
    if (server) {
      const member = server.members.cache.get(sponsorID);
      if (member) {
        if (member.roles.cache.get(boosterRoleIds.premiumPlus)) {
          boostCount = 20;
        } else if (member.roles.cache.get(boosterRoleIds.premium)) {
          boostCount = 15;
        } else if (member.roles.cache.get(boosterRoleIds.classic)) {
          boostCount = 10;
        }
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
  error: function (msg, text = 'Ошибка') {
    const Emb = new MessageEmbed()
    .setColor(reddark)
    //.setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
    .setDescription(`${DISAGREE} ${text}`)

    const button = new MessageButton()
      .setStyle("LINK")
      .setLabel("Commands")
      .setURL("https://adanabot.github.io/pages/commands.html")

    const row = new MessageActionRow().addComponents([button]);
    
    msg.react(DISAGREE)
    return msg.reply({embeds: [Emb]}).then(message => setTimeout(() => message.delete(), 30000))
  },
  progressBar: function (perc, ofMaxValue, size, line = '❤', slider = '🖤') {
  if (!perc) throw new Error('Perc value is either not provided or invalid');
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

  getMember(message, toFind = '') {
    toFind = toFind.toLowerCase();

    var target = message.guild.members.cache.get(toFind);

    if (!target && message.mentions.members)
      target = message.mentions.members.first();

    if (!target && toFind) {
      target = message.guild.members.cache.find(member => {
        return member.displayName.toLowerCase().includes(toFind) ||
          member.user.tag.toLowerCase().includes(toFind)
      });
    }

    if (!target)
      target = message.member;

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
  },
}
