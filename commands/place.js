const { Message } = require("discord.js");

const command = {
	name: "place",
	description: {
		fr: "Placer un pixel sur le canevas",
		en: "Place a pixel on the canvas"
	},
	aliases: [],
	args: 3,
	usage: "<x> <y> <color>",
	slashOptions: [
		{
			name: "x",
			description: "The x coordinate of the pixel",
			type: 4,
			required: true
		},
		{
			name: "y",
			description: "The y coordinate of the pixel",
			type: 4,
			required: true
		},
		{
			name: "color",
			description: "The color of the pixel. See *palette",
			type: 3,
			required: true
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		const formatContent = require("../utils/canvas/formatContent");

		const { rows } = (await message.client.pg.query(`SELECT * FROM boards WHERE user_id = '${message.author.id}'`).catch(console.error)) || {};
		if (!rows) return message.channel.send(language.errors.database).catch(console.error);
		if (!rows.length) return message.reply(language.not_in_board).catch(console.error);
		const { board } = rows[0];

		const x = args
			? parseInt(args[0])
			: options[0].value;
		const y = args
			? parseInt(args[1])
			: options[1].value;
		if (isNaN(x) || isNaN(y) || x < 0 || y < 0 || x >= message.client.boards.get(board).size || y >= message.client.boards.get(board).size)
			return message.reply(language.invalid_coordinates).catch(console.error);

		const colorName = args
			? args[2]
			: options[2].value;
		if (message.client.palettes.every(palette => !palette.has(colorName))) return message.reply(language.invalid_color).catch(console.error);
		
		await message.client.boards.get(board).setPixel(x, y, colorName);
		
		const grid = await message.client.boards.get(board).viewNav(x, y);
		const blank = message.client.guilds.cache.get("744291144946417755").emojis.cache.find(e => e.name === "blank");

		message.channel.send({
			content: formatContent(message.client.boards.get(board), grid, x, y, blank),
			embed: {
				author: {
					name: message.author.tag,
					icon_url: message.author.avatarURL({ dynamic: true })
				},
				color: message.guild.me.displayColor,
				description: language.pixel_placed,
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;