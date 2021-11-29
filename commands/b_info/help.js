const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { readdirSync } = require("fs");
const { stripIndents } = require("common-tags");
const { DEV, AGREE, PREFIX, DISAGREE, LEFT, RIGHT, DLEFT, DRIGHT, CANCEL  } = require('../../config');
const { main, reddark } = require("../../JSON/colours.json");
const { server : s, serverFind } = require("../../functions/models");
const {paginationBig, missingArgument, error} = require("../../functions/functions");

module.exports = {
    config: {
      name: "help",
      aliases: ['h', 'хелп'],
      category: "b_info",
      examples: ["help battle"]
    },
    run: async function (bot, message, args, ops, tr) {
      const LANG = await serverFind(message.guild.id);
      const {timeOut, interError, ERROR, help: h, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`); 
      const cmd = require(`../../languages/${LANG.lang}`)  
   
      let prefix;
      let serverData = await serverFind(message.guild.id);
      if(!serverData) {
        let server = await s.create({
          serverID: message.guild.id,
        })
      server.save()}

      prefix = serverData.prefix;

      let aggr = 0;
      bot.commands.forEach(command => {
          if (!command.config.category || command.config.category === "owner") aggr += 1;
      });
      
      let catArray = ['RPG', 'roleplay', 'rpg', 'информация', 'инфо', 'info', 'экономика', 'economy', 'реакционные', 'реакция', 'reaction', 'фан', 'fun', 'настройки', 'settings', 'VIP', 'vip']
      const embed = new MessageEmbed()
          .setColor(main)
          .setAuthor(`${message.guild.me.displayName}`)
          .setThumbnail(bot.user.displayAvatarURL())
          .setDescription(`${h.t1} ${message.guild.me.displayName}\n${h.t2} \`${PREFIX}\`\n${h.t3} \`${prefix}\`\n${h.t4}\n\`${prefix}help [hero]\``)
          .setFooter(`${message.guild.me.displayName} | ${h.t5} ${bot.commands.size-aggr} `)
          .setImage("https://i.ibb.co/WswBXmj/Help-Backround.gif")
     
      const categoriesInEmbeds = {}; // categoryName: embed class
      const buttons = []; // class
      const validButtonIds = []; // string
      
      if (!args[0]) {
        const categories = readdirSync("./commands/")

        
        // test
        const map = categories.forEach((category) => {
          const embed = new MessageEmbed()
          .setColor(main)
          .setThumbnail(bot.user.displayAvatarURL())
          
          const dir = bot.commands.filter(c => c.config.category === category);
          const categoryMainName = category;
          
          if(category === "b_info") {category = {emoji:"📜", name: h.info}}
          else if (category === "e_fun") {
            category = {emoji: "😀", name: h.fun};
          }
          else if (category === "g_vip") {
            category = {emoji:"🌟", name: h.vip};
          }
          else if (category === "h_roleplay") {
            category = {emoji:"🐉", name: h.rpg};
          }
          else if (category === "f_settings") {
            category = {emoji:"⚙", name: h.settings};
          }
          else if (category === "cards") {
            category = {emoji:"💳", name: h.cards};
          }  
          if (category === "owner") return 
          const capitalise = category.name.slice(0, 1).toUpperCase() + category.name.slice(1);
          embed.setDescription(stripIndents`${category.emoji} **${capitalise}**\n${dir.map(c => `**[${LANG.prefix || "a!"}${c.config.name}](https://top.gg/bot/726784476377514045/vote)** - ${require(`../../languages/${LANG.lang}`)[c.config.name] && require(`../../languages/${LANG.lang}`)[c.config.name].desc || "—"}`).join("\n")}`);
        

          const button = new MessageButton()
          .setEmoji(category.emoji)
          .setCustomId(categoryMainName)
          .setLabel(category.name)
          .setStyle("SECONDARY")

          categoriesInEmbeds[categoryMainName] = embed;
          buttons.push(button);
          validButtonIds.push(categoryMainName)
        });

        const row1 = new MessageActionRow().addComponents(buttons.filter((button, index) => index <= 3));
        const row2 = new MessageActionRow().addComponents(buttons.filter((button, index) => index > 3));


        
        const mainMessage = await message.reply({embeds: [embed], components: [row1, row2]});
           
        const collector = await mainMessage.createMessageComponentCollector({
          filter: i => validButtonIds.includes(i.customId),
          time: 120000
        });

        collector.on("end", () => {
          error(message, timeOut);
          mainMessage.delete();
          return;
        });

        collector.on("collect", async i => {
          i.deferUpdate();
          collector.resetTimer();

          i.followUp({embeds: [categoriesInEmbeds[i.customId]], ephemeral: true})
        })









        
        } else {
            let command = bot.commands.get(bot.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase())
            if (!command) return await missingArgument(message, `${h.non}`, `${this.config.name} ${h.usage}`, this.config.examples)
            command = command.config
            
            let category = command.category;
            if(category === "b_info") {category = "📜 "+h.info}
            else if (category === "e_fun") {
              category = "😀 "+h.fun;
            }
            else if (category === "g_vip") {
              category = "🌟 "+h.vip;
            }
            else if (category === "h_roleplay") {
              category = "🐉 "+h.rpg;
            }
            else if (category === "f_settings") {
              category = "⚙ "+h.settings;
            }
            else if (category === "cards") {
              category = "💳 "+h.cards;
            }

            embed.setDescription(stripIndents`${h.t2} \`${PREFIX}\`
            ${h.t3} \`${prefix}\`\n
            ${h.cmd}  \`${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}\`
            ${h.Desc}  \`${cmd[command.name]["desc"]}\`
            ${h.cat} \`${category}\`
            ${h.Usage}  ${cmd[command.name].usage ? `\`${prefix}${command.name} ${cmd[command.name].usage}\`` : "`"+h.nousage+"`"}
            ${h.avail}  \`${cmd[command.name].access}\`
            ${h.aliases}  \`${command.aliases ? command.aliases.join(", ") : h.noaliases}\``)
            embed.setFooter(message.guild.name, message.guild.iconURL())

            return message.channel.send({embeds: [embed]})
        }
    }
};


