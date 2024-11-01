import Util from "../../Util";

import { DatabaseGuildConfig } from "../../types/Database";

export default async function initializeGuildConfigs() {
	const { rows: guildConfigs }: { rows: DatabaseGuildConfig[] } = await Util.database.query(
		"SELECT * FROM guild_config",
	);

	for (const guildConfig of guildConfigs) {
		Util.guildConfigs.set(guildConfig.guild_id, {
			locale: guildConfig.locale,
			jailRoleId: guildConfig.jail_role_id,
		});
	}

	Util.client.guilds.cache
		.filter((guild) => !Util.guildConfigs.has(guild.id))
		.forEach((newGuild) => {
			Util.guildConfigs.set(newGuild.id, {
				locale: newGuild.preferredLocale,
			});

			Util.database.query("INSERT INTO guild_config VALUES ($1, $2)", [newGuild.id, newGuild.preferredLocale]);
		});
}
