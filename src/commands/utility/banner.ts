import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "banner",
	description: {
		fr: "Obtenir la bannière de profil d'un utilisateur",
		en: "Get a user's profile banner",
	},
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],

	options: {
		fr: [
			{
				name: "user",
				description: "L'utilisateur dont tu veux voir la bannière de profil",
				type: "USER",
				required: false,
			},
		],
		en: [
			{
				name: "user",
				description: "The user whose profile banner you want to see",
				type: "USER",
				required: false,
			},
		],
	},

	run: async (interaction, translations) => {
		const user = interaction.options.getUser("user") ?? interaction.user;
		await user.fetch(true);

		interaction.followUp({
			embeds: [
				{
					author: {
						name: translations.strings.title(user.tag),
						iconURL: interaction.client.user.displayAvatarURL(),
					},
					color: interaction.guild.me.displayColor,
					image: {
						url: user.bannerURL({
							size: 4096,
							dynamic: true,
						}),
					},
					footer: {
						text: "✨ Mayze ✨",
					},
				},
			],
		});
	},
};

export default command;
