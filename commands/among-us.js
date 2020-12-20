const command = {
	name: "among-us",
	desription: "Voir et modifier le code d'une partie d'Among Us",
	aliases: ["amongUs", "au"],
	args: 0,
	usage: "[add <code> [description]] [delete]",
	async execute(message, args) {
		const timeToString = require("../modules/timeToString.js");
		
		var games = message.client.amongUsGames || {};
		if (["add", "create"].includes(args[0]) && /\w{6}/.test(args[1])) {
			games[message.author.id] = { code: args[1], description: args.splice(2).join(" ") || "Partie classique", time: Date.now() };
			message.client.amongUsGames = games;
			message.channel.send("Partie ajoutée!").catch(console.error);
		} else if (args[0] === "delete" && games[message.author.id]) {
			delete games[message.author.id];
			message.client.amongUsGames = games;
			message.channel.send("Partie supprimée!").catch(console.error);
		} else {
			message.channel.send({
				embed: {
					author: {
						name: "Parties Among Us en cours",
						icon_url: message.client.user.avatarURL()
					},
					color: "#010101",
					description: Object.entries(games).map(e => `${message.client.users.cache.get(e[0])}: **${e[1].code}**\n*${e[1].description}*\n(il y a ${timeToString((Date.now() - e[1].time)/1000)})`).join("\n——————————\n") || "Aucune partie en cours!",
					footer: {
						text: "✨ Mayze ✨"
					}
				}
			}).catch(console.error);
		};
	}
};

module.exports = command;