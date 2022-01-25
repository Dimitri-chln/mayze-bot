import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";



const command: Command = {
	name: "say",
	description: {
		fr: "Faire dire n'importe quoi au bot",
		en: "Make the bot say anything"
	},
	userPermissions: [],
	botPermissions: [],
	
	options: {
		fr: [
			{
				name: "text",
				description: "Le texte que le bot doit envoyer",
				type: "STRING",
				required: true
			}
		],
		en: [
			{
				name: "text",
				description: "The text that the bot will send",
				type: "STRING",
				required: true
			}
		]
	},
	
	run: async (interaction: CommandInteraction, translations: Translations) => {
		const text = interaction.options.getString("text");
		
		interaction.reply({
			content: "<a:blackCheck:803603780666523699>",
			ephemeral: true
		});
		
		interaction.channel.send({
			content: text
		});
	}
};



export default command;