const { server } = require("../../functions/models");

module.exports = async (bot, guild) => {
    let serverData = await server.findOne({ serverID: guild.id });
    if(!serverData) {
        let serverNew = await server.create({
        serverID: guild.id,
        lang: "en"
        })
    serverNew.save()}
}