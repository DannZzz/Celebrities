const respGlob = ['global', 'g', 'глобал', 'г'];
const respServ = ["server", 's', 'сервер', 'с'];
const { main, none } = require("../../JSON/colours.json");
const { profile, profileFind, serverFind, bagFind } = require("../../functions/models");
const {error, embed, perms} = require("../../functions/functions");

module.exports = {
  config: {
    name: "shop",
    category: "b_info",
    aliases: ["store", 'магазин', 'шоп']
  },
  run: async (bot, message, args) => {

      const LANG = await serverFind(message.guild.id);
      const {shop, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, clanModel: cm, buttonYes, buttonNo, noStar} = require(`../../languages/${LANG.lang}`); 
      
    const pack = ["pack", "packs", "паки", "пак"]
    
    if (args[0] && pack.includes(args[0].toLowerCase())) return message.channel.send({embeds: [shop.items()]})

    return message.channel.send({embeds: [shop.shop()]})
   


  }
}
