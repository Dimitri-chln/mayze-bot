const { Message } = require("discord.js");

const command = {
	name: "mass-ping",
	description: {
		fr: "Mentionner une personne en boucle",
		en: "Mention a user multiple times"
	},
	aliases: ["massping"],
	args: 1,
	usage: "<user> [number]",
	perms: ["MANAGE_MESSAGES"],
	slashOptions: [
		{
			name: "user",
			description: "The user to mention",
			type: 6,
			required: true
		},
		{
			name: "nmber",
			description: "The number of mentions to send - By default: 10",
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
		const { Collection } = require("discord.js");
		/** @type {Collection<string, Message>} */
		let messages = new Collection();

		const user = args
			? message.mentions.users.first()
			: message.client.users.cache.get(options[0].value);
		if (!user) return message.reply(language.no_mention).catch(console.error);
		const n = args
			? parseInt(args[1]) || 10
			: parseInt((options[1] || {}).value) || 10;
		if (isNaN(n) || n < 1 || n > 1000) return message.reply(language.invalid_number).catch(console.error);

		if (message.deletable) message.delete().catch(console.error);
		
		for (i = 1; i <= n; i++) {
			const msg = await message.channel.send(`${user}`).catch(console.error);
			messages.set(msg.id, msg);
		}

		while (messages.size) {
			let messagesToDelete = new Collection(messages.first(100).map(m => [m.id, m]));
			message.channel.bulkDelete(messagesToDelete);
			messages.sweep(msg => messagesToDelete.has(msg.id));
		}
	}
};

module.exports = command;