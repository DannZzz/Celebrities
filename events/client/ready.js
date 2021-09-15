const { PREFIX, VERSION } = require('../../config');
module.exports = async bot => {
    console.log(`${bot.user.username} is available now!`)

   // var activities = ['Dann#0006', 'Only Chill'], i = 0
   let i = 0;
    setInterval(() =>  {
        let totalUsers = bot.guilds.cache.reduce((acc, value) => acc + value.memberCount, 0)
        var activities = [ `${bot.guilds.cache.size} servers!`, `${totalUsers} users!` ];
        
        bot.user.setActivity(`${PREFIX}help | ${activities[i++ % activities.length]}`, { type: "WATCHING" })},20000)
    // bot.user.setActivity(VERSION)
};
