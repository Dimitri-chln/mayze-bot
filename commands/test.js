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
		const { TIMEZONE } = require("../config.json");

		function getTimezoneOffset(tz) {
			const d = new Date();
			const parts = d.toLocaleString("ja", { timeZone: tz }).split(/[/\s:]/);
			parts[1]--;

			const utcDate = Date.UTC(...parts);
			const tzDate = new Date(d).setMilliseconds(0);
			return (utcDate - tzDate) / 60 / 60 / 1000;
		}

		message.channel.send(getTimezoneOffset(TIMEZONE));
	}
};

module.exports = command;