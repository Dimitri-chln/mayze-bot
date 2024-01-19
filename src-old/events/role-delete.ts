import Event from "../types/structures/Event";
import Util from "../Util";

import { Role } from "discord.js";
import updateColorRoles from "../utils/misc/updateColorRoles";

const event: Event = {
	name: "roleDelete",
	once: false,

	run: async (oldRole: Role, newRole: Role) => {
		if (newRole.guild.id === Util.config.MAIN_GUILD_ID) updateColorRoles();
	},
};

export default event;
