import { GuildMember } from "discord.js";
import Pg from "pg";
import LanguageStrings, { Language } from "../../types/structures/LanguageStrings";
import getLevel from "./getLevel";
import { MAIN_GUILD_ID } from "../../config.json";



export default async function voiceXp(database: Pg.Client, member: GuildMember, givenXP: number, language: Language = "en") {
	const languageStrings = new LanguageStrings(__filename, language);
	
	try {
		const { rows } = await database.query(
			`
			INSERT INTO levels (user_id, voice_xp) VALUES ($1, $2)
			ON CONFLICT (user_id)
			DO UPDATE SET
				voice_xp = levels.voice_xp + $2 WHERE levels.user_id = $1
			RETURNING levels.voice_xp
			`,
			[ member.user.id, givenXP ]
		);

		const xp = rows[0].voice_xp;
		const levelInfo = getLevel(xp);

		if (levelInfo.currentXP < givenXP && member.guild.id === MAIN_GUILD_ID)
			member.user.send(languageStrings.data.level_up(language, levelInfo.level.toString())).catch(console.error);
	
	} catch (err) {
		throw err;
	}
}