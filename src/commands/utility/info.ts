import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import LanguageStrings from "../../types/structures/LanguageStrings";
import Util from "../../Util";



const command: Command = {
	name: "info",
	description: {
		fr: "Obtenir quelques informations sur le bot",
		en: "Get some information about the bot"
	},
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],
	
	options: {
		fr: [],
		en: []
	},

	run: async (interaction: CommandInteraction, languageStrings: LanguageStrings) => {
		interaction.reply({
			embeds: [
				{
					author: {
						name: interaction.client.user.username,
						iconURL: interaction.client.user.displayAvatarURL()
					},
					title: languageStrings.data.title(),
					color: interaction.guild.me.displayColor,
					description: languageStrings.data.description(
						Util.prefix,
						Util.owner.tag,
						Util.version,
						Math.round(interaction.client.uptime / 1000).toString()
					),
					footer: {
						text: "✨ Mayze ✨"
					}
				}
			]
		});
	}
};



export default command;