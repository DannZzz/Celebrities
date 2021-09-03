const heroes = require('../../JSON/heroes.json');
const enemies = require('../../JSON/enemies.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const clan = require("../../models/clanSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { COIN, STAR, CLAN } = require("../../config");
const {error, embed, perms, firstUpperCase} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
const { update } = require('../../models/profileSchema');
let rateLimiter = new RateLimiter(1, 5000);
const {isWebUri} = require('valid-url');
const devs = ['382906068319076372'];

module.exports = {
  config: {
    name: "клан",
    aliases: ['clan'],
    category: 'h_roleplay',
    description: "Система кланов.",
    usage: "(help | хелп)",
    accessableby: "Для всех"
  },
  run: async (bot, message, args, ops) => {
    let limited = rateLimiter.take(message.author.id)
    if(limited) return

    const data = await bd.findOne({userID: message.author.id})
    const user = message.author;
    let bag = await bd.findOne({userID: user.id})
    let rp = await rpg.findOne({userID: user.id});

    if (!rp) {
      let newData = await rpg.create({
        userID: user.id,
      })
      newData.save()
    }
    
    rp = await rpg.findOne({userID: user.id});
    
    const helps = ['help', 'хелп'];
    const creates = ["создать", 'create'];
    const kicks = ["kick", 'выгнать'];
    const apps = ['заявки', 'apps'];
    const accept = ['принять', 'accept'];
    const reject = ['отклонить', 'reject'];
    const upgrade = ['улучшить', 'upgrade'];
    const logo = ['логотип', 'лого', 'logo'];
    const description = ['описание', 'description', 'desc'];
    const del = ['удалить', 'delete'];
    const reward = ['награда', 'reward'];
    const leave = ['выйти', 'leave'];
    const up = ['повысить', 'up'];
    const down = ['понизить', 'down'];
    
    if (!args[0]) {
      const mc = await clan.findOne({ID: rp.clanID});
      if (!mc) return error(message, "Вы не состоите в клане.");

      let a = await rpg.find({clanID: rp.clanID}).exec()
      let b = await Promise.all(a.map(async(docs, p = 0)=> {
        const rpp = await rpg.findOne({userID: docs.userID})
        return `__${p+1}.__ ${message.guild.members.cache.get(docs.userID) ? `${message.guild.members.cache.get(docs.userID)} ${docs.userID === mc.owner ? "   <:danncrown:880492405390979132>" : ""} ${mc.staff.includes(docs.userID) ? "   <:dannstaff:881110710057332766>" : ""} ${devs.includes(docs.userID) ? "  __Dev__" : ""}` : `${bot.users.cache.get(docs.userID).tag} ${docs.userID === mc.owner ? "   <:danncrown:880492405390979132>" : ""}`} ${rpp && rpp.item ? `\n**Герой:** ${rpp.item} | **Уровень:** ${rpp.level}` : '\nНет героя'}`
       }))
      
      
      let myClan = new MessageEmbed()
      .setColor(cyan)
      .setTitle(`📊 __#${mc.ID}__ — ${mc.name}`)
      .setDescription(`👑 Лидер: ${message.guild.members.cache.get(mc.owner) ? message.guild.members.cache.get(mc.owner) : bot.users.cache.get(mc.owner).tag}\n📈 Уровень клана: __${mc.level}__\n💰 Бюджет: __${mc.budget}__ ${CLAN}${mc.description !== null ? "\n\n" + mc.description : ''}`)
      .addField(`Участники - ${a.length } / ${mc.space}`, `${b.length !== 0 ? b.join("\n") : "Тут никого нет."}`)
      
      if (mc.logo !== null) {
        if (!isWebUri(mc.logo)) {
          myClan.setThumbnail("https://pbs.twimg.com/profile_images/1063925348205821958/DlGcxdOl_400x400.jpg")
        }else {
          myClan.setThumbnail(mc.logo)
        }
      }
      return message.channel.send({embeds: [myClan]})
    }

    const resp = args[0].toLowerCase()

    if (!isNaN(resp)) {
      const mc = await clan.findOne({ID: rp.clanID});
      if (!mc) return error(message, "Вы не состоите в клане.");

      let value = Math.round(resp);
      const msg = await message.channel.send(`<a:dannloading:876008681479749662> Перевожу...`)
      let a = Math.round(Math.random() * 6) + 1
      return setTimeout(async () => {
        msg.delete()
        bag = await bd.findOne({userID: user.id})
        if (bag.stars < value) return error(message, "У вас недостаточно звёзд.");
        if (10 > value) return error(message, `Минимальная сумма — __10__ ${STAR}.`);
        value = Math.floor(value / 2)
        await bd.updateOne({userID: user.id}, {$inc: {stars: -value}});
        await clan.updateOne({ID: rp.clanID}, {$inc: {budget: value}});
        return embed(message, `Вы успешно передали своему клану __${value}__ ${CLAN}`);
      }, a * 1000)
     
    }
    
    if (helps.includes(resp)) {
      const helpEmb = new MessageEmbed()
      .setColor(cyan)
      .setTimestamp()
      .setTitle("Все доступные функции!")
      .setDescription(`
      \`клан (число)\` — Скинуть звёзды в бюджет клана. ( __2 ${STAR}__ = __1 ${CLAN}__ )
      \`клан создать [название]\` — Создать свой клан (цена 5000 ${STAR})
      \`клан выгнать [номер участника]\` — Выгнать участника из клана.
      \`клан повысить [номер участника]\` — Повысить участника.
      \`клан понизить [номер участника]\` — Понизить участника.
      \`клан заявки\` — Посмотреть заявки клана.
      \`клан заявки очистить\` — Удалить все заявки.
      \`клан заявки включить\` — Включить заявки для вступлении в клан.
      \`клан заявки отключить\` — Отключить заявки для вступлении в клан.
      \`клан отклонить [номер заявки]\` — Отклонить заявку участника.
      \`клан принять [номер заявки]\` — Принять участника в клан.
      \`клан улучшить (инфо)\` — Улучшить клан.
      \`клан описание [текст]\` — Описание для клана.
      \`клан логотип [ссылка на лого]\` — Логотип для клана.
      \`клан награда\` — Получить ежедневные звёзды.
      \`клан выйти\` — Выйти из клана.
      \`клан удалить\` — Удалить клан.
      `)

      return message.channel.send({embeds: [helpEmb]});
    } else if (creates.includes(resp)) {
      const msg = await message.channel.send(`<a:dannloading:876008681479749662> Выполняю запрос...`)
      let a = Math.round(Math.random() * 6) + 1
      //const clanData = await clan.findOne({owner: user.id})
      setTimeout(async () => {
        msg.delete()
        if (rp.clanID !== null) return error(message, "Вы уже состоите в клане.");

        if (bag.stars < 5000) return error(message, "У вас недостаточно звёзд.");
        
        if (!args[1]) return error(message, "Укажите название клана.");
        let getLimit = args.slice(1).join(" ").split("")
        if(getLimit.length > 20) return error(message, "Название клана не может быть больше 20-и символов.")
        const nameOfClan = firstUpperCase(args.slice(1).join(" "), " ");
        let ID = 1
        let bool = true
        while (bool) {
          let get = await clan.findOne({ID: ID});

          if(get) {
            ID += 1
            continue;
          } else {
            break;
          }
        }

        let newClan = await clan.create({
          owner: user.id,
          ID: ID,
          name: nameOfClan
        });
        newClan.save()
        await rpg.updateOne({userID: message.author.id}, {$set: {clanID: ID}})
        await bd.updateOne({userID: user.id}, {$inc: {stars: -5000}})
        return embed(message, 'Вы успешно создали свой клан!')
      }, a * 1000)
      
    } else if (kicks.includes(resp)) {
      if (rp.clanID === null) return error(message, "Вы не состоите в клане.");
      let getCl = await clan.findOne({ID: rp.clanID});
      if(message.author.id !== getCl.owner) return error(message, "Вы не лидер клана.");
      if (!args[1] || isNaN(args[1])) return error(message, 'Укажите номер участника.');
      let a = await rpg.find({clanID: rp.clanID}).map(b => b);

      if(Math.round(args[1]) > a.length || Math.round(args[1]) <= 0) return error(message, 'Участник клана не найден!')

      let getIndex = Math.round(args[1]) - 1;

      if(a[getIndex]["userID"] === message.author.id) return error(message, 'Вы — лидер клана, не можете выгнать себя.');
      if (getCl.staff.includes(a[getIndex]["userID"])) return error(message, "Невозможно выгнать сотрудника.");
      
      await rpg.updateOne({userID: a[getIndex]["userID"]}, {$set: {clanID: null}});

      return embed(message, `Вы успешно выгнали участника __${bot.users.cache.get(a[getIndex]["userID"]).tag}__.`)
    } else if (apps.includes(resp)) {
      
      const c = await clan.findOne({ID: rp.clanID});
      if (rp.clanID === null) return error(message, "Вы не состоите в клане.");
      if (message.author.id !== c.owner && !c.staff.includes(user.id)) return error(message, 'У вас недостаточно прав!');
      if (user.id == c.owner && args[1]) {
        if (args[1] && (args[1] === "включить" || args[1] === 'on') && user.id === c.owner) {
        if (c.appsStatus) return error(message, "Заявки и так включены!");

        await clan.updateOne({ID: c.ID}, {$set: {appsStatus: true}});

        return embed(message, "Заявки успешно включены.");
      } else if (args[1] && (args[1] === "отключить" || args[1] === 'off') && user.id === c.owner) {
        if (!c.appsStatus) return error(message, "Заявки и так отключены!");

        await clan.updateOne({ID: c.ID}, {$set: {appsStatus: false}});

        return embed(message, "Заявки успешно отключены.");
      } else if (args[1] === 'очистить' || args[1] === 'clear') {
        if(c.apps.length === 0) return error(message, "Нет заявок.");

        await clan.updateOne({ID: c.ID}, {$set: {apps: []}});
        
        return embed(message, "Все заявки успешно отклонены.");
      }

      } else if (args[1]){
        return error(message, "Вы не лидер клана, либо что-то указали неверно")
      }
       
      
      if(c.apps.length === 0) return error(message, "Нет заявок.");
      
      const arr = c.apps.map(({tag, hero, level}, p=0) => `\`${p+1}.\` Участник: __${tag}__\nГерой: __${hero}__\nУровень: __${level}__`)

      const emb = new MessageEmbed()
      .setColor(cyan)
      .setTimestamp()
      .setAuthor(`Все заявки!`)
      .setDescription(arr.join("\n\n"))

      return message.channel.send({embeds: [emb]});
    } else if (reject.includes(resp)) {
      const c = await clan.findOne({ID: rp.clanID});
      if (rp.clanID === null) return error(message, "Вы не состоите в клане.");
      if (message.author.id !== c.owner  && !c.staff.includes(user.id)) return error(message, 'У вас недостаточно прав!');
      if(c.apps.length === 0) return error(message, "Нет заявок!");
      if(!args[1] || isNaN(args[1])) return error(message, "Укажите номер заявки");

      let index = Math.round(args[1]) - 1;
      
      if(Math.round(args[1]) > c.apps.length || Math.round(args[1]) < 0) return error(message, "Заявка не найдена!");

      await c.apps.splice(index);
      c.save()

      return embed(message, "Заявка успешно отклонена.");
    } else if (accept.includes(resp)) {
      const msg = await message.channel.send(`<a:dannloading:876008681479749662> Принимаем...`)
      let a = Math.round(Math.random() * 6) + 1
      //const clanData = await clan.findOne({owner: user.id})
      setTimeout(async () => {
        msg.delete()
        const c = await clan.findOne({ID: rp.clanID});
        if (rp.clanID === null) return error(message, "Вы не состоите в клане.");
        if (message.author.id !== c.owner && !c.staff.includes(user.id)) return error(message, 'У вас недостаточно прав!');
        const members = await rpg.find({clanID: c.ID});
        if(c.space === members) return error(message, "В вашем клане достаточно участников, улучшайте уровень клана.");
        if(c.apps.length === 0) return error(message, "Нет заявок!");
        if(!args[1] || isNaN(args[1])) return error(message, "Укажите номер заявки");

        let index = Math.round(args[1]) - 1;
        
        if(Math.round(args[1]) > c.apps.length || Math.round(args[1]) < 0) return error(message, "Заявка не найдена!");
        const getuser = await rpg.findOne({userID: c.apps[index]["id"]});
        if (getuser.clanID !== null) return error(message, "Этот участник уже состоит в другом клане.")
        await rpg.updateOne({userID: c.apps[index]["id"]}, {$set: {clanID: c.ID}});

        await c.apps.splice(index, 1);
        c.save()

        
        return embed(message, "Заявка успешно принята.");
      }, a * 1000);
    } else if (upgrade.includes(resp)) {
      const c = await clan.findOne({ID: rp.clanID});
      if (rp.clanID === null) return error(message, "Вы не состоите в клане.");
      if (user.id !== c.owner) return error(message, 'Вы не лидер клана!');

      let up = 3000;
      let cost = c.level * up;
      if (c.level === 10) return error(message, "Ваш клан максимально улучшен!")
      if (args[1] && (args[1] === "info" || args[1] === 'инфо')) {
        const emb = new MessageEmbed()
        .setColor(cyan)
        .setTimestamp()
        .setAuthor('Информация об улучшении клана.')
        .setDescription(`Цена — __${cost}__ ${CLAN}\nЧисло максимальных участников: __${c.space}__ + __5__\n${(c.level+1) === 5 ? 'Будут доступны описание и логотип клана!' : ''}`)

        return message.channel.send({embeds: [emb]})
      }
      let a = Math.round(Math.random() * 6) + 1
      if (c.level === 5 && !bag["vip1"]) return error(message, "Вы должны иметь как минимум __VIP 1__ чтобы улучшить клан.")
      const msg = await message.channel.send(`<a:dannloading:876008681479749662> Улучшаю...`)

      setTimeout(async () => {
        msg.delete()
        if (c.budget < cost) return error(message, "Недостаточно рубинов!")
        
        await clan.updateOne({ID: c.ID}, {$inc: {budget: -cost}});
        await clan.updateOne({ID: c.ID}, {$inc: {level: 1}});
        await clan.updateOne({ID: c.ID}, {$inc: {space: 5}});

        return embed(message, `Уровень клана успешно улучшен до __${c.level+1}__.`);

      }, a * 1000)
    } else if (description.includes(resp)) {
      const c = await clan.findOne({ID: rp.clanID});
      if (rp.clanID === null) return error(message, "Вы не состоите в клане.");
      if (user.id !== c.owner) return error(message, 'Вы не лидер клана!');
      if (!args[1]) return error(message, "Укажите описание.")
      if (c.level < 5) return error(message, 'Эта функция доступна для кланов с уровнем 5 или выше.')
      let getLimit = args.slice(1).join(" ").split("")
      if(getLimit.length > 400) return error(message, "Описание клана не может быть больше 400 символов.")
      const descriptionText = args.slice(1).join(" ");
      await clan.updateOne({ID: c.ID}, {$set: {description: descriptionText}});

      return embed(message, "Описание клана успешно установлено.");
    } else if (logo.includes(resp)) {
      const c = await clan.findOne({ID: rp.clanID});
      if (rp.clanID === null) return error(message, "Вы не состоите в клане.");
      if (user.id !== c.owner) return error(message, 'Вы не лидер клана!');
      if (!args[1]) return error(message, "Укажите ссылку на логотип.")
      if (c.level < 5) return error(message, 'Эта функция доступна для кланов с уровнем 5 или выше.')
      if(!isWebUri(args.slice(1).join(""))) return error(message, "Укажите рабочую ссылку!")
      await clan.updateOne({ID: c.ID}, {$set: {logo: args.slice(1).join("")}});

      return embed(message, "Логотип клана успешно установлен.");
    } else if (del.includes(resp)) {
      const now = ops.queue.get(user.id);
      if (now) return
      const c = await clan.findOne({ID: rp.clanID});
      if (rp.clanID === null) return error(message, "Вы не состоите в клане.");
      if (user.id !== c.owner) return error(message, 'Вы не лидер клана!');

      const button1 = new MessageButton()
            .setCustomId('previousbtn')
            .setLabel('Отменить')
            .setStyle('DANGER');

            const button2 = new MessageButton()
            .setCustomId('nextbtn')
            .setLabel('Удалить')
            .setStyle('SUCCESS');

      let buttonList = [
          button1,
          button2
      ]

      const Emb = new MessageEmbed()
      .setColor(cyan)
      .setTimestamp()
      .setAuthor(user.username, user.displayAvatarURL({dynamic: true}))
      .setTitle('Вы уверены, что хотите удалить клан?')
      
      ops.queue.set(user.id, {name: "deleting"})
      
      const row = new MessageActionRow().addComponents(buttonList);
      const curPage = await message.reply({
        embeds: [Emb],
        components: [row],
      })
      
      const filter = (i) =>
      (i.customId === buttonList[0].customId ||
      i.customId === buttonList[1].customId) &&
      i.user.id === user.id;

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
            curPage.edit({
              embeds: [Emb.setTitle('Дейстие успешно отклонено.')],
              components: [disabledRow],
            });
          }
          ops.queue.delete(user.id)
          collector.stop()
        } else if (i.customId === buttonList[1].customId) {
          await i.deferUpdate()
          await rpg.updateMany({clanID: c.ID}, {$set: {clanID: null}})
          await c.delete()
          const disabledRow = new MessageActionRow().addComponents(
            buttonList[0].setDisabled(true),
            buttonList[1].setDisabled(true)
          );
          curPage.edit({
            embeds: [Emb.setTitle('Вы успешно удалили свой клан.')],
            components: [disabledRow],
          });//
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
      
      
    } else if (reward.includes(resp)) {
      const c = await clan.findOne({ID: rp.clanID});
      if (rp.clanID === null) return error(message, "Вы не состоите в клане.");
      if (user.id !== c.owner && !c.staff.includes(user.id)) return error(message, 'У вас недостаточно прав!');
      
      let author = await c.reward;
      let timeout;
      if (bag["vip2"] === true) { timeout = 43200 * 1000; } else {
        timeout = 86400 * 1000;
      }
      if (author !== null && timeout - (Date.now() - author) > 0) {
          let time = new Date(timeout - (Date.now() - author));
  
          return error(message, `Попробуй еще раз через **${time.getUTCHours()} часа(-ов) ${time.getMinutes()} минут**.`);
      }

      let rew = c.level * 30

      const users = await rpg.find({clanID: c.ID}).exec()
      await clan.updateOne({ID: c.ID}, {$set: {reward: Date.now()}})
      await users.forEach(async asd => await bd.updateOne({userID: asd.userID}, {$inc: {stars: rew}}))
      
      return embed(message, `Все участники клана получили по — __${rew}__ ${STAR}`)
    } else if (leave.includes(resp)) {
      const now = ops.queue.get(user.id);
      if (now) return
      const c = await clan.findOne({ID: rp.clanID});
      if (rp.clanID === null) return error(message, "Вы не состоите в клане.");
      if (user.id === c.owner) return error(message, "Лидер клана не может выйти.");

      const button1 = new MessageButton()
      .setCustomId('previousbtn')
      .setLabel('Отменить')
      .setStyle('DANGER');

      const button2 = new MessageButton()
      .setCustomId('nextbtn')
      .setLabel('Выйти')
      .setStyle('SUCCESS');

      let buttonList = [
          button1,
          button2
      ]

      const Emb = new MessageEmbed()
      .setColor(cyan)
      .setTimestamp()
      .setAuthor(user.username, user.displayAvatarURL({dynamic: true}))
      .setTitle('Вы уверены, что хотите удалить клан?')

      ops.queue.set(user.id, {name: "deleting"})

      const row = new MessageActionRow().addComponents(buttonList);
      const curPage = await message.reply({
        embeds: [Emb],
        components: [row],
      })

      const filter = (i) =>
      (i.customId === buttonList[0].customId ||
      i.customId === buttonList[1].customId) &&
      i.user.id === user.id;

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
            curPage.edit({
              embeds: [Emb.setTitle('Дейстие успешно отклонено.')],
              components: [disabledRow],
            });
          }
          ops.queue.delete(user.id)
          collector.stop()
        } else if (i.customId === buttonList[1].customId) {
          await i.deferUpdate()
          await rpg.updateOne({userID: user.id}, {$set: {clanID: null}});
          const disabledRow = new MessageActionRow().addComponents(
            buttonList[0].setDisabled(true),
            buttonList[1].setDisabled(true)
          );
          
          if (c.staff.includes(user.id)) {
            await c.staff.splice(c.staff.indexOf(user.id), 1);
            c.save()
          }
          
          curPage.edit({
            embeds: [Emb.setTitle('Вы успешно вышли из клана.')],
            components: [disabledRow],
          });//
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
      
    } else if (up.includes(resp)) {
      const c = await clan.findOne({ID: rp.clanID});
      if (rp.clanID === null) return error(message, "Вы не состоите в клане.");
      if (user.id !== c.owner) return error(message, 'Вы не лидер клана!');
      const a = await rpg.find({clanID: c.ID}).exec()
      const a1 = args[1];
      
      if (!a1 || isNaN(a1)) return error(message, "Укажите номер участника.");
      if (a1 > a.length || Math.round(a1) <= 0) return error(message, "Участник не найден.")
      const i = a1 - 1;
      
      const memb = a[i]["userID"];
      if(memb === c.owner) return error(message, 'Вы — лидер клана, не можете повысить себя.');
      
      if(c.staff.includes(memb)) return error(message, "Этого участника вы уже повысили.");
      const count = c.space / 5;
      if (count === c.staff.length) return error(message, "Вы уже имеете достаточно сотрудников.");

      await c.staff.push(memb);
      c.save()

      return embed(message, 'Вы успешно повысили участника.')
      
    } else if (down.includes(resp)) {
      const c = await clan.findOne({ID: rp.clanID});
      if (rp.clanID === null) return error(message, "Вы не состоите в клане.");
      if (user.id !== c.owner) return error(message, 'Вы не лидер клана!');

      const a = await rpg.find({clanID: c.ID}).exec()
      const a1 = args[1];
      
      if (!a1 || isNaN(a1)) return error(message, "Укажите номер участника.");
      if (a1 > a.length || Math.round(a1) <= 0) return error(message, "Участник не найден.")
      const i = a1 - 1;
      
      const memb = a[i]["userID"];
      if(memb === c.owner) return error(message, 'Вы — лидер клана, не можете понизить себя.');
      
      if(!c.staff.includes(memb)) return error(message, "Невозможно понизить этого участника.");
      
      await c.staff.splice(c.staff.indexOf(memb), 1);
      c.save()

      return embed(message, 'Вы успешно понизить участника.')
    } else {
      return error(message, "Укажите действие. (\`?клан хелп\`)");
    }
    

  }
};
