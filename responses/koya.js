const { Message } = require("discord.js");

function pickLanguage(data = {}, language = "en") {
	return Object.keys(data)
		.reduce((acc, key) => {
			acc[key] = data[key][language] || data[key].en;
			return acc;
		}, {});
}

const command = {
	/**
	 * @param {Message} message 
	 */
	execute: async (message) => {
		const languages = require("../utils/languages");

		if (message.channel.type === "dm") return;
		const koya = message.guild.members.cache.get("276060004262477825");
		if (koya && koya.user.presence.status !== "offline") return;

		let lang = "en";
		const res = await message.client.pg.query(`SELECT * FROM languages WHERE guild_id = '${message.guild.id}'`).catch(console.error);
		if (res && res.rows.length) lang = res.rows[0].language_code;
		const language = { get: languages.get, errors: pickLanguage(languages.data.errors, lang), ...pickLanguage(languages.data["afk"], lang) };
		

		const afkRegex = /^(?:(?:k|K)oya\s?)|(?:\^\^)afk/;
		if (afkRegex.test(message.content)) {
			const afk = message.client.commands.get("afk");
			try {
				afk.execute(message, message.content.replace(afkRegex, "").trim().split(/ +/g), null, language, lang);
			} catch (err) {
				console.error(err);
			}
		}
	}
};

module.exports = command;