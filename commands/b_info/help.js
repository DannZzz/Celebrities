const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { readdirSync } = require("fs");
const serverModel = require("../../models/serverSchema")
const { stripIndents } = require("common-tags");
const { cyan } = require("../../JSON/colours.json");
const { DEV, AGREE, PREFIX, DISAGREE, LEFT, RIGHT, DLEFT, DRIGHT, CANCEL  } = require('../../config');
const {firstUpperCase} = require("../../functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);

module.exports = {
    config: {
      name: "help",
      aliases: ['h', 'хелп'],
      category: "b_info",
    },
    run: async (bot, message, args) => {
      let limited = rateLimiter.take(message.author.id)
      if(limited) return


      const getLang = require("../../models/serverSchema");
      const LANG = await getLang.findOne({serverID: message.guild.id});
      const {help: h, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`); 
      const cmd = require(`../../languages/${LANG.lang}`)  
   
        let prefix;
        let serverData = await serverModel.findOne({ serverID: message.guild.id });
        if(!serverData) {
          let server = await serverModel.create({
            serverID: message.guild.id,
          })
        server.save()}

        prefix = serverData.prefix;
        let catArray = ['RPG', 'roleplay', 'rpg', 'информация', 'инфо', 'info', 'экономика', 'economy', 'реакционные', 'реакция', 'reaction', 'фан', 'fun', 'настройки', 'settings', 'VIP', 'vip']
        const embed = new MessageEmbed()
            .setColor(cyan)
            .setAuthor(`${message.guild.me.displayName}`, message.guild.iconURL())
            .setThumbnail(bot.user.displayAvatarURL())

        if (!args[0]) {


            const categories = readdirSync("./commands/")
            const fkit = [];
            embed.setDescription(`**${h.t1} ${message.guild.me.displayName}\n${h.t2} \`${PREFIX}\`\n${h.t3} \`${prefix}\`\n${h.t4}\n\`${prefix}help [hero]\`**`)
            embed.setFooter(`${message.guild.me.displayName} | ${h.t5} ${bot.commands.size-6} `, bot.user.displayAvatarURL());

            // test
            const map = categories.map( (category) => {
              const dir = bot.commands.filter(c => c.config.category === category);
              if(category === "b_info") {category = h.info}
              else if (category === "e_fun") {
                category = h.fun
              }
              else if (category === "g_vip") {
                category = h.vip
              }
              else if (category === "h_roleplay") {
                category = h.rpg
              }
              else if (category === "d_reaction") {
                category = h.react
              }
              else if (category === "f_settings") {
                category = h.settings
              } 

            if (category === "owner") return 

              const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1);
              fkit.push(new MessageEmbed()
                .setAuthor(`${h.t1} ${message.guild.me.displayName}\n${h.t2} ${PREFIX}\n${h.t3} ${prefix}`)
                .setTitle(capitalise)
                .setColor(cyan)
                .setThumbnail(bot.user.displayAvatarURL())
                .setDescription(dir.map( c =>`**${c.config.name} — [${c.config.aliases.join(", ") || h.noaliases}]**\n${cmd[c.config.name].desc}\n\`${cmd[c.config.name].usage || h.nousage}\``).join("\n"))
            )
            })
            const timeout = '100000'
            const userids = [message.author.id]
            const button1 = new MessageButton()
                  .setCustomId('previousbtn')
                  .setEmoji(LEFT)
                  .setStyle('SECONDARY');
        
                  const button0 = new MessageButton()
                  .setCustomId('0btn')
                  .setEmoji(DLEFT)
                  .setStyle('SECONDARY');
        
                  const buttonlast = new MessageButton()
                  .setCustomId('lastbtn')
                  .setEmoji(DRIGHT)
                  .setStyle('SECONDARY');
        
                  const button2 = new MessageButton()
                  .setCustomId('nextbtn')
                  .setStyle('SECONDARY')
                  .setEmoji(RIGHT);
        
                  const cancel = new MessageButton()
                  .setCustomId('cancel')
                  .setStyle('SECONDARY')
                  .setEmoji(CANCEL);
        
            let buttonList = [
                button0,
                button1,
                cancel,
                button2,
                buttonlast
            ]
            
            paginationBig(message, fkit, buttonList, timeout, userids, h.dm)

            // test 
            // return message.channel.send({embeds: [embed]})
          
        } else {
            let command = bot.commands.get(bot.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase())
            if (!command) return message.channel.send({embeds: [embed.setTitle(`${DISAGREE} **${h.non}**`).setDescription(h.nono(prefix))]})
            command = command.config
            
            let category = command.category;
            if(category === "b_info") {category = h.info}
            else if (category === "e_fun") {
              category = h.fun
            }
            else if (category === "g_vip") {
              category = h.vip
            }
            else if (category === "h_roleplay") {
              category = h.rpg
            }
            else if (category === "d_reaction") {
              category = h.react
            }
            else if (category === "f_settings") {
              category = h.settings
            }

            embed.setDescription(stripIndents`**${h.t2} \`${PREFIX}\`**
            **${h.t3} \`${prefix}\`**\n
            ** ${h.cmd} ** \`${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}\`
            ** ${h.Desc} ** \`${cmd[command.name]["desc"]}\`
            **${h.cat}** \`${category}\`
            ** ${h.Usage} ** ${cmd[command.name].usage ? `\`${prefix}${command.name} ${cmd[command.name].usage}\`` : "`"+h.nousage+"`"}
            ** ${h.avail} ** \`${cmd[command.name].access}\`
            ** ${h.aliases} ** \`${command.aliases ? command.aliases.join(", ") : h.noaliases}\``)
            embed.setFooter(message.guild.name, message.guild.iconURL())

            return message.channel.send({embeds: [embed]})
        }
    }
};


async function paginationBig(interaction, pages, buttonList, timeout = 120000, ids, text) {
  //if (!msg && !msg.channel) throw new Error("Channel is inaccessible.");
  if (!pages) throw new Error("Pages are not given.");
  if (!buttonList) throw new Error("Buttons are not given.");
  if (buttonList[0].style === "LINK" || buttonList[1].style === "LINK")
    throw new Error(
      "Link buttons are not supported with discordjs-button-pagination"
    );

  let page = 0;

  const row = new MessageActionRow().addComponents(buttonList);
  let curPage;
  try {
    curPage = await interaction.author.send({
      embeds: [pages[page].setFooter(`${page + 1} / ${pages.length}`)],
      components: [row]
    })
    interaction.react("<:inbox:887742555603734528>")
  } catch (error) {
    return interaction.channel.send(DISAGREE+" "+text);
  }
  //.then(() => .catch(() => );
  
  const filter = (i) =>
    (i.customId === buttonList[0].customId ||
    i.customId === buttonList[1].customId ||
    i.customId === buttonList[2].customId ||
    i.customId === buttonList[3].customId ||
    i.customId === buttonList[4].customId) &&
    ids.includes(i.user.id);

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