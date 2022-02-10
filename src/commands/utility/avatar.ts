import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "avatar",
	aliases: [],
	description: {
		fr: "Obtenir la photo de profil d'un utilisateur",
		en: "Get a user's profile picture",
	},
	usage: "",
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],

	options: {
		fr: [
			{
				name: "user",
				description: "L'utilisateur dont tu veux voir la photo de profil",
				type: "USER",
				required: false,
			},
		],
		en: [
			{
				name: "user",
				description: "The user whose profile picture you want to see",
				type: "USER",
				required: false,
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const user = interaction.options.getUser("user") ?? interaction.user;

		interaction.followUp({
			embeds: [
				{
					author: {
						name: translations.strings.title(user.tag),
						iconURL: interaction.client.user.displayAvatarURL(),
					},
					color: interaction.guild.me.displayColor,
					image: {
						url: user.displayAvatarURL({
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
