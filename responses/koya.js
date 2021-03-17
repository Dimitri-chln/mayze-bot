const { Message } = require("discord.js");

const command = {
	/**
	 * @param {Message} message 
	 */
	execute: async (message) => {
		const koya = message.guild.members.cache.get("276060004262477825");
		if (koya && koya.user.presence.status !== "offline") return;

		const afkRegex = /^(?:(?:k|K)oya\s?)|(?:\^\^)afk/;
		if (afkRegex.test(message.content)) {
			const afk = message.client.commands.get("afk");
			try {
				afk.execute(message, message.content.replace(afkRegex, "").trim().split(/ +/g));
			} catch (err) {
				console.error(err);
			}
		}
	}
};

module.exports = command;