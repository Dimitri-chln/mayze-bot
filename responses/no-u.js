const { Message } = require("discord.js");

const command = {
	/**
	 * @param {Message} message 
	 */
	execute: async (message) => {
		const noURegex = /^no (?:you|u)/i;
		if (!noURegex.test(message.content)) return;

		message.channel.messages.fetch({ limit: 2, before: message.id }).then(([ [ , botMsg ], [ , banMsg ] ]) => {
			if (botMsg.author.id !== message.client.user.id) return;
			if (!new RegExp(`<@!?${message.author.id}> has been banned!`).test(botMsg.content)) return;
			if (!new RegExp(`\\*ban <@!?${message.author.id}>`).test(banMsg.content)) return;
			
			message.channel.send(`${banMsg.author} has been banned too!`).catch(console.error);
		}).catch(console.error);
	}
};

module.exports = command;