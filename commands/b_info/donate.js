const { main } = require("../../JSON/colours.json");
const { serverFind } = require("../../functions/models");

module.exports = {
  config: {
    name: "donate",
    category: "b_info",
    aliases: ['донат']
  },
  run: async (bot, message, args) => {
      const LANG = await serverFind(message.guild.id);
      const {donate, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`); 

      message.channel.send({embeds: [donate.donate().setImage("https://i.ibb.co/xCjXC10/donate.png")]})
  }
}
