import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "afk",
	aliases: [],
	description: {
		fr: "Ajouter un statut AFK",
		en: "Set an AFK status",
	},
	usage: "",
	userPermissions: [],
	botPermissions: [],

	options: {
		fr: [
			{
				name: "message",
				description: "Le message a envoyer lorsque tu es mentionné",
				type: "STRING",
				required: false,
			},
		],
		en: [
			{
				name: "message",
				description: "The message to send when you are mentionned",
				type: "STRING",
				required: false,
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const message = interaction.options.getString("message")?.replace(/^./, (a) => a.toUpperCase()) ?? "";

		Util.database.query(
			`
			INSERT INTO afk VALUES ($1, $2, $3)
			ON CONFLICT (user_id)
			DO UPDATE SET message = $3
			WHERE afk.user_id = EXCLUDED.user_id
			`,
			[interaction.user.id, new Date().toISOString(), message],
		);

		interaction.followUp(translations.strings.afk_message(interaction.user.toString(), message));
	},
};

export default command;
