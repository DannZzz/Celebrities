const { PREFIX, VERSION } = require('../../config');
const { EventName, DAWidget } = require("donationalerts-api");
const {MessageEmbed} = require("discord.js");
const {main} = require("../../JSON/colours.json");

module.exports = async bot => {
    console.log(`${bot.user.username} is available now!`)
    

    const token = process.env.DA; // secret token url param from any widget

    const dawidget = new DAWidget(token, {
        widgetBehavior: true,
        alertDuration: 10000
    })

    const EMB = new MessageEmbed()
    .setColor(main)
    .setTimestamp()

    const guild = bot.guilds.cache.get("731032795509686332");
    const channel = guild.channels.cache.get("895682200408821801");

    dawidget.socket.on(EventName.Donation, donation => channel.send({embeds: [
        EMB.setTitle(donation.username).setDescription("**Message:**\n" + "`" + donation.message + "`").addField(donation.amount, donation.currency)
    ]}))

   // var activities = ['Dann#0006', 'Only Chill'], i = 0
   let i = 0;
    setInterval(() =>  {
        let totalUsers = bot.guilds.cache.reduce((acc, value) => acc + value.memberCount, 0)
        var activities = [ `${bot.guilds.cache.size} servers!`, `${totalUsers} users!` ];
        
        bot.user.setActivity(`${PREFIX}help | ${activities[i++ % activities.length]}`, { type: "WATCHING" })},20000)
    // bot.user.setActivity(VERSION)
};
