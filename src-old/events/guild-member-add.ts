import Event from "../types/structures/Event";
import Util from "../Util";

import { GuildMember } from "discord.js";
import { DatabaseMemberRoles } from "../types/structures/Database";

const event: Event = {
	name: "guildMemberAdd",
	once: false,

	run: async (member: GuildMember) => {
		if (member.guild.id !== Util.config.MAIN_GUILD_ID) return;
		if (member.user.bot) return;
		if (!member.guild.me.permissions.has("MANAGE_ROLES")) return;

		let roleIds = [
			"818531980480086086", // Couleurs
			"735809874205737020", // Clan
			"735810286719598634", // Ranks
			"735810462872109156", // Rôles custom
			"759694957132513300", // Loup garou
		];

		const {
			rows: [memberRoles],
		}: { rows: DatabaseMemberRoles[] } = await Util.database.query("SELECT * FROM member_roles WHERE user_id = $1", [
			member.user.id,
		]);

		if (memberRoles) roleIds = roleIds.concat(memberRoles.roles);

		member.roles.add(roleIds);
	},
};

export default event;
