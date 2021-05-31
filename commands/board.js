const { Message, Collection } = require("discord.js");
const Canvas = require("../utils/canvas/Canvas");

const command = {
	name: "board",
	description: {
		fr: "Rejoindre un canevas",
		en: "Join a canvas"
	},
	aliases: [],
	args: 0,
	usage: "join <board> | list",
	slashOptions: [
		{
			name: "join",
			description: "Join a canvas",
			type: 1,
			options: [
				{
					name: "board",
					description: "The name of the canvas",
					type: 3,
					required: true
				}
			]
		},
		{
			name: "list",
			description: "Get the list of all available canvas",
			type: 1
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		const subCommand = args
			? args.length ? args[0].toLowerCase() : "list"
			: options[0].name;
		
		/**@type Collection<string, Canvas> */
		const publicBoards = message.client.boards.filter(board => !/-\d{18}$/.test(board.name));
		
		switch (subCommand) {
			case "join":
				const boardName = args[1];
				if (!publicBoards.some(board => board.name === boardName)) return message.reply(language.invalid_board);

				const { rows } = (await message.client.pg.query(`SELECT * FROM boards WHERE user_id = '${message.author.id}'`).catch(console.error)) || {};
				if (!rows) return message.channel.send(language.errors.database).catch(console.error);

				if (rows.length) {
					message.client.pg.query(`UPDATE boards SET board = '${boardName}' WHERE user_id = '${message.author.id}'`)
						.then(() => {
							message.channel.send(language.get(language.joined, boardName), { ephemeral: true }).catch(console.error);
						}).catch(err => {
							console.error(err);
							message.channel.send(language.errors.database, { ephemeral: true }).catch(console.error);
						});
				} else {
					message.client.pg.query(`INSERT INTO boards VALUES ('${message.author.id}', '${boardName}')`)
						.then(() => {
							message.channel.send(language.get(language.joined, boardName), { ephemeral: true }).catch(console.error);
						}).catch(err => {
							console.error(err);
							message.channel.send(language.errors.database, { ephemeral: true }).catch(console.error);
						});
				}
				break;
			case "list":
				message.channel.send({
					embed: {
						author: {
							name: language.title,
							icon_url: message.client.user.avatarURL()
						},
						color: message.guild.me.displayColor,
						description: publicBoards.map(board => `\`${board.name}\` - **${board.size}x${board.size}**`).join("\n"),
						footer: {
							text: "✨ Mayze ✨"
						}
					}
				}).catch(console.error);
				break;
			default:
				return message.reply(language.errors.invalid_args).catch(console.error);
		}
	}
};

module.exports = command;