
const {AGREE} = require('../../config');
const {MessageEmbed} = require("discord.js")
const {greenlight, redlight} = require('../../JSON/colours.json');
const serverModel = require("../../models/serverSchema");
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
    config: {
        name: "откл-мьют-роль",
        aliases: ['омр', 'dismuterole', 'dmr', 'dmrole'],
        category: 'f_settings',
        description: 'Отключить мьют роль сервера.',
        usage: '[название роли | упоминание роли | ID роли]',
        accessableby: 'Нужна права: Управлять ролями.'
    },
    run: async (bot, message, args) => {
      let limited = rateLimiter.take(message.author.id)
      if(limited) return

      if (!perms(message, "MANAGE_ROLES")) return error(message, "У вас недостаточно прав.");

        try {
            let sd = await serverModel.findOne({ serverID: message.guild.id });
            let a = sd.muteRole;

            if (!a) {
                return error(message, "Роль мьюта пока не установлена.");
            } else {
              let role = message.guild.roles.cache.get(a)
              let dmtsEmbed = new MessageEmbed()
              .setTimestamp()
              .setColor(greenlight)
              .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
              .setDescription(`${AGREE} **\`${role.name}\`** мьют роль успешно удалена`)

                await serverModel.findOneAndUpdate({serverID: message.guild.id},{$set: {muteRole: undefined}});

                message.channel.send({embeds: [dmtsEmbed]})
            }
            return;
        } catch {
          return error(message, "Ошибка: `Отсутствующие разрешения  или роль не существует.`")
        }
    }
}
