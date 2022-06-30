import Util from "../../Util";
import { Role, TextChannel } from "discord.js";
import groupArrayBy from "./groupArrayBy";

export default async function updateColorRoles() {
	const channel = Util.mainGuild.channels.cache.get(Util.config.COLOR_CHANNEL_ID) as TextChannel;
	const message = await channel.messages.fetch(Util.config.COLOR_MESSAGE_ID);

	const colorRolesGroups: Role[][] = groupArrayBy(
		Array.from(Util.colorRoles).map((r) => r[1]),
		25,
	);

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
		components: colorRolesGroups.map((roleGroup, i) => {
			return {
				type: "ACTION_ROW",
				components: [
					{
						type: "SELECT_MENU",
						customId: `color_select_menu_${i}`,
						placeholder: `Couleurs ${25 * i + 1} à ${25 * i + 25}`,
						options: roleGroup.map((role, j) => {
							return {
								label: `${25 * i + j + 1} - ${role.name}`,
								value: role.id,
							};
						}),
					},
				],
			};
		}),
	});
}
