import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "8ball",
	aliases: [],
	description: {
		fr: "Demander quelque chose à Mayze",
		en: "Ask Mayze about something",
	},
	usage: "",
	userPermissions: [],
	botPermissions: [],

	options: {
		fr: [
			{
				name: "question",
				description: "La question à poser",
				type: "STRING",
				required: true,
			},
		],
		en: [
			{
				name: "question",
				description: "The question to ask",
				type: "STRING",
				required: true,
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const question = interaction.options.getString("question", true);

		const randomReply =
			translations.strings.answers()[
				Math.floor(Math.random() * translations.strings.answers().length)
			];

		interaction.followUp(translations.strings.reply(question, randomReply));
	},
};

export default command;
