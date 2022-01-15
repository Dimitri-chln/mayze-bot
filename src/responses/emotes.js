const { Message } = require("discord.js");

const command = {
	/**
	 * @param {Message} message 
	 */
	run: async (message) => {
		const { WEBHOOKS } = require("../config.json");
		if (message.channel.type === "dm" || message.author.bot || !["689164798264606784", "590859421958275092"].includes(message.guild.id)) return;
		if (!WEBHOOKS[message.guild.id]) return;

		const regex = /(?<!<a?):[\w-_]+:(?!>)/g;

		if (/^\+:[\w-_]+:$/.test(message.content)) {
			const [ , emojiName ] = message.content.match(/^\+:([\w-_]+):$/);
			const emoji = message.client.emojis.cache.find(e => e.name === emojiName);
			if (!emoji) return;
			await message.delete().catch(console.error);

			message.channel.messages.fetch({ limit: 1 }).then(messages => {
				messages.first().react(emoji).catch(console.error)
			}).catch(console.error);
			

		} else  if (regex.test(message.content)) {
			const emojiNames = message.content.match(regex).map(e => e.match(/[\w-_]+/)[0]);
			if (!emojiNames.every(emojiName => message.client.emojis.cache.find(emoji => emoji.name === emojiName))) return;
			message.delete().catch(console.error);
			const newMsg = message.content.replace(regex, a => `${message.client.emojis.cache.find(e => e.name === a.match(/[\w-_]+/)[0]).toString()}`).trim();
			
			const webhook = await message.client.fetchWebhook(WEBHOOKS[message.guild.id]).catch(console.error);
			if (!webhook) return;
			if (webhook.channelID !== message.channel.id) await webhook.edit({ channel: message.channel.id });

			webhook.send(newMsg, { avatarURL: message.author.displayAvatarURL(), username: message.member.displayName, disableMentions: "everyone" }).catch(console.error);
		}
	}
};

module.exports = command;