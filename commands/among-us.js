const { Message } = require("discord.js");

const command = {
	name: "among-us",
	description: {
		fr: "Obtiens et gère les parties d'Among Us",
		en: "Get and manage Among Us games"
	},
	aliases: ["au"],
	args: 0,
	usage: "add <code> [<description>] | delete",
	slashOptions: [
		{
			name: "add",
			description: "Add an Among Us game",
			type: 1,
			options: [
				{
					name: "code",
					description: "The game's code",
					type: 3,
					required: true
				},
				{
					name: "description",
					description: "A short description of the game",
					type: 3,
					required: false
				}
			]
		},
		{
			name: "delete",
			description: "Delete your game code",
			type: 1
		},
		{
			name: "games",
			description: "Get the list of all ongoing games",
			type: 1
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language) => {
		const timeToString = require("../utils/timeToString");

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
					? args.slice(2).join(" ") || language.default_desc
					: options[0].options[1].value || language.default_desc;
				if (!code || !/\w{6}/.test(code)) return message.reply(language.invalid_code).catch(console.error);
				games[message.author.id] = {
					code: code,
					description: description,
					time: Date.now()
				};
				message.client.amongUsGames = games;
				message.reply(language.game_added).catch(console.error);
				break;
			case "delete":
				if (!games[message.author.id]) return message.reply(language.user_no_ongoing).catch(console.error);
				delete games[message.author.id];
				message.reply(language.game_deleted).catch(console.error);
				break;
			default:
				message.channel.send({
					embed: {
						author: {
							name: language.ongoing_games,
							icon_url: message.client.user.avatarURL()
						},
						color: "#010101",
						description: Object.entries(games).map(e => `${message.client.users.cache.get(e[0])}: **${e[1].code}**\n*${e[1].description}*\n(${language.get(language.time_ago, timeToString((Date.now() - e[1].time) / 1000, language))}`).join("\n\n") || language.no_ongoing,
						footer: {
							text: "✨ Mayze ✨"
						}
					}
				}).catch(console.error);
		}
	}
};

module.exports = command;