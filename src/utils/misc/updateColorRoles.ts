import Util from "../../Util";
import { Role, TextChannel } from "discord.js";

export default async function updateColorRoles() {
	const guild = Util.client.guilds.cache.get(Util.config.MAIN_GUILD_ID);
	const channel = guild.channels.cache.get(Util.config.COLORS_CHANNEL_ID) as TextChannel;
	const message = await channel.messages.fetch(Util.config.COLORS_MESSAGE_ID);

	const topRole = guild.roles.cache.get("818531980480086086");
	const bottomRole = guild.roles.cache.get("735809874205737020");

	const colorRoles = guild.roles.cache
		.filter((role) => role.rawPosition > bottomRole.rawPosition && role.rawPosition < topRole.rawPosition)
		.sort((a, b) => b.rawPosition - a.rawPosition);

	message.edit({
		embeds: [
			{
				author: {
					name: "Couleurs disponibles",
					iconURL: guild.iconURL({ dynamic: true }),
				},
				color: Util.config.MAIN_COLOR,
				description: Array.from(colorRoles)
					.map(([, role], i) => `\`${i + 1}.\` ${role.toString()}`)
					.join("\n"),
				footer: {
					text: "✨ Mayze ✨",
				},
			},
		],
	});
}
