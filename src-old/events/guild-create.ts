import Event from "../types/structures/Event";
import Util from "../Util";

import { Guild } from "discord.js";

const event: Event = {
	name: "guildCreate",
	once: false,

	run: async (guild: Guild) => {
		Util.database.query(
			`
			INSERT INTO guild_config VALUES ($1)
			ON CONFLICT (guild_id)
			DO NOTHING
			`,
			[guild.id],
		);
	},
};

export default event;
