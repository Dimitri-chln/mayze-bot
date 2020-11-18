const command = {
	name: "wishlist",
	description: "Liste des wish pour Mudae",
	aliases: ["wl"],
	args: 0,
	usage: "[mention/pseudo/id]",
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
			try { message.channel.send("Quelque chose s'est mal passé en joignant la base de données :/"); }
			catch (err) { console.log(err); }
			return;
		}
		if (!wishlist) {
			try { message.reply("aucun souahait trouvé"); }
			catch (err) { console.log(err); }
		}
		try {
			message.channel.send({
				embed: {
					author: {
						name: `Wishlist de ${user.tag}`,
						icon_url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
					},
					color: "#010101",
					description: wishlist.map((w, i) => `\`${i + 1}.\` ${w.series}`).join("\n"),
					footer: {
						text: "✨Mayze✨"
					}
				}
			});
		} catch (err) { console.log(err); }
	}
};

module.exports = command;