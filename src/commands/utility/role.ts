import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";

import { Role } from "discord.js";

const command: Command = {
	name: "role",
	description: {
		fr: "Obtenir des informations sur un rôle",
		en: "Get some information about a role",
	},
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

	run: async (interaction, translations) => {
		const role = interaction.options.getRole("role") as Role;

		const roleMembers = role.members.map((m) => m.user.tag);

		interaction.followUp({
			embeds: [
				{
					author: {
						name: role.name,
						iconURL: `https://dummyimage.com/50/${role.hexColor}/${role.hexColor}.png?text=+`,
					},
					color: interaction.guild.me.displayColor,
					description: translations.data.description(
						role.id,
						role.color.toString(),
						role.hexColor,
						role.position.toString(),
						roleMembers.length.toString(),
						roleMembers.join(", ") ?? " ",
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
