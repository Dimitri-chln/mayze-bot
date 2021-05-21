const { Message } = require("discord.js");

const command = {
	name: "view",
	description: {
		fr: "Voir une image du canevas",
		en: "Get an image view of the canvas"
	},
	aliases: [],
	args: 0,
	usage: "[<x>] [<y>] [<zoom>]",
	slashOptions: [
		{
			name: "x",
			description: "The x coordinate of the center of the image",
			type: 4,
			required: false
		},
		{
			name: "y",
			description: "The y coordinate of the center of the image",
			type: 4,
			required: false
		},
		{
			name: "zoom",
			description: "The size of the image in pixels",
			type: 4,
			required: false
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		const { MessageAttachment } = require("discord.js");
		const { OWNER_ID } = require("../config.json");

		const { rows } = (await message.client.pg.query(`SELECT * FROM boards WHERE user_id = '${message.author.id}'`).catch(console.error)) || {};
		if (!rows) return message.channel.send(language.errors.database).catch(console.error);
		if (!rows.length) return message.reply(language.not_in_board).catch(console.error);
		let { board } = rows[0];

		if (message.author.id === OWNER_ID && args && args.includes("-board")) {
			let boardName = args[args.indexOf("-board") + 1];
			if (message.client.boards.some(b => b.name === boardName))
				board = boardName;
			args.splice(args.indexOf("-board"), 2);
		}

		const x = args
			? args[0] ? parseInt(args[0]) : "default"
			: options.some(o => o.name === "x") ? options.find(o => o.name === "x").value : "default";
		const y = args
			? args[1] ? parseInt(args[1]) : "default"
			: options.some(o => o.name === "y") ? options.find(o => o.name === "y").value : "default";
		if (
			(x !== "default" && (isNaN(x) || x < 0 || x >= message.client.boards.get(board).size)) ||
			(y !== "default" && (isNaN(y) || y < 0 || y >= message.client.boards.get(board).size))
		) return message.reply(language.invalid_coordinates).catch(console.error);
		
		const zoom = args
			? args[2] ? parseInt(args[2]) : "default"
			: options.some(o => o.name === "zoom") ? options.find(o => o.name === "zoom").value : "default";
		if (zoom && zoom !== "default" && (zoom < 1 || zoom > message.client.boards.get(board).size / 2)) return message.reply(language.invalid_zoom).catch(console.error);

		const startLoad = Date.now();
		if (!message.isInteraction) message.channel.startTyping(1);
		const image = await message.client.boards.get(board).view(x, y, zoom);
		if (!message.isInteraction) message.channel.stopTyping();
		const endLoad = Date.now();

		const channel = message.client.channels.cache.get("842099108473995355");
		const attachment = new MessageAttachment(image, "canvas.png");
		channel.send(attachment).then(msg => message.channel.send({
			embed: {
				title: language.get(language.title, message.client.boards.get(board).name.replace(/^./, a => a.toUpperCase()), message.client.boards.get(board).size, (endLoad - startLoad) / 1000),
				color: message.guild.me.displayColor,
				image: {
					url: msg.attachments.first().url
				},
				footer: {
					icon_url: message.author.avatarURL({ dynamic: true }),
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error)).catch(console.error);
	}
};

module.exports = command;