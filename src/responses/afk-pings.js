const { Message } = require("discord.js");

const language = {
    get: require("../utils/parseLanguageText"),
    afk_msg: {
        fr: "{1} est AFK depuis {2} 💤[3?\n**→ {3}**:]",
        en: "{1} has been AFK for {2} 💤[3?\n**→ {3}**:]"
    }
};

const autoresponse = {
    /**
     * @param {Message} message 
     */
    async run(message) {
        const timeToString = require("../utils/timeToString");

        if (message.author.bot) return;
        if (message.channel.type === "dm") return;

        let lang = "en";
	    const res = await message.client.database.query(`SELECT * FROM languages WHERE guild_id = '${message.guild.id}'`).catch(console.error);
	    if (res && res.rows.length) lang = res.rows[0].language_code;

        const mentionned = message.mentions.users;
        const { "rows": afkUsers } = (await message.client.database.query("SELECT * FROM afk").catch(console.error)) || {};
        if (!afkUsers) return;
        
        afkUsers.forEach(u => {
            if (mentionned.has(u.user_id)) message.channel.send(language.get(language.afk_msg[lang], mentionned.get(u.user_id).username, timeToString(Math.floor((Date.now() - Date.parse(u.time)) / 1000), lang), u.message), { disableMentions: "everyone" }).catch(console.error);
            if (message.author.id === u.user_id && Date.now() - Date.parse(u.time) > 60000) {
                message.client.database.query(`DELETE FROM afk WHERE user_id = '${message.author.id}'`).catch(console.error);
                message.react("👋").catch(console.error);
                setTimeout(() => message.reactions.cache.get("👋").remove().catch(console.error), 4000);
            }
        });
    }
};

module.exports = autoresponse;