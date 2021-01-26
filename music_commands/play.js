const { Message } = require("discord.js");

const command = {
	name: "play",
	description: "Jouer une musique",
	aliases: ["p"],
	args: 0,
	usage: "",
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options) => {
		message.client.player.play(message, args.join(" "));
	}
};

module.exports = command;