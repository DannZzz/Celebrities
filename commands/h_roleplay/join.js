const heroes = require('../../JSON/heroes.json');
const enemies = require('../../JSON/enemies.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const clan = require("../../models/clanSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed } = require("discord.js");
const { COIN, STAR, CLAN } = require("../../config");
const {error, embed, perms, firstUpperCase} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);

module.exports = {
  config: {
    name: "вступить",
    aliases: ['join'],
    category: 'h_roleplay',
    description: "Подать заявку на вступление в клан.",
    usage: "(Номер клана)",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
    if(limited) return

    const data = await bd.findOne({userID: message.author.id})
    const user = message.author;
    const bag = await bd.findOne({userID: user.id})
    let rp = await rpg.findOne({userID: user.id});

    if (!rp) {
      let newData = await rpg.create({
        userID: user.id,
      })
      newData.save()
    }
    
    rp = await rpg.findOne({userID: user.id});
    
    let [a1] = args

    let getClan = await clan.findOne({ID: a1});
    if (!getClan) return error(message, "Клан не найден!");

    const members = await rpg.find({clanID: a1});
    if(rp.clanID !== null) return error(message, "Вы уже состоите в клане.");
    if (!getClan.appsStatus) return error(message, "Заявки на вступление в этот клан отключены!");
    if(getClan.space === members) return error(message, "В этом клане достаточно участников!");

    await getClan.apps.unshift({
      tag: message.author.tag,
      hero: rp.item || "Без героя",
      level: rp.level,
      id: message.author.id
    })
    getClan.save()

    return embed(message, "Вы успешно подали заявку, ждите ответа.");
    
    }
}