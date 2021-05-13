const { Message } = require("discord.js");

const command = {
	name: "test",
	description: "testest",
	aliases: [],
	args: 0,
	usage: "",
	ownerOnly: true,
	/**
	 * 
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		const Palette = require("../utils/canvas/Palette");

		/**@type Palette */
		let palette = message.client.canvas.palette;

		palette.all().forEach((color, alias) => message.channel.send(`${alias}, https://dummyimage.com/100/${color.hexadecimal.replace("#", "")}?text=+`));
	}
};

module.exports = command;