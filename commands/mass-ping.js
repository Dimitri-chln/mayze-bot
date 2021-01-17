const { Message } = require("discord.js");

const command = {
	name: "mass-ping",
	description: "Mentionner une personne en boucle",
	aliases: ["massping"],
	args: 1,
	usage: "<mention> [nombre]",
	perms: ["MANAGE_MESSAGES"],
	slashOptions: [
		{
			name: "utilisateur",
			description: "La personne à ping",
			type: 6,
			required: true
		},
		{
			name: "nombre",
			description: "Le nombre de messages à envoyer",
			type: 4,
			required: false
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options) => {
		const { Collection } = require("discord.js");
		const messages = new Collection();
		const user = args
			? message.mentions.users.first()
			: message.client.users.cache.get(options[0].value);
		if (!user) return message.reply("mentionne une personnne").catch(console.error);
		const n = args
			? parseInt(args[1], 10) || 10
			: parseInt((options[1] || {}).value) || 10;
		if (isNaN(n) || n < 1 || n > 100) return message.reply("le nombre doit être compris entre 1 et 100").catch(console.error);

		if (message.deletable) message.delete().catch(console.error);
		
		for (i = 0; i < n; i++) {
			const msg = await message.channel.send(`${user}`).catch(console.error);
			messages.set(msg.id, msg);
		}

		message.channel.bulkDelete(messages).catch(console.error);
	}
};

module.exports = command;