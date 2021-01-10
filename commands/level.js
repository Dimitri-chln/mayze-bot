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
		const { baseXp } = require("../config.json");
		const xpBar = ["█", "▁"], barSize = 20;
		const user = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author;

		const { "rows": top } = await message.client.pg.query("SELECT * FROM levels ORDER BY xp DESC").catch(console.err);
		const userXp = top.find(u => u.user_id === user.id);
		const xp = userXp ? userXp.xp : 0;
		const rank = top.indexOf(userXp) + 1;
		const [ level, xpLeft ] = getLevel(xp);
		const xpForNextLevel = baseXp + level * 250;

		message.channel.send({
			embed: {
				author: {
					name: user.tag,
					icon_url: user.avatarURL({ dynamic: true})
				},
				color: "#010101",
				description: `• **Niveau : \`${level}\`**\n• **Rang : \`#${rank}\`**\n\n**XP** ${xpBar[0].repeat(Math.round(xpLeft / xpForNextLevel * barSize)) + xpBar[1].repeat(barSize - Math.round(xpLeft / xpForNextLevel * barSize))} ${xpLeft}/${xpForNextLevel}`,
				footer: {
					text: "✨Mayze✨"
				}
			}
		}).catch(console.error);

		function getLevel(xp, lvl = 0) {
			const xpPerLevel = baseXp + lvl * 250;
			if (xp < xpPerLevel) return [ lvl, xp ];
			return getLevel(xp - xpPerLevel, lvl + 1);
		}
	}
};

module.exports = command;