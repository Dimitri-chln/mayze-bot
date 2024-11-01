import Event from "../types/Event";
import Util from "../Util";

import { GuildMember, PermissionFlagsBits } from "discord.js";
import { DatabaseUserRole } from "../types/Database";

const event: Event = {
	name: "guildMemberAdd",
	once: false,

	run: async (member: GuildMember) => {
		if (member.guild.id !== Util.config.MAIN_GUILD_ID) return;
		if (member.user.bot) return;
		if (!member.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) return;

		let defaultRoleIds = [
			"818531980480086086", // Couleurs
			"735809874205737020", // Clan
			"735810286719598634", // Ranks
			"735810462872109156", // Rôles custom
			"759694957132513300", // Loup garou
		];

		const { rows }: { rows: Pick<DatabaseUserRole, "role_id">[] } = await Util.database.query(
			"SELECT role_id FROM user_role WHERE user_id = $1",
			[member.user.id],
		);
		const roleIds = rows.map((row) => row.role_id);
		if (roleIds.length) defaultRoleIds = defaultRoleIds.concat(roleIds);

		member.roles.add(defaultRoleIds);
	},
};

export default event;
