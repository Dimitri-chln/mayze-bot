import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";



const command: Command = {
	name: "eval",
	description: {
		fr: "Évaluer une expression",
		en: "Evaluate an expression"
	},
	userPermissions: [],
	botPermissions: [],

	options: {
		fr: [
			{
				name: "expression",
				description: "L'expression à evaluer",
				type: "STRING",
				required: true
			}
		],
		en: [
			{
				name: "expression",
				description: "The expression to evaluate",
				type: "STRING",
				required: true
			}
		]
	},

	run: async (interaction: CommandInteraction, translations: Translations) => {
		const expression = interaction.options.getString("expression");
		
		try {
			eval(expression);
		} catch (err) {
			console.error(err);
			interaction.reply({
				content: `__**Error:**__\`\`\`\n${err}\n\`\`\``,
				ephemeral: true
			});
		};
	}
};



export default command;