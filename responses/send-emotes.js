const { Message } = require("discord.js");

const command = {
	/**
	 * @param {Message} message 
	 */
	execute: async (message) => {
		const { WEBHOOK_ID } = require("../config.json");
		if (message.channel.type === "dm" || message.author.bot || message.guild.id !== "689164798264606784") return;

		const regex = /(?:^|\s):[\w-_]+:(?:\s|$)/g;
		if (!regex.test(message.content)) return;
		const emojiNames = message.content.match(regex).map(e => e.match(/[\w-_]+/)[0]);
		if (!emojiNames.every(emojiName => message.guild.emojis.cache.find(emoji => emoji.name === emojiName))) return;

		const newMsg = message.content.replace(regex, a => ` ${message.client.emojis.cache.find(e => e.name === a.match(/[\w-_]+/)[0])} `).trim();

		const webhook = await message.client.fetchWebhook(WEBHOOK_ID).catch(console.error);
		if (!webhook) return;
		await webhook.edit({ channel: message.channel.id });

		message.delete().catch(console.error);
		webhook.send(newMsg, { avatarURL: message.author.avatarURL(), username: message.member.displayName }).catch(console.error);
	}
};

module.exports = command;