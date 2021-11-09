const { PREFIX, VERSION } = require('../../config');
const { EventName, DAWidget } = require("donationalerts-api");
const {MessageEmbed} = require("discord.js");
const {main} = require("../../JSON/colours.json");
const express = require('express')
const Topgg = require('@top-gg/sdk')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express()

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
    ]}));
    // voting
    const webhook = new Topgg.Webhook('Dann04WithMariam') //Secure Password (Change it for god's Sake)

    app.post('/vote', webhook.listener(vote => { //ending url
        console.log("User with id - " + vote.user + " Voted!")
        let value = JSON.stringify({
            embeds: [
                {
                    title: "Another Vote!!",
                    description: `<@${vote.user}> (${vote.user}) Just Voted For \`The Bot\`!!`,
                    color: "8388736" //Hex -> Decimal
                }
            ]
        })
        fetch("https://canary.discord.com/api/webhooks/907662421559218207/CFQOz4oQgWUB7bLf9E6K8oOJpGkFTMhW1cx9Wq_eux7oKmx4FDyYuv71Uzo7MFOYu30e", { //Your webhook here
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: value
        }).catch(e => console.log('Error occured while posting webhook : ' + e))
    }))
    app.listen(3001) //Port
    console.log("Your app is ready to log votes :D")
   // var activities = ['Dann#0006', 'Only Chill'], i = 0
   let i = 0;
    setInterval(() =>  {
        let totalUsers = bot.guilds.cache.reduce((acc, value) => acc + value.memberCount, 0)
        var activities = [ `${bot.guilds.cache.size} servers!`, `${totalUsers} users!` ];
        
        bot.user.setActivity(`${VERSION} | ${activities[i++ % activities.length]}`, { type: "WATCHING" })},20000)
    // bot.user.setActivity(VERSION)
};
