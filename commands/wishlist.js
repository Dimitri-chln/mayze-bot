const { Message } = require("discord.js");

const command = {
	name: "wishlist",
	description: "Liste des wish pour Mudae",
	aliases: ["wl"],
	args: 0,
	usage: "[utilisateur] [-r]",
	slashOptions: [
		{
			name: "utilisateur",
			description: "L'utilisateur dont tu veux connaître la wishlist",
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
		const user = args
			? message.mentions.users.first() || message.client.users.cache.find(u =>u.id === args[0] || u.username === args[0] || u.username.includes(args[0])) || message.author
			: message.client.users.cache.get((options ? options[0] : {}).value) || message.author;

		const { "rows": wishlist } = await message.client.pg.query(`SELECT * FROM wishes WHERE user_id='${user.id}'`).catch(console.error);
		if (!wishlist) return message.channel.send("Quelque chose s'est mal passé en accédant à la base de données :/").catch(console.error);

		let desc = wishlist.map((w, i) => `\`${i + 1}.\` ${w.series}`).join("\n") || "*Aucun souhait trouvé*";
		if (args && args.includes("-r")) desc = wishlist.map((w, i) => `\`${i + 1}.\` ${w.series} -  *${w.regex || w.series.toLowerCase()}*`).join("\n") || "*Aucun souhait trouvé*";

		message.channel.send({
			embed: {
				author: {
					name: `Wishlist de ${user.tag}`,
					icon_url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
				},
				color: "#010101",
				description: desc,
				footer: {
					text: "✨Mayze✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;