const { Message } = require("discord.js");

const command = {
	name: "ping",
	description: {
		fr: "Pong !",
		en: "Pong!"
	},
	aliases: ["pong"],
	args: 0,
	usage: "",
	/**
	 * @param {Message} message  
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		message.channel.send(`Pong! **${message.client.ws.ping}**ms`, { ephemeral: true }).catch(console.error);
	}
};

module.exports = command;