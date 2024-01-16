import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import { TextChannel } from "discord.js";

const command: Command = {
	name: "clear",
	aliases: [],
	description: {
		fr: "Supprimer des messages du salon actuel",
		en: "Delete messages from the current channel",
	},
	usage: "",
	userPermissions: ["MANAGE_MESSAGES"],
	botPermissions: ["MANAGE_MESSAGES"],

	options: {
		fr: [
			{
				name: "number",
				description: "Le nombre de messages à supprimer",
				type: "INTEGER",
				required: true,
				minValue: 1,
				maxValue: 100,
			},
			{
				name: "user",
				description: "Ne supprimer que les messages de l'utilisateur donné",
				type: "USER",
				required: false,
			},
			{
				name: "bot",
				description: "Ne supprimer que les messages envoyés par des bots",
				type: "BOOLEAN",
				required: false,
			},
			{
				name: "pattern",
				description: "Ne supprimer que les messages qui correspondent au regex donné",
				type: "STRING",
				required: false,
			},
		],
		en: [
			{
				name: "number",
				description: "The number of messages to delete",
				type: "INTEGER",
				required: true,
				minValue: 1,
				maxValue: 99,
			},
			{
				name: "user",
				description: "Delete only messages from the given user",
				type: "USER",
				required: false,
			},
			{
				name: "bot",
				description: "Delete only messages from bots",
				type: "BOOLEAN",
				required: false,
			},
			{
				name: "pattern",
				description: "Delete only messages matching the given regex",
				type: "STRING",
				required: false,
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const number = interaction.options.getInteger("number", true);
		if (isNaN(number) || number <= 0 || number > 100)
			return interaction.followUp(translations.strings.invalid_number());

		let messages = await interaction.channel.messages.fetch({ limit: 100 });

		const user = interaction.options.getUser("user", false);
		if (user) messages = messages.filter((msg) => msg.author.id === user.id);

		const bot = interaction.options.getBoolean("bot", false);
		if (bot !== null) messages = messages.filter((msg) => msg.author.bot === bot);

		const regex = interaction.options.getString("regex", false);
		if (regex) messages = messages.filter((msg) => new RegExp(regex, "i").test(msg.content));

		const reply = await interaction.followUp(translations.strings.cleared(number.toString(), number > 1));

		messages.delete(reply.id);

		await (interaction.channel as TextChannel).bulkDelete(messages.first(number), true);
	},
};

export default command;
