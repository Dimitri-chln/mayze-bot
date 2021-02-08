const { Message } = require("discord.js");

const autoresponse = {
    /**
     * @param {Message} message 
     */
    async execute(message) {
        const timeToString = require("../utils/timeToString.js");
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;
        const mentionned = message.mentions.users;
        const { "rows": afkUsers } = await message.client.pg.query("SELECT * FROM afk").catch(console.error);
        if (!afkUsers) return;
        afkUsers.forEach(u => {
            if (mentionned.has(u.user_id)) message.channel.send(`**${mentionned.get(u.user_id).username}** est AFK depuis ${timeToString(Math.floor((Date.now() - Date.parse(u.time)) / 1000))} 💤${u.message ? `\n**→ ${u.message}**` : ""}`).catch(console.error);
            if (message.author.id === u.user_id && Date.now() - Date.parse(u.time) > 60000) {
                message.client.pg.query(`DELETE FROM afk WHERE user_id = '${message.author.id}'`).catch(console.error);
                message.react("👋").catch(console.error);
                setTimeout(() => message.reactions.cache.get("👋").remove().catch(console.error), 4000);
            }
        });
    }
};

module.exports = autoresponse;