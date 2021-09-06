const heroes = require('../../JSON/heroes.json');
const { cyan } = require('../../JSON/colours.json');
const pd = require("../../models/profileSchema");
const bd = require("../../models/begSchema");
const rpg = require("../../models/rpgSchema");
const { MessageEmbed, MessageAttachment, MessageActionRow, MessageButton } = require("discord.js");
const { COIN } = require("../../config");
const { checkValue } = require("../../functions");
const mc = require('discordjs-mongodb-currency');
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);
const Canvas = require('canvas');

module.exports = {
  config: {
    name: "бой",
    aliases: ['fight'],
    category: 'h_roleplay',
    description: "Пойти в поединок с участником.",
    usage: "[тег | никнейм | упоминание | ID] <ставка>",
    accessableby: "Для всех"
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
      if(limited) return
       
    const bag = await bd.findOne({ userID: message.author.id });
    const profileData = await pd.findOne({ userID: message.author.id });

    let author = profileData.rpg;
    let timeout;
    if (bag["vip2"] === true) { timeout = 70 * 1000; } else {
      timeout = 140 * 1000;
    }
    if (author !== null && timeout - (Date.now() - author) > 0) {
        let time = new Date(timeout - (Date.now() - author));

        return error(message, `Попробуй еще раз через **${time.getMinutes()} минут ${time.getSeconds()} секунд.**.`);
    }
    if (!args[0]) return error(message, 'Укажите участника.');
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLocaleLowerCase());
    if(!user) return error(message, 'Участник не найден.');
    if(user.user.bot) return error(message, 'Поединок с ботом...хм');
    const mUser = message.author;
    if(user.id === mUser.id) return error(message, 'Вы не можете начать бой с собой.');

    if(!args[1] || isNaN(args[1])) return error(message, 'Укажите ставку.');
    let value = Math.floor(args[1])
    let data11 = await mc.findUser(user.id, message.guild.id)
    let data22 = await mc.findUser(mUser.id, message.guild.id)

    let bal = data11.coinsInWallet
    let mBal = data22.coinsInWallet
    if (value < 10000) return error(message, `Минимальная ставка **10000**.`);

    if (!bag["vip1"] && value > 100000) {
      return error(message, "Максимальная ставка **100.000**!\nЛибо купите VIP");
    } else if (!bag["vip2"] && value > 1000000) {
      return error(message, "Максимальная ставка **1.000.000**!\nЛибо купите VIP 2");
    }

    if(value > mBal) return error(message, `У вас недостаточно денег.`);
    if(value > bal) return error(message, `${user} не имеет столько денег.`);

    const rp = await rpg.findOne({userID: user.id});
    const mrp = await rpg.findOne({userID: mUser.id});

    if (!mrp || mrp.item === null) return error(message, 'Вы не имеете героя.');
    if (!rp || rp.item === null) return error(message, 'Участник не имеет героя.');

    let h1 = rp.health
    let h2 = mrp.health
    let d1 = rp.damage
    let d2 = mrp.damage
    let winner;
    let loser;

    const item = rp.item
    const mItem = mrp.item

   
    await mc.deductCoins(user.id, message.guild.id, value)
    await mc.deductCoins(mUser.id, message.guild.id, value)

    const data1 = heroes[mItem];
    const data2 = heroes[item];
    
   
      
    const button1 = new MessageButton()
    .setCustomId('previousbtn')
    .setLabel('Отклонить')
    .setStyle('DANGER');

    const button2 = new MessageButton()
    .setCustomId('nextbtn')
    .setLabel('Принять')
    .setStyle('SUCCESS');

let buttonList = [
  button1,
  button2
]

const Emb = new MessageEmbed()
.setColor(cyan)
.setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
.setDescription(`<@${user.user.id}> у вас 20 секунд, чтобы принять вызов.\nСтавка: __${value}__ ${COIN}\n\nПринять: \`+\`\nОтклонить: \`-\``)


const row = new MessageActionRow().addComponents(buttonList);
const wait = await message.channel.send({
embeds: [Emb],
components: [row],
})

const filter = (i) =>
(i.customId === buttonList[0].customId ||
i.customId === buttonList[1].customId) &&
i.user.id === mUser.id;

const collector = await wait.createMessageComponentCollector({
filter,
time: 15000,
});


collector.on("collect", async (i) => {
if(i.customId === buttonList[0].customId) {
  await i.deferUpdate()
  if (!wait.deleted) {
    const disabledRow = new MessageActionRow().addComponents(
      buttonList[0].setDisabled(true),
      buttonList[1].setDisabled(true)
    );
    wait.edit({components: [disabledRow]})
    await mc.giveCoins(user.id, message.guild.id, value)
    await mc.giveCoins(mUser.id, message.guild.id, value)
    return error(message, `${user} отказался.`)
  }
  collector.stop()
} else if (i.customId === buttonList[1].customId) {
    await i.deferUpdate()
    const disabledRow = new MessageActionRow().addComponents(
      buttonList[0].setDisabled(true),
      buttonList[1].setDisabled(true)
    );
    wait.edit({components: [disabledRow]})
    let damn = await message.channel.send(`<a:dannloading:876008681479749662> Ищем противника...`);
   const CC = await makeCanvas(data1.url, data2.url)
    const att = new MessageAttachment(CC.toBuffer(), 'fight.png')
    

    //return message.reply({embeds: [eamb], files: [att]})
    
    let myHero = new MessageEmbed()
    .setTitle(`Поединок начался.`)
    .setImage('attachment://fight.png')
    .setThumbnail('https://media.giphy.com/media/SwUwZMPpgwHNQGIjI7/giphy.gif')
    .addField(`${mUser.username} (${data1.nameRus})`, `**Уровень: ${mrp.level}**`, true)
    .addField(`❤ Общая жизнь: ${mrp.health}`, `**⚔ Общая атака: ${mrp.damage}**`, true)
    .addField(`\u200b`, `\u200b`, false)
    .addField(`${user.user.username} (${data2.nameRus})`, `**Уровень: ${rp.level}**`, true)
    .addField(`❤ Общая жизнь: ${rp.health}`, `**⚔ Общая атака: ${rp.damage}**`, true)
    .setColor(cyan)

  

    
  await pd.findOneAndUpdate({userID: message.author.id}, {$set: {rpg: Date.now()}})
  let msg = await message.channel.send({embeds: [myHero], files: [att]});
  damn.delete()
  let rand = Math.floor(Math.random() * 32)
  if (rand < 16) {
    while (true) {
      h1 -= d2
      h2 -= d1
      if(h1 <= 0) {
        winner = message.author;
        loser = user;
        break;
      } else if (h2 <= 0) {
        winner = user;
        loser = message.author;
        break;
      }
    }
  } else {
    while (true) {
      h2 -= d1
      h1 -= d2
      if(h2 <= 0) {
        winner = user;
        loser = message.author;
        break;
      } else if (h1 <= 0) {
        winner = message.author;
        loser = user;
        break;
      }
    }
  }


  await rpg.findOneAndUpdate({userID: winner.id}, {$inc: {totalGames: 1}})
  await rpg.findOneAndUpdate({userID: loser.id}, {$inc: {totalGames: 1}})


  setTimeout(async() => {
    await mc.giveCoins(winner.id, message.guild.id, 2 * value)

    await rpg.findOneAndUpdate({userID: winner.id}, {$inc: {wins: 1}})
    await rpg.findOneAndUpdate({userID: loser.id}, {$inc: {loses: 1}})

    let winData = await rpg.findOne({userID: winner.id})

    let hero = heroes[winData.item]
    let winEmb = new MessageEmbed()
    .setTitle(`Победитель: ${winner.tag || winner.user.tag} (${hero.nameRus})`)
    .setDescription(`Поединок между: ${user}, ${mUser}`)
    .setImage(hero.url)
    .setColor(cyan)
    .addField(`❤ Общая жизнь: ${winData.health}`, `**⚔ Общая атака: ${winData.damage}**`, true)
    .addField(`Выигрыш: ${value * 2} ${COIN}`, `**🏆 Процент побед: ${Math.trunc(winData.wins / winData.totalGames * 100) || '0'}%**`, true)
    msg.delete()
    return message.channel.send({embeds: [winEmb]})
  }, 25000)

  collector.stop()
}
})

collector.on("end", () => {
if (wait) {
  wait.delete()
}
});

  }
};

async function makeCanvas (data1, data2) {
  const canvas = Canvas.createCanvas(1110, 520);
  const ctx = canvas.getContext('2d');
  const background = await Canvas.loadImage('https://png.pngtree.com/thumb_back/fh260/background/20200729/pngtree-game-battle-versus-vs-background-image_373230.jpg');
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
  const h = 300;
  const heroHeight = 110;
  const firstW = 60;
  const secW = 750;
  
  const first = await Canvas.loadImage(data1);
  const second = await Canvas.loadImage(data2);
  
  ctx.drawImage(first, firstW, heroHeight, h, h);
  ctx.drawImage(second, secW, heroHeight, h, h);

  ctx.lineWidth = 3;
  ctx.strokeStyle = "GRAY";
  ctx.strokeRect(firstW, heroHeight, h, h)

  ctx.lineWidth = 3;
  ctx.strokeStyle = "ORANGE";
  ctx.strokeRect(secW, heroHeight, h, h)
  
  return canvas
}