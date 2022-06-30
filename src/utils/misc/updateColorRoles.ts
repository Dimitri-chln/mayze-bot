import Util from "../../Util";
import { TextChannel } from "discord.js";

export default async function updateColorRoles() {
	const channel = Util.mainGuild.channels.cache.get(Util.config.COLORS_CHANNEL_ID) as TextChannel;
	const message = await channel.messages.fetch(Util.config.COLORS_MESSAGE_ID);

	message.edit({
		embeds: [
			{
				author: {
					name: "Couleurs disponibles",
					iconURL: Util.mainGuild.iconURL({ dynamic: true }),
				},
				color: Util.config.MAIN_COLOR,
				fields: Util.colorGroups.map((group) => {
					return {
						name: "\u200b",
						value: group
							.map(
								(role) =>
									`\`${
										Array.from(Util.colorRoles)
											.map((r) => r[0])
											.indexOf(role.id) + 1
									}.\` ${role.toString()}`,
							)
							.join("\n"),
						inline: true,
					};
				}),
				footer: {
					text: "✨ Mayze ✨",
				},
			},
		],
	});
}
