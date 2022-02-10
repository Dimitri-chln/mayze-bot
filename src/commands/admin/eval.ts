import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "eval",
	description: {
		fr: "Évaluer une expression",
		en: "Evaluate an expression",
	},
	userPermissions: [],
	botPermissions: [],

	options: {
		fr: [
			{
				name: "expression",
				description: "L'expression à evaluer",
				type: "STRING",
				required: true,
			},
		],
		en: [
			{
				name: "expression",
				description: "The expression to evaluate",
				type: "STRING",
				required: true,
			},
		],
	},

	run: async (interaction, translations) => {
		const expression = interaction.options.getString("expression");

		await interaction.followUp("...");

		try {
			eval(expression);
		} catch (err) {
			console.error(err);
			interaction.followUp(`__**Error:**__\`\`\`\n${err}\n\`\`\``);
		}
	},
};

export default command;
