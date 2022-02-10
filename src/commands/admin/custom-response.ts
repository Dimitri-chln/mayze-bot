import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import { DatabaseCustomResponse } from "../../types/structures/Database";

const command: Command = {
	name: "custom-response",
	description: {
		fr: "Gérer les réponses personnalisées",
		en: "Manage custom responses",
	},
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],

	options: {
		fr: [
			{
				name: "add",
				description: "Ajouter une réponse personnalisée",
				type: "SUB_COMMAND",
				options: [
					{
						name: "trigger",
						description: "Le texte qui déclenche la réponse",
						type: "STRING",
						required: true,
					},
					{
						name: "response",
						description: "La réponse à envoyer",
						type: "STRING",
						required: true,
					},
					{
						name: "type",
						description: "Le type de déclencheur",
						type: "INTEGER",
						required: false,
						choices: [
							{
								name: "Contient",
								value: 0,
							},
							{
								name: "Égal à",
								value: 1,
							},
							{
								name: "Regex",
								value: 2,
							},
							{
								name: "Commence par",
								value: 3,
							},
							{
								name: "Finit par",
								value: 4,
							},
						],
					},
				],
			},
			{
				name: "remove",
				description: "Supprimer une réponse personnalisée",
				type: "SUB_COMMAND",
				options: [
					{
						name: "response",
						description: "Le numéro de la réponse",
						type: "INTEGER",
						required: true,
						minValue: 0,
					},
				],
			},
			{
				name: "get",
				description: "Obtenir la liste de toutes les réponses personnalisées",
				type: "SUB_COMMAND",
			},
		],
		en: [
			{
				name: "add",
				description: "Add a custom response",
				type: "SUB_COMMAND",
				options: [
					{
						name: "trigger",
						description: "The text that triggers the response",
						type: "STRING",
						required: true,
					},
					{
						name: "response",
						description: "The response to send",
						type: "STRING",
						required: true,
					},
					{
						name: "type",
						description: "The type of the trigger",
						type: "INTEGER",
						required: false,
						choices: [
							{
								name: "Contains",
								value: 0,
							},
							{
								name: "Equal to",
								value: 1,
							},
							{
								name: "Regex",
								value: 2,
							},
							{
								name: "Starts with",
								value: 3,
							},
							{
								name: "Ends with",
								value: 4,
							},
						],
					},
				],
			},
			{
				name: "remove",
				description: "Remove a custom response",
				type: "SUB_COMMAND",
				options: [
					{
						name: "response",
						description: "The response's number",
						type: "INTEGER",
						required: true,
						minValue: 0,
					},
				],
			},
			{
				name: "list",
				description: "Get the list of all custom responses",
				type: "SUB_COMMAND",
			},
		],
	},

	run: async (interaction, translations) => {
		const subCommand = interaction.options.getSubcommand();

		const { rows: responses }: { rows: DatabaseCustomResponse[] } =
			await Util.database.query("SELECT * FROM custom_response");

		switch (subCommand) {
			case "add": {
				const trigger = interaction.options.getString("trigger");
				const response = interaction.options.getString("response");
				const triggerType = interaction.options.getInteger("type") ?? 0;

				await Util.database.query(
					"INSERT INTO custom_response (trigger, response, trigger_type) VALUES ($1, $2, $3)",
					[trigger, response, triggerType],
				);

				interaction.followUp(translations.strings.response_added());
				break;
			}

			case "remove": {
				const number = interaction.options.getInteger("response");

				if (number < 1 || number > responses.length)
					return interaction.followUp(
						translations.strings.invalid_number(responses.length.toString()),
					);

				const response = responses[number - 1];

				await Util.database.query("DELETE FROM custom_response WHERE id = $1", [
					response.id,
				]);

				interaction.followUp(translations.strings.response_removed());
				break;
			}

			case "list": {
				interaction.followUp({
					embeds: [
						{
							author: {
								name: translations.strings.title(),
								iconURL: interaction.client.user.displayAvatarURL(),
							},
							color: interaction.guild.me.displayColor,
							description: responses
								.map(
									(response, i) =>
										`\`${i + 1}.\` ${
											translations.strings.trigger_types()[
												response.trigger_type
											]
										} \`${response.trigger}\`\n\t→ \`${response.response}\``,
								)
								.join("\n"),
							footer: {
								text: "✨ Mayze ✨",
							},
						},
					],
				});
				break;
			}
		}
	},
};

export default command;
