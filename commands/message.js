const { Message } = require("discord.js");

const command = {
	name: "message",
	description: "Envoyer un message dans un salon",
	aliases: ["msg", "m"],
	args: 2,
	usage: "<salon> <texte>",
	perms: ["MANAGE_MESSAGES"],
	slashOptions: [
		{
			name: "salon",
			description: "Le salon où le message doit être envoyé",
			type: 7,
			required: true
		},
		{
			name: "message",
			description: "Le message à envoyer",
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
		const channel = args
			? message.mentions.channels.first()
			: message.client.channels.cache.get(options[0].value);
		const msg = args
			? args.slice(1).join(" ")
			: options[1].value;
		if (!channel) return message.reply("indique le salon dans lequel je dois envoyer le message").catch(console.error);
		const m = await channel.send(msg).catch(console.error);
		if (m) {
			if (message.deletable) message.react("✅").catch(console.error);
			else message.reply("message envoyé !").catch(console.error);
		} else message.channel.send("Quelque chose s'est mal passé en envoyant le message :/").catch(console.error);
	}
};

module.exports = command;