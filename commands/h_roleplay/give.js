const heroes = require('../../JSON/heroes.json');
const enemies = require('../../JSON/enemies.json');
const { main } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed, MessageAttachment, MessageButton, MessageActionRow } = require("discord.js");
const { COIN, STAR, AGREE } = require("../../config");
const { checkValue } = require("../../functions/functions");
const mc = require('discordjs-mongodb-currency');
const {error, embed, perms, firstUpperCase} = require("../../functions/functions");
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 3000);
const Canvas = require("canvas")
const items = require('../../JSON/items');

module.exports = {
  config: {
    name: "give",
    aliases: ['отдать'],
    category: 'h_roleplay'
  },
  run: async (bot, message, args, ops) => {
    const msg = message
    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {give: g, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, buttonNo, buttonYes} = require(`../../languages/${LANG.lang}`);   
   
    let limited = rateLimiter.take(message.author.id)
    if(limited) return 
    const user = message.author
    const now = ops.queue.get(user.id);
    if (now) return
       
    const bag = await bd.findOne({ userID: user.id });
    let mrp = await rpg.findOne({ userID: user.id });
    const profileData = await pd.findOne({ userID: user.id });

    if (!mrp.item || mrp.heroes.length === 0) return error(msg, hm.noHero)
    if (!args[0]) return error(msg, g.specH);

    if (!args[1]) return error(msg, specify);
    if (!args[2] || isNaN(args[2]) || args[2] < 1) return error(msg, g.cost)
    if (args[2] < 100) return error(msg, g.min)
    const trans = firstUpperCase(args[0].toLowerCase());
    const member = msg.mentions.members.first() || msg.guild.members.cache.get(args[1]);
    if (!member) return error(msg, notUser);
    const cost = Math.round(args[2]);
    let getHero = mrp.heroes.find(x => x.name === trans);
    if (!getHero) return error(msg, g.noHero);
    const heroData = heroes[trans];
    if (heroData.costType !== "star") return error(msg, g.not);
    if (cost > heroData.cost * 2) return error(msg, g.double);

    let asd = true
    const button1 = new MessageButton()
      .setCustomId('previousbtn')
      .setLabel(buttonNo)
      .setStyle('DANGER');

      const button2 = new MessageButton()
      .setCustomId('nextbtn')
      .setLabel(buttonYes)
      .setStyle('SUCCESS');

      let buttonList = [
          button1,
          button2
      ]

      const Emb = new MessageEmbed()
      .setColor(main)
      .setAuthor(user.username, user.displayAvatarURL({dynamic: true}))
      .setDescription(`${member}, ${msg.guild.members.cache.get(user.id)} ${g.sure(trans, cost)} ${STAR}`)

      ops.queue.set(user.id, {name: "deleting"})

      const row = new MessageActionRow().addComponents(buttonList);
      const curPage = await message.reply({
        embeds: [Emb],
        components: [row],
      })

      const filter = (i) =>
      (i.customId === buttonList[0].customId ||
      i.customId === buttonList[1].customId) &&
      i.user.id === member.id;

      const collector = await curPage.createMessageComponentCollector({
      filter,
      time: 15000,
      });

      
      
      collector.on("collect", async (i) => {
        if(i.customId === buttonList[0].customId) {
          await i.deferUpdate()
          if (!curPage.deleted) {
            const disabledRow = new MessageActionRow().addComponents(
              buttonList[0].setDisabled(true),
              buttonList[1].setDisabled(true)
            );
            curPage.delete()
          }
          ops.queue.delete(user.id)
          collector.stop()
        } else if (i.customId === buttonList[1].customId) {
          await i.deferUpdate()
          const a = Math.ceil(Math.random() * 6)
          curPage.delete()
        let damn = await message.channel.send(`<a:dannloading:876008681479749662> ${g.find}`);

         await setTimeout(async () => {
           damn.delete()
            mrp = await rpg.findOne({ userID: user.id });
            getHero = mrp.heroes.find(x => x.name === trans);
            if (!getHero) return error(msg, g.noHero);
            const rp = await rpg.findOne({userID: member.id});
            const memberData = await bd.findOne({userID: member.id});
            if (rp.heroes.length === rp.itemCount) return error(msg, g.place);
            const get = rp.heroes.find(x => x.name === trans)
            if (get) return error(msg, g.already);
            if (memberData.stars < cost) return error(msg, g.star);
            
            rp.heroes.push(getHero)
            rp.save()
            if (rp.heroes.length === 0) await rpg.updateOne({userID: member.id}, {$set: {item: getHero.name}});

            await bd.updateOne({userID: member.id}, {$inc: {stars: -cost}});
            await bd.updateOne({userID: user.id}, {$inc: {stars: Math.floor(cost/100*80)}});

            mrp.heroes.splice(mrp.heroes.indexOf(getHero), 1)
            mrp.save()
            mrp = await rpg.findOne({userID: user.id});
            if (mrp.heroes.length === 0) {
              await rpg.updateOne({userID: user.id}, {$set: {item: undefined}});
            } else {
              await rpg.updateOne({userID: user.id}, {$set: {item: mrp.heroes[0].name}});
            }
             
            message.channel.send(`${g.sell(trans, Math.floor(cost/100*80))} ${STAR}`)
        }, a * 1000)

          ops.queue.delete(user.id)
          collector.stop()
        }
      })
      
      collector.on("end", () => {
        if (!curPage.deleted) {
          const disabledRow = new MessageActionRow().addComponents(
            buttonList[0].setDisabled(true),
            buttonList[1].setDisabled(true)
          );
          curPage.edit({
            components: [disabledRow],
          });
        }
        ops.queue.delete(user.id)
      });
    
    
    
  }
}