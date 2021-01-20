const { Message } = require("discord.js");

const command = {
	name: "sudo",
	description: "Envoyer un message sous l'identité de quelqu'un d'autre",
	aliases: [],
	args: 2,
	usage: "<utilisateur> <message>",
	ownerOnly: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options) => {
		const { webhookID } = require("../config.json");
		const user = args
			? message.mentions.users.first() || (message.client.findMember(message.guild, args[0]) || {}).user
			: message.client.users.cache.get(options[0].value);
		if (!user) return message.reply("mentionne un utilisateur").catch(console.error);
		const msg = args
			? args.slice(1).join(" ")
			: options[1].value;

		const webhook = await message.client.fetchWebhook(webhookID).catch(console.error);
		if (!webhook) return message.channel.send("Quelque chose s'est mal passé en récupérant le webhook :/").catch(console.error);
		if (webhook.channelID !== message.channel.id) await webhook.edit({ channel: message.channel }).catch(console.error);
		webhook.send(msg, { avatarURL: user.avatarURL(), username: message.guild.member(user).nickname || user.username }).catch(console.error);
		message.delete().catch(console.error);
	}
};

module.exports = command;