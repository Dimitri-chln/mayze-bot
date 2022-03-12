import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import { Role } from "discord.js";

const command: Command = {
	name: "role",
	aliases: [],
	description: {
		fr: "Obtenir des informations sur un rôle",
		en: "Get some information about a role",
	},
	usage: "",
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],

	options: {
		fr: [
			{
				name: "role",
				description: "Le rôle sur lequel obtenir des informations",
				type: "ROLE",
				required: true,
			},
		],
		en: [
			{
				name: "role",
				description: "The role which to get information about",
				type: "ROLE",
				required: true,
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const role = interaction.options.getRole("role", true) as Role;

		const roleMembers = role.members.map((m) => m.user.tag);

		interaction.followUp({
			embeds: [
				{
					author: {
						name: role.name,
						iconURL: `https://dummyimage.com/50/${role.hexColor.replace("#", "")}/${role.hexColor.replace(
							"#",
							"",
						)}.png?text=%20`,
					},
					color: interaction.guild.me.displayColor,
					description: translations.strings.description(
						role.id,
						role.color.toString(),
						role.hexColor,
						role.position.toString(),
						roleMembers.length.toString(),
						roleMembers.length ? roleMembers.join(", ") : "∅",
					),
					footer: {
						text: "✨ Mayze ✨",
					},
				},
			],
		});
	},
};

export default command;
