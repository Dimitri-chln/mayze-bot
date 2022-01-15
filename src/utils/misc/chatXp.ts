import { Message } from "discord.js";
import Pg from "pg";
import LanguageStrings, { Language } from "../../types/structures/LanguageStrings";
import getLevel from "./getLevel";
import { MAIN_GUILD_ID } from "../../config.json";



export default async function chatXp(database: Pg.Client, message: Message, givenXP: number, language: Language = "en") {
	const languageStrings = new LanguageStrings(__filename, language);
	
	try {
		const { rows } = await database.query(
			`
			INSERT INTO levels (user_id, chat_xp) VALUES ($1, $2)
			ON CONFLICT (user_id)
			DO UPDATE SET
				chat_xp = levels.chat_xp + $2 WHERE levels.user_id = $1
			RETURNING levels.chat_xp
			`,
			[ message.author.id, givenXP ]
		);

		const xp = rows[0].chat_xp;
		const levelInfo = getLevel(xp);

		if (levelInfo.currentXP < givenXP && message.guild.id === MAIN_GUILD_ID)
			message.channel.send(languageStrings.data.level_up(language, message.author.toString(), levelInfo.level.toString())).catch(console.error);
	
	} catch (err) {
		throw err;
	}
}