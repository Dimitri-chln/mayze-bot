import Event from "../types/Event";
import Util from "../Util";

import { GuildMember, PartialGuildMember } from "discord.js";

const event: Event = {
	name: "guildMemberUpdate",
	once: false,

	run: async (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) => {
		if (newMember.guild.id !== Util.config.MAIN_GUILD_ID) return;
		if (newMember.user.bot) return;

		if (!newMember.roles.cache.equals(oldMember.roles.cache)) {
			const addedRoles = newMember.roles.cache.filter((role) => !oldMember.roles.cache.has(role.id));
			const removedRoles = oldMember.roles.cache.filter((role) => !newMember.roles.cache.has(role.id));

			addedRoles.forEach((role) =>
				Util.database.query("INSERT INTO user_role VALUES ($1, $2)", [newMember.user.id, role.id]),
			);
			removedRoles.forEach((role) =>
				Util.database.query("DELETE FROM user_role WHERE user_id = $1 AND role_id = $2", [newMember.user.id, role.id]),
			);
		}
	},
};

export default event;
