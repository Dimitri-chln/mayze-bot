const { Message } = require("discord.js");

const command = {
	name: "sudo",
	description: "Envoyer un message sous l'identité de quelqu'un d'autre",
	aliases: [],
	args: 2,
	usage: "<utilisateur> <message>",
	botPerms: ["MANAGE_MESSAGES", "MANAGE_WEBHOOKS"],
	ownerOnly: true,
	allowedUsers: ["463358584583880704"],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, language, languageCode) => {
		const { WEBHOOKS } = require("../config.json");
		if (!WEBHOOKS[message.guild.id]) return;
		
		const user = args
			? message.mentions.users.first() || (message.client.findMember(message.guild, args[0]) || {}).user
			: message.client.users.cache.get(options[0].value);
		if (!user) return message.reply("mentionne un utilisateur").catch(console.error);
		const msg = args
			? args.slice(1).join(" ")
			: options[1].value;
			
		const webhook = await message.client.fetchWebhook(WEBHOOKS[message.guild.id]).catch(console.error);
		if (!webhook) return message.channel.send("Quelque chose s'est mal passé en récupérant le webhook :/").catch(console.error);
		if (webhook.channelID !== message.channel.id) await webhook.edit({ channel: message.channel }).catch(console.error);
		webhook.send(msg, { avatarURL: user.displayAvatarURL(), username: message.guild.member(user).displayName, disableMentions: "everyone" }).catch(console.error);
		message.delete().catch(console.error);
	}
};

module.exports = command;