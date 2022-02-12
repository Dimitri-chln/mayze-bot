import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "eval",
	aliases: [],
	description: {
		fr: "Évaluer une expression",
		en: "Evaluate an expression",
	},
	usage: "",
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

	runInteraction: async (interaction, translations) => {
		const expression = interaction.options.getString("expression");

		await interaction.followUp(translations.strings.executing());

		try {
			eval(expression);
		} catch (err) {
			console.error(err);
			interaction.followUp(translations.strings.error(err));
		}
	},
};

export default command;
