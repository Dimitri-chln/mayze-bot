import Event from "../types/structures/Event";
import Util from "../Util";

import { Role, TextChannel } from "discord.js";

const event: Event = {
	name: "roleUpdate",
	once: false,

	run: async (oldRole: Role, newRole: Role) => {
		if (newRole.guild.id !== Util.config.MAIN_GUILD_ID) return;

		const channel = newRole.guild.channels.cache.get(Util.config.COLORS_CHANNEL_ID) as TextChannel;
		const message = await channel.messages.fetch(Util.config.COLORS_MESSAGE_ID);

		const topRole = newRole.guild.roles.cache.get("818531980480086086");
		const bottomRole = newRole.guild.roles.cache.get("735809874205737020");

		const colorRoles = newRole.guild.roles.cache
			.filter((role) => role.position > bottomRole.position && role.position < topRole.position)
			.sort((a, b) => b.position - a.position);

		message.edit({
			embeds: [
				{
					author: {
						name: "Couleurs disponibles",
						iconURL: newRole.guild.iconURL({ dynamic: true }),
					},
					color: Util.config.MAIN_COLOR,
					description: Array.from(colorRoles)
						.map(([, role], i) => `\`${i + 1}.\`${role.toString()}`)
						.join("\n"),
					footer: {
						text: "✨ Mayze ✨",
					},
				},
			],
		});
	},
};

export default event;
