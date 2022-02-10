import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "say",
	description: {
		fr: "Faire dire n'importe quoi au bot",
		en: "Make the bot say anything",
	},
	userPermissions: [],
	botPermissions: [],

	options: {
		fr: [
			{
				name: "text",
				description: "Le texte que le bot doit envoyer",
				type: "STRING",
				required: true,
			},
		],
		en: [
			{
				name: "text",
				description: "The text that the bot will send",
				type: "STRING",
				required: true,
			},
		],
	},

	run: async (interaction, translations) => {
		const text = interaction.options.getString("text");

		interaction
			.followUp(
				// Invisible character "ㅤ"
				"\u3164",
			)
			.then(interaction.deleteReply);

		interaction.channel.send({
			content: text,
		});
	},
};

export default command;
