import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";

const command: Command = {
	name: "8ball",
	description: {
		fr: "Demander quelque chose à Mayze",
		en: "Ask Mayze about something",
	},
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

	run: async (interaction, translations) => {
		const question = interaction.options.getString("question");

		const randomReply =
			translations.data.answers()[
				Math.floor(Math.random() * translations.data.answers().length)
			];

		interaction.followUp(translations.data.reply(question, randomReply));
	},
};

export default command;
