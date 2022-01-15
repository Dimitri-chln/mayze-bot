import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import LanguageStrings from "../../types/structures/LanguageStrings";
import Util from "../../Util";



const command: Command = {
	name: "edit-snipe",
	description: {
		fr: "Envoyer sur le salon le message que quelqu'un vient de modifier",
		en: "Send a message from this channel that was edited"
	},
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],

	options: {
		fr: [],
		en: []
	},
	
	run: async (interaction: CommandInteraction, languageStrings: LanguageStrings) => {
		const snipedMsg = Util.sniping.editedMessages.get(interaction.channel.id);
		if (!snipedMsg) return interaction.reply({
			content: languageStrings.data.no_message(),
			ephemeral: true
		});
		
		interaction.reply({
			embeds: [
				{
					author: {
						name: snipedMsg.author.tag,
						iconURL: snipedMsg.author.avatar
					},
					color: interaction.guild.me.displayColor,
					description: snipedMsg.content,
					footer: {
						text: "✨ Mayze ✨"
					}
				}
			]
		});
	}
};



export default command;