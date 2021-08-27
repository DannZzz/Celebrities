const { MessageEmbed, MessageAttachment } = require('discord.js');
const {greenlight, redlight, cyan} = require('../../JSON/colours.json');
const { COIN, BANK, STAR } = require('../../config');
const vipModel = require("../../models/vipSchema");
const serverModel = require("../../models/serverSchema");
const {error, embed, perms} = require('../../functions');
const { RateLimiter } = require('discord.js-rate-limiter');
let rateLimiter = new RateLimiter(1, 5000);
const Levels = require("discord-xp");
Levels.setURL(process.env.MONGO);
const Canvas = require('canvas');

module.exports = {
  config: {
    name: 'ранг',
    aliases: ['rank'],
    category: 'b_info',
    description: 'Посмотреть ранг участника по активности.',
    usage: '[участник]',
    acessableby: 'Для всех'
  },
  run: async (bot, message, args) => {
    let limited = rateLimiter.take(message.author.id)
    if(limited) return

    let server = await serverModel.findOne({serverID: message.guild.id})

    if (!server.rank) return error(message, `Система уровней для этого сервера отключена!`);

    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;
    let vip = await vipModel.findOne({userID: user.id})
    if (user.user.bot) return error(message, `Боты не имеют профиль!`);
    let person = await Levels.fetch(user.id, message.guild.id, true)
    if (!person) return error(message, `Участник пока не имеет ранг!`);
    let customColor = false;
    if (vip.rankColor !== null){
       let a = vip.rankColor.split("")
       if (a[0] !== "#") {
         a = "#" + vip.rankColor
       } else {
         a = vip.rankColor + ""
       }
       customColor = a
    }
    let nowLevelToReq = Levels.xpFor(person.level + 1) - Levels.xpFor(person.level)
    let nowLevelToZero = person.xp - Levels.xpFor(person.level)
    

    const xpBarre = Math.floor( nowLevelToZero / nowLevelToReq * 490);

        const canvas = Canvas.createCanvas(800, 300);
        const ctx = canvas.getContext('2d');

        if(vip.rankImage){
            const background = await Canvas.loadImage(vip.rankImage);
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        } else {
          const background = await Canvas.loadImage("https://discordjs.guide/assets/canvas-preview.30c4fe9e.png");
          ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        }


        ctx.beginPath();
        ctx.fillStyle = "#000";
        ctx.globalAlpha = 0.2
        ctx.fillRect(20, 20, 760, 260);
        ctx.closePath();

        ctx.globalAlpha = 1;
        ctx.font = '35px "Alumni Sans"';
        ctx.fillStyle = customColor || '#fff';
        if(user.user.username.length > 15){
            const username = user.user.username;
            ctx.fillText(`${username.slice(0, 15) + "..."}`, 225, 125);
            ctx.fillText(user.user.discriminator, (15 * 19.5 + (3 * 6)) + 225, 125)
        }else{
            ctx.fillText(user.user.username, 225, 125);
            ctx.fillText(`#${user.user.discriminator}`, ((user.user.username.length * 19) - (user.user.username.length * 1.4)) + 225, 125)
        }

        ctx.globalAlpha = 1;
        ctx.font = '38px "Alumni Sans"';
        ctx.fillStyle = customColor || '#fff';
        ctx.fillText(`Уровень ${person.level}`, 570, 65);
        
        ctx.globalAlpha = 1;
        ctx.font = '38px "Alumni Sans"';
        ctx.fillStyle = customColor || '#fff';
        ctx.fillText(`Ранг ${person.position}`, 370, 65);

        ctx.beginPath();
        ctx.globalAlpha = 1;
        ctx.lineWidth = 2;
        ctx.fillStyle = "#ccc";
        ctx.moveTo(220, 135);
        ctx.lineTo(690, 135);
        ctx.quadraticCurveTo(710, 135, 710, 152.5);  
        ctx.quadraticCurveTo(710, 170, 690, 170);
        ctx.lineTo(220, 170);
        ctx.lineTo(220, 135);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.globalAlpha = 1;
        ctx.lineWidth = 2;
        ctx.fillStyle = customColor || "#ff5555";
        ctx.moveTo(220, 135);
        ctx.lineTo(220 + xpBarre - 20, 135);
        ctx.quadraticCurveTo(220 + xpBarre, 135, 220 + xpBarre, 152.5); 
        ctx.quadraticCurveTo(220 + xpBarre, 170, 220 + xpBarre-20, 170); 
        ctx.lineTo(220, 170);
        ctx.lineTo(220, 135);
        ctx.fill();
        ctx.font = '28px "Alumni Sans"';
        ctx.fillStyle = "#000";
        ctx.fillText(`${nowLevelToZero} / ${nowLevelToReq} xp`, 230, 162)
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(125, 150, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const avatar = await Canvas.loadImage(user.user.displayAvatarURL({format: "png"}));
        ctx.drawImage(avatar, 25, 50, 200, 200);
    
    
    
    
    
    message.reply({ files: [{ attachment: canvas.toBuffer(), name: 'rankcard.png' }] });

  }
}
