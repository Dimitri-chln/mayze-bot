const { GuildMember } = require("discord.js");

const language = {
	get: require("./parseLanguageText"),
	level_up: {
		fr: "Tu es passé au niveau **{2}** en chat vocal ! <:foxmayze:763146438120046632>",
		en: "You are now level **{2}** in voice chatting! <:foxmayze:763146438120046632>"
	}
}

/**
 * @param {GuildMember} member The member receiving XP
 * @param {number} xp The XP to add to the member
 */
async function voiceXP(member, xp, languageCode = "en") {
	const newXP = xp;
	const getLevel = require("./getLevel");
	
	const { rows } = (await member.client.pg.query(
		"INSERT INTO levels (user_id, voice_xp) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET voice_xp = levels.voice_xp + $2 WHERE levels.user_id = $1 RETURNING levels.voice_xp",
		[ member.user.id, xp ]
	).catch(console.error)) || {};

	if (rows && rows.length) xp = rows[0].voice_xp;

	const level = getLevel(xp);

	console.log(`Gave ${xp}XP to ${member.user.tag} in #${member.voice.channel.name}`);

	// if (level.currentXP < newXP && member.guild.id === "689164798264606784") {
	// 	member.send(language.get(language.level_up[languageCode], member.user, level.level)).catch(console.error);
	// }
};

module.exports = voiceXP;