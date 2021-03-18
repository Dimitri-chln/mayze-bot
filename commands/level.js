const { Message } = require("discord.js");

const command = {
	name: "level",
	description: {
		fr: "Obtenir ton niveau sur Mayze",
		en: "Get your chat level with Mayze"
	},
	aliases: ["lvl"],
	args: 0,
	usage: "[<user>]",
	slashOptions: [
		{
			name: "user",
			description: "The user you want to get the level from",
			type: 6,
			required: false
		}
	],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const { BASE_XP, XP_INCREMENT } = require("../config.json");
		const xpBar = ["█", "▁"], barSize = 20;
		const user = args
			? message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author
			: message.client.users.cache.get(options ? options[0].value : null) || message.author;

		let { "rows": top } = (await message.client.pg.query("SELECT * FROM levels ORDER BY xp DESC").catch(console.err)) || {};
		top = top.filter(u => message.guild.members.cache.has(u.user_id));
		
		const userData = top.find(u => u.user_id === user.id);
		const xp = userData ? userData.xp : 0;
		const rank = top.indexOf(userData) + 1;
		const [ level, xpLeft ] = getLevel(xp);
		const xpForNextLevel = BASE_XP + level * XP_INCREMENT;

		message.channel.send({
			embed: {
				author: {
					name: user.tag,
					icon_url: user.avatarURL({ dynamic: true})
				},
				color: message.guild.me.displayHexColor,
				description: language.get(language.description, level, rank, xpBar[0].repeat(Math.round(xpLeft / xpForNextLevel * barSize)) + xpBar[1].repeat(barSize - Math.round(xpLeft / xpForNextLevel * barSize)), xpLeft, xpForNextLevel),
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);

		function getLevel(xp, lvl = 0) {
			const xpPerLevel = BASE_XP + lvl * XP_INCREMENT;
			if (xp < xpPerLevel) return [ lvl, xp ];
			return getLevel(xp - xpPerLevel, lvl + 1);
		}
	}
};

module.exports = command;