import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "banner",
	aliases: [],
	description: {
		fr: "Obtenir la bannière de profil d'un utilisateur",
		en: "Get a user's profile banner",
	},
	usage: "",
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

	runInteraction: async (interaction, translations) => {
		const user = interaction.options.getUser("user", false) ?? interaction.user;
		await user.fetch(true);

		interaction.followUp({
			embeds: [
				{
					author: {
						name: translations.strings.author(user.tag),
						iconURL: user.displayAvatarURL({ dynamic: true }),
					},
					color: interaction.guild.me.displayColor,
					image: {
						url:
							user.bannerURL({
								size: 4096,
								dynamic: true,
							}) ??
							`https://dummyimage.com/640x16:9/${user.hexAccentColor.replace(
								"#",
								"",
							)}/00.png?text=%20`,
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
