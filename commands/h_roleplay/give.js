const heroes = require('../../JSON/heroes.json');
const { main, reddark } = require('../../JSON/colours.json');
const { MessageEmbed, MessageAttachment, MessageButton, MessageActionRow } = require("discord.js");
const { COIN, STAR, AGREE } = require("../../config");
const {error, embed, perms, firstUpperCase, randomRange, sendToMail} = require("../../functions/functions");
const {bagFind, rpgFind, rpg, addStar} = require("../../functions/models");

module.exports = {
  config: {
    name: "give",
    aliases: ['отдать'],
    category: 'h_roleplay',
    cooldown: 16
  },
  run: async (bot, message, args, ops) => {
    const msg = message
    const getLang = require("../../models/serverSchema");
    const LANG = await getLang.findOne({serverID: message.guild.id});
    const {give: g, notUser, specify, specifyT, specifyL, vipOne, vipTwo, maxLimit, perm, heroModel: hm, and, buttonNo, buttonYes, timeOut} = require(`../../languages/${LANG.lang}`);   
   
     
    const user = message.author;
       
    const bag = await bagFind(user.id);
    let mrp = await rpgFind(user.id);

    if (!mrp.item || mrp.heroes.length === 0) return error(msg, hm.noHero)
    if (!args[0]) return error(msg, g.specH + `\n\`${g.usage}\``);

    if (!args[1]) return error(msg, specify + `\n\`${g.usage}\``);
    if (!args[2] || isNaN(args[2]) || args[2] < 1) return error(msg, g.cost + `\n\`${g.usage}\``)
    if (args[2] < 100) return error(msg, g.min)
    const trans = firstUpperCase(args[0].toLowerCase());
    const member = msg.mentions.members.first() || msg.guild.members.cache.get(args[1]);
    if (!member) return error(msg, notUser);
    const memberRPG = await rpgFind(member.id);
    if ((memberRPG.itemCount || 0) === memberRPG.heroes.length) return error(msg, LANG.lang === "en" ? "This member hasn't enough place." : "Этот участник не имеет достаточно мест.");
    const cost = Math.round(args[2]);
    let getHero = mrp.heroes.find(x => x.name === trans);
    if (!getHero) return error(msg, g.noHero);
    const mbData = await rpgFind(member.id);
    const getting = mbData.heroes.find(x => x.name === trans)
    if (getting) return error(message, LANG.lang === "en" ? "This member already has this hero." : "Этот участник уже имеет этого героя.")
    const heroData = heroes[trans];
    if (heroData.costType !== "star" || heroData.subLevel) return error(msg, g.not);
    if (cost > heroData.cost * 2) return error(msg, g.double);

    let asd = true
    const button1 = new MessageButton()
      .setCustomId('disagreeToTrans')
      .setLabel(buttonNo)
      .setStyle('DANGER');

      const button2 = new MessageButton()
      .setCustomId('agreeToTrans')
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

      
      let bool = false;
      collector.on("collect", async (i) => {
        bool = true;
        collector.stop();
        if(i.customId === buttonList[0].customId) {
          i.deferUpdate();
          if (!curPage.deleted) {
            curPage.delete();
          };
          message.react(DISAGREE);
        } else if (i.customId === buttonList[1].customId) {
          i.deferUpdate();
          const a = randomRange(60, 180);
          curPage.delete();
          embed(message, LANG.lang === "en" ? `The deal will end after a while.` : "Сделка закончится через некоторое время.");

         setTimeout(async () => {
            mrp = await rpgFind(user.id);
            getHero = mrp.heroes.find(x => x.name === trans);
            if (!getHero) return;
            const rp = await rpgFind(member.id);
            const memberData = await bagFind(member.id);
            if (rp.heroes.length === rp.itemCount) return;
            const get = rp.heroes.find(x => x.name === trans)
            if (get) return;
            if (memberData.stars < cost) return;
            
            await addStar(member.id, -cost);
            await addStar(user.id, Math.floor(cost/100*80));
            
            rp.heroes.push(getHero)
            rp.save()
            if (rp.heroes.length === 0 || rp.heroes.length === 1) await rpg.updateOne({userID: member.id}, {$set: {item: getHero.name}});

            mrp.heroes.splice(mrp.heroes.indexOf(getHero), 1);
            await mrp.save();
            mrp = await rpg.findOne({userID: user.id});
            if (mrp.heroes.length === 0) {
              await rpg.updateOne({userID: user.id}, {$set: {item: undefined}});
            } else {
              await rpg.updateOne({userID: user.id}, {$set: {item: mrp.heroes[0]["name"]}});
            }
             
            await sendToMail(user.id, {textMessage: `${g.sell(trans, Math.floor(cost/100*80))} ${STAR}`, createdAt: new Date()});
        }, a * 1000)

          
        }
      })
      
      collector.on("end", () => {
        if (!bool) {
          curPage.delete();
          return error(msg, timeOut);
        }
      });
    
    
    
  }
}