const { Message } = require("discord.js");

const command = {
	/**
	 * @param {Message} message 
	 */
	execute: async (message) => {
		const koya = message.guild.members.cache.get("276060004262477825");
		if (koya && koya.user.presence.status !== 'offline') return;
		if (!/^(?:(?:k|K)oya\s?)|(?:\^\^)afk/.test(message.content)) return;

		const afk = message.client.commands.get("afk");
		try {
			afk.execute(message, message.content.split(/ +/g).slice(1));
		} catch (err) {
			console.error(err);
		}
	}
};

module.exports = command;