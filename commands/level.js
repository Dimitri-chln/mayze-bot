const { Message } = require("discord.js");

const command = {
    name: "level",
    description: "Regarde ton niveau sur Mayze",
    aliases: ["lvl"],
    args: 0,
    usage: "[mention/id]",
    /**
     * @param {Message} message 
     * @param {string[]} args 
     */
    async execute(message, args) {
        const { xpPerLevel } = require("../config.json");
        const xpBar = ["█", "▁"], barSize = 20;
        const user = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author;

        var data;
        try {
            const { rows } = await message.client.pg.query(`SELECT * FROM levels ORDER BY xp DESC`);
            data = rows.find(u => u.user_id === user.id) || {};
            xp = data.xp || 0;
            rank = rows.indexOf(data) + 1;
        } catch (err) {
            console.error(err);
            message.channel.send("Quelque chose s'est mal passé en joignant la base de données :/").catch(console.error);
        }

        const level = Math.floor(xp / xpPerLevel);
        const xpLeft = xp - (level * xpPerLevel);

        message.channel.send({
            embed: {
                author: {
                    name: user.tag,
                    icon_url: user.avatarURL({ dynamic: true})
                },
                color: "#010101",
                description: `• **Niveau : \`${level}\`**\n• **Rang : \`#${rank}\`**\n\n**XP** ${xpBar[0].repeat(Math.round(xpLeft / xpPerLevel * barSize)) + xpBar[1].repeat(barSize - Math.round(xpLeft / xpPerLevel * barSize))} ${xpLeft}/${xpPerLevel}`,
                footer: {
                    text: "✨Mayze✨"
                }
            }
        })
    }
};

module.exports = command;