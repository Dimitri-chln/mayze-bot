const { Message } = require("discord.js");

const command = {
	name: "ping",
	description: "Pong!",
	aliases: ["pong"],
	args: 0,
	usage: "",
	slashOptions: null,
	/**
	 * @param {Message} message  
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language) => {
		message.channel.send(`Pong! **${message.client.ws.ping}**ms`).catch(console.error);
	}
};

module.exports = command;