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
		let x = args
			? parseInt(args[0])
			: options[0].value;
		let y = args
			? parseInt(args[1])
			: options[1].value;
		if (isNaN(x) || isNaN(y) || x < 0 || y < 0 || x >= message.client.canvas.size || y >= message.client.canvas.size)
			return message.reply(language.invalid_coordinates).catch(console.error);

		const colorName = args
			? args[2]
			: options[2].value;

		if (message.client.canvas.palettes.every(palette => !palette.has(colorName))) return message.reply(language.invalid_color).catch(console.error);
		
		await message.client.canvas.setPixel(x, y, colorName);
		
		const grid = await message.client.canvas.viewNav(x, y);
		const blank = message.client.guilds.cache.get("744291144946417755").emojis.cache.find(e => e.name === "blank");

		let content = `**${message.client.canvas.name.replace(/^./, a => a.toUpperCase())} - (${x}, ${y})**\n`;
		for (let i = 0; i < 7; i ++) {
			content += grid[i].map(c => c
				? c.emote
				: blank
			).join("");
			if (i === 2) content += " ⬆️";
			if (i === 3) content += ` **${y}** (y)`;
			if (i === 4) content += " ⬇️";
			content += "\n";
		}
		content += `${blank}⬅️ **${x}** (x) ➡️`;

		message.channel.send({
			content,
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