const {rpg, bag} = require("../../functions/models");
const {error} = require("../../functions/functions");
const {STAR, AGREE, DISAGREE, devID, adminID} = require('../../config')

module.exports = {
    config: {
        name: "create-invite",
        aliases: '',
        dev: true
    },
    run: async (bot, msg, args) => {
        let guild = msg.guild;
        if (args[0]) {
            const g = bot.guilds.cache.get(args[0]);
            if (g) guild = g;
        };

        const makeInvite = async function (guild) {
            const channels_text = guild.channels.cache.filter(channel => channel.type === "GUILD_TEXT");
            if (!channels_text || channels_text.size === 0) return false;

            const inviteLine = `https://discord.gg/`;

            try {
                const link = await guild.invites.create(channels_text.first().id).then(invite => inviteLine+invite.code);
                console.log(link)
                return link;
            } catch (guild) {
                return false;
            }
            
        };

        const invite = await makeInvite(guild);
        if (invite) {
            msg.reply(invite);
        }
        
    }
}