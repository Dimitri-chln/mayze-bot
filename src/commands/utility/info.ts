import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";

const command: Command = {
	name: "info",
	description: {
		fr: "Obtenir quelques informations sur le bot",
		en: "Get some information about the bot",
	},
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],

	options: {
		fr: [],
		en: [],
	},

	run: async (interaction, translations) => {
		interaction.followUp({
			embeds: [
				{
					author: {
						name: interaction.client.user.username,
						iconURL: interaction.client.user.displayAvatarURL(),
					},
					title: translations.data.title(),
					color: interaction.guild.me.displayColor,
					description: translations.data.description(
						Util.owner.tag,
						Math.round(interaction.client.uptime / 1000).toString(),
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
