const {progressBar} = require("../../functions.js")
const {error, embed} = require('../../functions');

module.exports = {
    config: {
        name: "ship",
        aliases: ['love'],
        category: 'e_fun',
    },
    run: async (bot, message, args) => {

      const getLang = require("../../models/serverSchema");
      const LANG = await getLang.findOne({serverID: message.guild.id});
      const {ship: s, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`);   
   
      let rand = Math.floor(Math.random() * 100)
      if (!args[0]) return error(message, s.error)
      let user = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase());

      if(!user) {
        user = args.join(" ")
        return embed(message, `**${s.done1} _${user}._**\n${progressBar(rand, 100, 10)}`, false);
      }
      return embed(message, `**${s.done2} ${message.member} ${and} ${user}**\n${progressBar(rand, 100, 10)}`, false);


    }
}
