const { main } = require('../../JSON/colours.json');
const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment, MessageSelectMenu, Formatters } = require("discord.js");
const {STAR, AGREE, DISAGREE } = require("../../config");
const {error, embed, perms, firstUpperCase, makeTimestamp, delay, roundFunc, getMember, missingArgument} = require("../../functions/functions");
const {serverFind, rpgFind, addStar, bagFind, rpg, profileFind, profile, power, powerFind, powersFind, server: s } = require("../../functions/models");
const powers = require("../../JSON/powers.json");

const CooldownMap = new Map();

module.exports = {
    config: {
        name: "report",
        aliases: ['репорт'],
        category: 'b_info',
        examples: ['report channel #reports', "report @Dann#0006 Too much cool! lol"]
    },
    run: async function (bot, msg, args, ops, tr) {
        const user = msg.author;
        const member = msg.member;
        const server = msg.guild;

        const sd = await serverFind(server.id);

        const { report } = require(`../../languages/${sd.lang || "ru"}`);
        
        if (!args[0]) return await missingArgument(msg, await tr("Укажите действие!"), this.config.name + " " + report.usage, this.config.examples);

        const channelArgs = ["channel", "канал"];

        if ( channelArgs.includes(args[0].toLowerCase()) ) {
            if (!member.permissions.has("ADMINISTRATOR")) return error(msg, await tr("У вас недостаточно разрешений!"));
            if (!args[1]) return error(msg, await tr("Укажите текстовый канал канал!"));

            const channel = msg.mentions.channels.first() || server.channels.cache.get(args[1]);
            if (!channel || channel.type !== "GUILD_TEXT") return error(msg, await tr("Канал не найден!"))

            await s.updateOne({serverID: server.id}, {$set: {reportChannel: channel.id}}).then(msg.react(AGREE));
            
            return;
        }

        const cooldown = CooldownMap.get(member.id);
        if (cooldown) {
            if (cooldown > new Date()) {
                return error(msg, await tr("Попробуй снова") + ` ${Formatters.time(cooldown, "R")}.`);
            } else {
                CooldownMap.delete(member.id);
            }
        }

        const target = getMember(msg, args[0]);
        if (target.id === member.id || target.user.bot) return error(msg, await tr("Specify anoter member."));
        if ( !args[1] ) return error(msg, await tr('Укажите причину репорта!'));

        const reason = args.slice(1).join(" ");
        if (reason.length > 2000) return error(msg, await tr("Причина слишком большая!"));   

        const targetChannel = server.channels.cache.get(sd.reportChannel);

        if (!targetChannel) return error(msg, await tr("Канал для репорта не найден!"));

        const hasPermissionInChannel = targetChannel
        .permissionsFor(server.me)
        .has(['SEND_MESSAGES', "EMBED_LINKS"], false)

        if (!hasPermissionInChannel) return error(msg, await tr("У меня нет разрешений отправлять сообщение на канале:") + ` <#${targetChannel.id}>`);

        CooldownMap.set(member.id, new Date(Date.now() + 300000) );
        
        const embedToSend = new MessageEmbed()
        .setColor("RANDOM")
        .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
        .setTitle(`${await tr('To the member')}: ${target.user.tag}`)
        .setTimestamp()
        .setAuthor(`🔴 ${await tr("Новый Репорт!")}`)
        .setDescription(`${await tr("Причина")}:\n \`${reason}\``)
        
        await targetChannel.send({embeds: [embedToSend]});
        return msg.react(AGREE);
        
    }
};