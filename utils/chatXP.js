const { Message } = require("discord.js");

const language = {
	get: require("./parseLanguageText"),
	level_up: {
		fr: "**{1}** est passé au niveau **{2}** ! <:foxmayze:763146438120046632>",
		en: "**{1}** is now level **{2}**! <:foxmayze:763146438120046632>"
	}
}

/**
 * @param {Message} message The sent message
 * @param {number} xp The XP to add to the member
 */
async function chatXP(message, xp, languageCode = "en") {
	const getLevel = require("./getLevel");
	
	const { rows } = (await message.client.pg.query(
		"INSERT INTO levels (user_id, chat_xp) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE levels SET chat_xp = chat_xp + $2 WHERE levels.user_id = $1 RETURNING chat_xp",
		[ message.author.id, xp ]
	).catch(console.error)) || {};

	if (rows && rows.length) xp = rows[0].xp;

	const level = getLevel(xp);

	if (level.currentXP < xp && message.guild.id === "689164798264606784") {
		message.channel.send(language.get(language.level_up[languageCode], message.author, level.level)).catch(console.error);
	}
};

module.exports = chatXP;