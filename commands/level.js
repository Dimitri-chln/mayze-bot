const { Message } = require("discord.js");

const command = {
	name: "level",
	description: "Obtenir ton niveau sur Mayze",
	aliases: ["lvl"],
	args: 0,
	usage: "[mention/id]",
	slashOptions: [
		{
			name: "utilisateur",
			description: "L'utilisateur dont tu veux connaître le niveau",
			type: 6,
			required: false
		}
	],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	async execute(message, args, options) {
		const { baseXp, xpIncrement } = require("../config.json");
		const xpBar = ["█", "▁"], barSize = 20;
		const user = args
			? message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author
			: message.client.users.cache.get(options[0].value) || message.author;

		const { "rows": top } = await message.client.pg.query("SELECT * FROM levels ORDER BY xp DESC").catch(console.err);
		const userData = top.find(u => u.user_id === user.id);
		const xp = userData ? userData.xp : 0;
		const rank = top.indexOf(userData) + 1;
		const [ level, xpLeft ] = getLevel(xp);
		const xpForNextLevel = baseXp + level * xpIncrement;

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
			const xpPerLevel = baseXp + lvl * xpIncrement;
			if (xp < xpPerLevel) return [ lvl, xp ];
			return getLevel(xp - xpPerLevel, lvl + 1);
		}
	}
};

module.exports = command;