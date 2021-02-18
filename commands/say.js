const { Message } = require("discord.js");

const command = {
	name: "say",
	description: "Faire dire n'importe quoi au bot",
	aliases: [],
	args: 0,
	usage: "<texte>",
	slashOptions: [
		{
			name: "texte",
			description: "Le texte à envoyer",
			type: 3,
			required: true
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language) => {
		const msg = args
			? args.join(" ")
			: (options ? options[0].value : null);
		if (!msg) return;
		message.channel.send(msg).catch(console.error);
		if (message.deletable) message.delete().catch(console.error);
	}
};

module.exports = command;