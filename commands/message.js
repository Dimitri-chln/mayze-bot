const { Message } = require("discord.js");

const command = {
	name: "message",
	description: {
		fr: "Envoyer un message dans un salon",
		en: "Send a message in a channel"
	},
	aliases: ["msg", "post"],
	args: 2,
	usage: "<channel> <message>",
	perms: ["MANAGE_MESSAGES"],
	slashOptions: [
		{
			name: "channel",
			description: "The channel to send the message in",
			type: 7,
			required: true
		},
		{
			name: "message",
			description: "The message to send",
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
		if (!channel) return message.reply(language.invalid_channel).catch(console.error);
		const msg = args
			? args.slice(1).join(" ")
			: options[1].value;
		
		const m = await channel.send(msg).catch(console.error);
		
		if (m) {
			if (!message.isInteraction) message.react("✅").catch(console.error);
			else message.reply(language.msg_sent, { ephemeral: true }).catch(console.error);
		} else message.channel.send(language.errors.message_send, { ephemeral: true }).catch(console.error);
	}
};

module.exports = command;