const command = {
	name: "wishlist",
	description: "Liste des wish pour Mudae",
	aliases: ["wl"],
	args: 0,
	usage: "[mention/pseudo/id] [-r]",
	async execute(message, args) {
		const databaseSQL = require("../modules/databaseSQL.js");
		const user = message.mentions.users.first() || message.client.users.cache.find(u =>u.id === args[0] || u.username === args[0] || u.username.includes(args[0])) || message.author;
		var wishlist;
		try {
			const { rows } = await databaseSQL(`SELECT * FROM wishes WHERE user_id='${user.id}'`);
			wishlist = rows;
		}
		catch (err) {
			console.log(err);
			return message.channel.send("Quelque chose s'est mal passé en joignant la base de données :/").catch(console.error);
		}
		desc = wishlist.map((w, i) => `\`${i + 1}.\` ${w.series}`).join("\n") || "*Aucun souhait trouvé*";
		if (args.includes("-r")) {
			desc = wishlist.map((w, i) => `\`${i + 1}.\` ${w.series} -  *${w.regex || w.series.toLowerCase()}*`).join("\n") || "*Aucun souhait trouvé*";
		}
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