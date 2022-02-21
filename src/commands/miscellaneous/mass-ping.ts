import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import { TextChannel } from "discord.js";

const command: Command = {
	name: "mass-ping",
	aliases: [],
	description: {
		fr: "Mentionner un utilisateur en boucle",
		en: "Ping a user repeatedly",
	},
	usage: "",
	userPermissions: ["MANAGE_MESSAGES"],
	botPermissions: ["EMBED_LINKS"],
	guildIds: [Util.config.MAIN_GUILD_ID, "724530039781326869"],

	options: {
		fr: [
			{
				name: "user",
				description: "L'utilisateur à mentionner",
				type: "USER",
				required: true,
			},
			{
				name: "number",
				description: "Le nombre de message à envoyer",
				type: "INTEGER",
				required: true,
				minValue: 1,
				maxValue: 1000,
			},
			{
				name: "message",
				description: "Le message à rajouter à chaque mention",
				type: "STRING",
				required: false,
			},
		],
		en: [
			{
				name: "user",
				description: "The user to ping",
				type: "USER",
				required: true,
			},
			{
				name: "number",
				description: "The number of messages to send",
				type: "INTEGER",
				required: true,
				minValue: 1,
				maxValue: 1000,
			},
			{
				name: "message",
				description: "The message to add to each ping",
				type: "STRING",
				required: false,
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const user = interaction.options.getUser("user");
		const number = interaction.options.getInteger("number");
		const message = interaction.options.getString("message");

		if (number < 1 || (!message && number > 1000) || (message && number > 100))
			return interaction.followUp(
				translations.strings.invalid_number(Boolean(message)),
			);

		interaction.followUp(translations.strings.sending());

		const messages: Promise<Message>[] = [];

		for (let i = 0; i < number; i++) {
			messages.push(
				interaction.channel.send({
					content: `${user.toString()} ${message ?? ""}`,
					allowedMentions: {
						users: [user.id],
					},
				}),
			);
		}

		if (!message)
			await (interaction.channel as TextChannel).bulkDelete(
				await Promise.all(messages),
			);

		interaction.editReply(translations.strings.done());
	},
};

export default command;
