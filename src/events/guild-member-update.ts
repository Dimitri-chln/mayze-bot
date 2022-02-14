import Event from "../types/structures/Event";
import Util from "../Util";

import { GuildMember, PartialGuildMember } from "discord.js";

const event: Event = {
	name: "guildMemberUpdate",
	once: false,

	run: async (
		oldMember: GuildMember | PartialGuildMember,
		newMember: GuildMember | PartialGuildMember,
	) => {
		if (newMember.guild.id !== Util.config.MAIN_GUILD_ID) return;
		if (newMember.user.bot) return;

		if (!newMember.roles.cache.equals(oldMember.roles.cache)) {
			Util.database.query(
				`
				INSERT INTO member_roles VALUES ($1, $2)
				ON CONFLICT (user_id)
				DO UPDATE SET roles = $2
				WHERE member_roles.user_id = EXCLUDED.user_id
				`,
				[
					newMember.user.id,
					newMember.roles.cache
						.filter((role) => role.id !== newMember.guild.id)
						.map((role) => role.id),
				],
			);
		}
	},
};

export default event;
