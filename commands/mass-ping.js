const { Message } = require("discord.js");

const command = {
	name: "mass-ping",
	description: {
		fr: "Mentionner une personne en boucle",
		en: "Mention a user multiple times"
	},
	aliases: ["massping", "spam-ping", "spamping"],
	args: 1,
	usage: "<user> <number> [<message>]",
	perms: ["MANAGE_MESSAGES"],
	slashOptions: [
		{
			name: "user",
			description: "The user to mention",
			type: 6,
			required: true
		},
		{
			name: "number",
			description: "The number of mentions to send - By default: 10",
			type: 4,
			required: true
		},
		{
			name: "message",
			description: "The message to send along with the ping",
			type: 3,
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

		if (["510493665693794315", "329576537323995138"].includes(message.author.id))
			return message.reply("dommage").catch(console.error);

		/** @type {Collection<string, Message>} */
		let messages = new Collection();

		const user = args
			? message.mentions.users.first()
			: message.client.users.cache.get(options[0].value);
		if (!user) return message.reply(language.no_mention).catch(console.error);
		const n = args
			? parseInt(args[1]) || 10
			: parseInt(options[1].value) || 10;
		if (isNaN(n) || n < 1 || n > 1000) return message.reply(language.invalid_number).catch(console.error);
		const pingMsg = args
			? args.splice(2).length ? args.splice(2).join(" ") : null
			: (options[2] || {}).value;
		if (pingMsg && n > 100) return message.reply(language.invalid_number_msg).catch(console.error);

		if (message.deletable) message.delete().catch(console.error);
		
		for (i = 1; i <= n; i++) {
			const msg = await  message.channel.send(`${user} ${pingMsg}`).catch(console.error);
			messages.set(msg.id, msg);
		}

		if (pingMsg) return;
		while (messages.size) {
			let messagesToDelete = new Collection(messages.first(100).map(m => [m.id, m]));
			message.channel.bulkDelete(messagesToDelete);
			messages.sweep(m => messagesToDelete.has(m.id));
		}
	}
};

module.exports = command;