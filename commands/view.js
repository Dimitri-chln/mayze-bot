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

		const x = args
			? args[0] ? parseInt(args[0]) : "default"
			: options.some(o => o.name === "x") ? options.find(o => o.name === "x").value : null;
		const y = args
			? args[1] ? parseInt(args[1]) : "default"
			: options.some(o => o.name === "y") ? options.find(o => o.name === "y").value : null;
		if (
			(x !== "default" && (isNaN(x) || x < 0 || x >= message.client.canvas.size )) ||
			(y !== "default" && (isNaN(y) || y < 0 || y >= message.client.canvas.size ))
		) return message.reply(language.invalid_coordinates).catch(console.error);
		
		const zoom = args
			? parseInt(args[2])
			: options.some(o => o.name === "zoom") ? options.find(o => o.name === "zoom").value : null;
		if (zoom && (zoom < 1 || zoom > message.client.canvas.size / 2)) return message.reply(language.invalid_zoom).catch(console.error);

		const startLoad = Date.now();
		message.channel.startTyping(1);
		const image = await message.client.canvas.view(x, y, zoom);
		message.channel.stopTyping();
		const endLoad = Date.now();

		const channel = message.client.channels.cache.get("842099108473995355");
		const attachment = new MessageAttachment(image, "canvas.png");
		channel.send(attachment).then(msg => message.channel.send({
			embed: {
				title: language.get(language.title, message.client.canvas.name.replace(/^./, a => a.toUpperCase()), message.client.canvas.size, (endLoad - startLoad) / 1000),
				color: message.guild.me.displayColor,
				image: {
					url: msg.attachments.first().url
				},
				footer: {
					icon_url: message.author.avatarURL(),
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error)).catch(console.error);
	}
};

module.exports = command;