import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
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
	
	run: async (interaction: CommandInteraction, translations: Translations) => {
		const snipedMessage = Util.sniping.editedMessages.get(interaction.channel.id);
		if (!snipedMessage) return interaction.reply({
			content: translations.data.no_message(),
			ephemeral: true
		});
		
		interaction.reply({
			embeds: [
				{
					author: {
						name: snipedMessage.author.tag,
						iconURL: snipedMessage.author.avatar
					},
					color: interaction.guild.me.displayColor,
					description: snipedMessage.content,
					footer: {
						text: "✨ Mayze ✨"
					}
				}
			]
		});
	}
};



export default command;