import Event from "../types/structures/Event";
import Util from "../Util";

import { Collection, GuildMember } from "discord.js";
import { DatabaseMemberRoles } from "../types/structures/Database";

const event: Event = {
	name: "guildMemberAdd",
	once: false,

	run: async (member: GuildMember) => {
		if (member.guild.id !== Util.config.MAIN_GUILD_ID) return;
		if (member.user.bot) return;

		let roleIds = [
			"735809874205737020",
			"735810286719598634",
			"735810462872109156",
			"759694957132513300",
		];

		const {
			rows: [memberRoles],
		}: { rows: DatabaseMemberRoles[] } = await Util.database.query(
			"SELECT * FROM member_roles WHERE user_id = $1",
			[member.user.id],
		);

		if (memberRoles) roleIds = roleIds.concat(memberRoles.roles);

		member.roles.add(roleIds);
	},
};

export default event;
