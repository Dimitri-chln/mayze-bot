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
	category: "utility",
	newbiesAllowed: true,
	/**
	 * @param {Message} message  
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	run: async (message, args, options, language, languageCode) => {
		message.channel.send(`Pong! **${message.client.ws.ping}**ms`).catch(console.error);
	}
};

module.exports = command;