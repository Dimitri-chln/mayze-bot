import Util from "../../Util";

export default async function initializeVoiceXp() {
	/*setInterval(() => {
		Util.client.guilds.cache.forEach(async (guild) => {
			const translations = (await new Translations("index_level").init()).data[
				Util.guildConfigs.get(guild.id).language
			];

			guild.members.cache
				.filter((m) => m.voice.channelId && !m.user.bot)
				.forEach(async (member) => {
					if (member.voice.channel.members.size < 2) return;

					let newXP = Util.config.BASE_VOICE_XP * member.voice.channel.members.filter((m) => !m.user.bot).size;

					if (member.voice.deaf) newXP *= 0;
					if (member.voice.mute) newXP *= 0.5;
					if (member.voice.streaming && member.voice.channel.members.filter((m) => !m.user.bot).size > 1) newXP *= 3;
					if (member.voice.selfVideo && member.voice.channel.members.filter((m) => !m.user.bot).size > 1) newXP *= 5;

					try {
						const {
							rows: [{ voice_xp: xp }],
						}: { rows: DatabaseLevel[] } = await Util.database.query(
							`
					INSERT INTO level (user_id, voice_xp) VALUES ($1, $2)
					ON CONFLICT (user_id)
					DO UPDATE SET
						voice_xp = level.voice_xp + $2 WHERE level.user_id = $1
					RETURNING level.voice_xp
					`,
							[member.user.id, newXP],
						);

						const levelInfo = getLevel(xp);

						if (levelInfo.currentXP < newXP && member.guild.id === Util.config.MAIN_GUILD_ID)
							member.user.send(translations.strings.voice_level_up(levelInfo.level.toString()));
					} catch (err) {
						console.error(err);
					}
				});
		});
	}, 60_000);*/
}
