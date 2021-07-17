const { Message } = require("discord.js");

const command = {
	name: "say",
	description: {
		fr: "Faire dire n'importe quoi au bot",
		en: "Make the bot say something"
	},
	aliases: [],
	args: 0,
	usage: "<text>",
	botPerms: ["MANAGE_MESSAGES"],
	category: "miscellaneous",
	newbiesAllowed: true,
	slashOptions: [
		{
			name: "text",
			description: "The text that the bot will send",
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
		const msg = args
			? args.join(" ")
			: (options ? options[0].value : null);
		if (!msg) return;

		message.channel.send(msg, { disableMentions: "everyone" }).catch(console.error);
		
		if (message.deletable) message.delete().catch(console.error);
	}
};

module.exports = command;