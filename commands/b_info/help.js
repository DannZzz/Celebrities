const { MessageEmbed, MessageButton } = require("discord.js");
const { readdirSync } = require("fs");
const serverModel = require("../../models/serverSchema")
const { stripIndents } = require("common-tags");
const { cyan } = require("../../JSON/colours.json");
const { PREFIX, DISAGREE } = require('../../config');
const {pagination, firstUpperCase} = require("../../functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);

module.exports = {
    config: {
      name: "help",
      aliases: ['h'],
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

            embed.setDescription(`**${h.t1} ${message.guild.me.displayName}\n${h.t2} \`${PREFIX}\`\n${h.t3} \`${prefix}\`\n${h.t4}\n\`${prefix}help [hero]\`**`)
            embed.setFooter(`${message.guild.me.displayName} | ${h.t5} ${bot.commands.size-6} `, bot.user.displayAvatarURL());

            categories.forEach(category => {
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
              try {
                  embed.addField(`${capitalise} [${dir.size}]: `, dir.map(c => `\`${c.config.name}\``).join(" "))

              } catch (e) {
                  console.log(e)
              }
          })
            
          
            return message.channel.send({embeds: [embed]})
        }else if(catArray.includes(args[0]) && !args[1]) {
          
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
