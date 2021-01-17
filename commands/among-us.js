const { Message } = require("discord.js");

const command = {
	name: "among-us",
	description: "Obtenir ou modifier les codes de partie d'Among Us",
	aliases: ["amongUs", "au"],
	args: 0,
	usage: "games | add <code> [description] | delete",
	slashOptions: [
		{
			name: "add",
			description: "Ajouter une partie Among Us",
			type: 1,
			options: [
				{
					name: "code",
					description: "Le code de la partie",
					type: 3,
					required: true
				},
				{
					name: "description",
					description: "Une description de la partie",
					type: 3,
					required: false
				}
			]
		},
		{
			name: "delete",
			description: "Supprimer la partie que tu as créée",
			type: 1
		},
		{
			name: "games",
			description: "Obtenir la liste de toutes les parties",
			type: 1
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options) => {
		const timeToString = require("../modules/timeToString");

		const subCommand = args
			? (args[0] || "").toLowerCase() || "games"
			: options[0].name;
		
		const games = message.client.amongUsGames || {};
		switch (subCommand) {
			case "add":
				const code = args
					? args[1].toUpperCase()
					: options[0].options[0].value.toUpperCase();
				const description = args
					? args.slice(2).join(" ") || "Partie classique"
					: options[0].options[1].value || "Partie classique";
				if (!code || !/\w{6}/.test(code)) return message.reply("entre un code valide").catch(console.error);
				games[message.author.id] = {
					code: code,
					description: description,
					time: Date.now()
				};
				message.client.amongUsGames = games;
				message.reply("partie ajoutée !").catch(console.error);
				break;
			case "delete":
				if (!games[message.author.id]) return message.reply("tu n'as pas de partie en cours").catch(console.error);
				delete games[message.author.id];
				message.reply("partie supprimée !").catch(console.error);
				break;
			default:
				message.channel.send({
					embed: {
						author: {
							name: "Parties Among Us en cours",
							icon_url: message.client.user.avatarURL()
						},
						color: "#010101",
						description: Object.entries(games).map(e => `${message.client.users.cache.get(e[0])}: **${e[1].code}**\n*${e[1].description}*\n(il y a ${timeToString((Date.now() - e[1].time)/1000)})`).join("\n——————————\n") || "*Aucune partie en cours!*",
						footer: {
							text: "✨ Mayze ✨"
						}
					}
				}).catch(console.error);
		}
	}
};

module.exports = command;