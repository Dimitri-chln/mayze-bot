const { Message } = require("discord.js");

const command = {
	name: "uptime",
	description: {
		fr: "Le temps depuis lequel le bot est en ligne",
		en: "The time the bot has been online for"
	},
	aliases: [],
	args: 0,
	usage: "",
	slashOptions: null,
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const timeToString = require("../utils/timeToString");
		const uptime = Date.now() - message.client.readyAt;
		const uptimeString = timeToString(uptime / 1000, languageCode);
		message.channel.send(language.get(language.response, uptimeString), { ephemeral: true }).catch(console.error);
	}
};

module.exports = command;