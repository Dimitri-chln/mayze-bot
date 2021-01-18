const { Message } = require("discord.js");

const command = {
	/**
	 * @param {Message} message 
	 */
	execute: async (message) => {
		const { webhookID } = require("../config.json");
		if (message.author.bot || message.guild.id !== "689164798264606784") return;

		const regex = /\s:[\w-_]+:\s/g;
		if (!regex.test(message.content)) return;
		const emojiNames = message.content.match(regex).map(e => e.replace(/[\s:]/g, ""));
		if (!emojiNames.every(emojiName => message.client.emojis.cache.find(emoji => emoji.name === emojiName))) return;

		const newMsg = message.content.replace(regex, a => message.client.emojis.cache.find(e => e.name === a.replace(/:/g, "")).toString());

		const webhooks = await message.guild.fetchWebhooks().catch(console.error);
		if (!webhooks) return;
		const webhook = webhooks.get(webhookID);
		await webhook.edit({ channel: message.channel.id });

		message.delete().catch(console.error);
		webhook.send(newMsg, { avatarURL: message.author.avatarURL(), username: message.member.nickname || message.author.username}).catch(console.error);
	}
};

module.exports = command;