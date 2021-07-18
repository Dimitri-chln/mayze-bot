const { Message } = require("discord.js");

const command = {
	name: "wish-list",
	description: {
		fr: "Obtenir la liste de tes wish pour Mudae",
		en: "Get the list of your Mudae wishes"
	},
	aliases: ["wishlist", "wl"],
	args: 0,
	usage: "[<user>] [-r]",
	botPerms: ["EMBED_LINKS"],
	category: "games",
	slashOptions: [
		{
			name: "user",
			description: "The user to check the wishlist from",
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
		const user = args
			? message.mentions.users.first() || message.client.findMember(message.guild, args.join(" "))?.user || message.author
			: message.client.users.cache.get((options ? options[0] : {}).value) || message.author;

		if (!message.guild.members.cache.has("432610292342587392")) return language.errors.mudae;

		const { "rows": wishlist } = (await message.client.pg.query(`SELECT * FROM wishes WHERE user_id='${user.id}'`).catch(console.error)) || {};
		if (!wishlist) return message.channel.send(language.errors.database).catch(console.error);

		let desc = wishlist.map((w, i) => `\`${i + 1}.\` ${w.series}`).join("\n");
		if (args && args.includes("-r")) desc = wishlist.map((w, i) => `\`${i + 1}.\` ${w.series} -  *${w.regex ? w.regex : w.series.toLowerCase()}*`).join("\n");

		message.channel.send({
			embed: {
				author: {
					name: language.get(language.title, user.tag),
					icon_url: user.displayAvatarURL()
				},
				color: message.guild.me.displayColor,
				description: desc || language.no_wish,
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;