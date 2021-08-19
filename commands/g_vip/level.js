const begModel = require("../../models/begSchema");
const serverModel = require("../../models/serverSchema");
const {error, embed, perms} = require('../../functions');
const {MONGO} = require('../../config');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);
const Levels = require("discord-xp");
Levels.setURL(MONGO)

module.exports = {
  config: {
    name: "уровни",
    description: "Включить/отключить систему уровней.",
    category: "g_vip",
    aliases: ["levels"],
    accessableby: "Нужна права: Администратор.",
    usage: "[отключить || off || включить || on]"
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return
       
    let bag = await begModel.findOne({userID: message.author.id});
    let sd = await serverModel.findOne({serverID: message.guild.id});

    if(bag['vip1'] === false) return error(message, "Эта команда доступна только для **VIP 1** пользователей.");
    if (!perms(message, "ADMINISTRATOR")) return error(message, "У вас недостаточно прав.");
    if(!args[0]) return error(message, "Укажите действие.\nПример: \`\`?уровни отключить\`\`");
    if (args[0] === "отключить" || args[0] === 'off') {
      if(sd.rank) {
        Levels.deleteGuild(message.guild.id);
        await serverModel.findOneAndUpdate({serverID: message.guild.id}, {$set: {rank: false}})
        embed(message, 'Система уровней успешно сброшена и отключена.');
      } else {
      return error(message, "Система уровней и так отключена.");
      }
    } else if (args[0] === "включить" || args[0] === 'on') {
      if(!sd.rank || sd.rank === null) {
        await serverModel.findOneAndUpdate({serverID: message.guild.id}, {$set: {rank: true}})
        embed(message, 'Система уровней успешно включена.');
      } else {
      return error(message, "Система уровней и так включена.");
      }
    } else  {
      return error(message, "Действие не найдено.");
    }

  }
}
