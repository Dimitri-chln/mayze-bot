import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";

import dhms from "dhms";
import formatTime from "../../utils/misc/formatTime";

const command: Command = {
	name: "remind-me",
	description: {
		fr: "Gérer tes rappels",
		en: "Manage your reminders",
	},
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],

	options: {
		fr: [
			{
				name: "list",
				description: "Obtenir la liste de tes rappels",
				type: "SUB_COMMAND",
			},
			{
				name: "create",
				description: "Créer un rappel",
				type: "SUB_COMMAND_GROUP",
				options: [
					{
						name: "in",
						description: "Créer un rappel à partir d'une durée",
						type: "SUB_COMMAND",
						options: [
							{
								name: "duration",
								description:
									"La durée dans laquelle le rappel doit s'activer",
								type: "STRING",
								required: true,
							},
							{
								name: "reminder",
								description: "Le rappel",
								type: "STRING",
								required: true,
							},
						],
					},
					{
						name: "on",
						description: "Créer un rappel à partir d'une date",
						type: "SUB_COMMAND",
						options: [
							{
								name: "date",
								description:
									"La date à laquelle le rappel doit s'activer",
								type: "STRING",
								required: true,
							},
							{
								name: "reminder",
								description: "Le rappel",
								type: "STRING",
								required: true,
							},
						],
					},
					{
						name: "each",
						description:
							"Créer un rappel qui se répétera à intervalles réguliers",
						type: "SUB_COMMAND",
						options: [
							{
								name: "duration",
								description: "La durée entre chaque activation",
								type: "STRING",
								required: true,
							},
							{
								name: "reminder",
								description: "Le rappel",
								type: "STRING",
								required: true,
							},
						],
					},
				],
			},
			{
				name: "remove",
				description: "Retirer un rappel",
				type: "SUB_COMMAND",
				options: [
					{
						name: "reminder",
						description: "Le numéro du rappel",
						type: "INTEGER",
						required: true,
						minValue: 1,
					},
				],
			},
		],
		en: [
			{
				name: "list",
				description: "Get the list of your reminders",
				type: "SUB_COMMAND",
			},
			{
				name: "create",
				description: "Create a reminder",
				type: "SUB_COMMAND_GROUP",
				options: [
					{
						name: "in",
						description: "Create a reminder based on a duration",
						type: "SUB_COMMAND",
						options: [
							{
								name: "duration",
								description:
									"The time before the reminder triggers",
								type: "STRING",
								required: true,
							},
							{
								name: "reminder",
								description: "The reminder",
								type: "STRING",
								required: true,
							},
						],
					},
					{
						name: "on",
						description: "Create a reminder based on a date",
						type: "SUB_COMMAND",
						options: [
							{
								name: "date",
								description:
									"The date which the reminder will trigger at",
								type: "STRING",
								required: true,
							},
							{
								name: "reminder",
								description: "The reminder",
								type: "STRING",
								required: true,
							},
						],
					},
					{
						name: "each",
						description:
							"Create a reminder that will repeat based on a duration",
						type: "SUB_COMMAND",
						options: [
							{
								name: "duration",
								description: "The time between each trigger",
								type: "STRING",
								required: true,
							},
							{
								name: "reminder",
								description: "The reminder",
								type: "STRING",
								required: true,
							},
						],
					},
				],
			},
			{
				name: "remove",
				description: "Remove a reminder",
				type: "SUB_COMMAND",
				options: [
					{
						name: "reminder",
						description: "The reminder's number",
						type: "INTEGER",
						required: true,
						minValue: 1,
					},
				],
			},
		],
	},

	run: async (interaction, translations) => {
		const subCommand = interaction.options.getSubcommand();

		const { rows: reminders } = await Util.database.query(
			"SELECT * FROM reminders WHERE user_id = $1",
			[interaction.user.id],
		);

		switch (subCommand) {
			case "in": {
				const duration: number = dhms(
					interaction.options.getString("duration"),
				);

				if (!duration)
					return interaction.followUp({
						content: translations.data.invalid_duration(),
						ephemeral: true,
					});

				const date = new Date(Date.now() + duration);

				let content = interaction.options.getString("reminder");
				if (!/^https?:\/\//.test(content))
					content = content.replace(/^./, (a) => a.toUpperCase());

				await Util.database.query(
					"INSERT INTO reminders (user_id, timestamp, content) VALUES ($1, $2, $3)",
					[interaction.user.id, date, content],
				);

				interaction.followUp(
					translations.data.created(
						formatTime(duration, translations.language),
						content,
					),
				);
				break;
			}

			case "on": {
				const date = new Date(
					interaction.options.getString("duration"),
				);

				if (!date)
					return interaction.followUp({
						content: translations.data.invalid_date(),
						ephemeral: true,
					});

				const duration = date.valueOf() - Date.now();

				let content = interaction.options.getString("reminder");
				if (!/^https?:\/\//.test(content))
					content = content.replace(/^./, (a) => a.toUpperCase());

				await Util.database.query(
					"INSERT INTO reminders (user_id, timestamp, content) VALUES ($1, $2, $3)",
					[interaction.user.id, date, content],
				);

				interaction.followUp(
					translations.data.created(
						formatTime(duration, translations.language),
						content,
					),
				);
				break;
			}

			case "each": {
				const duration: number = dhms(
					interaction.options.getString("duration"),
				);

				if (!duration)
					return interaction.followUp({
						content: translations.data.invalid_duration(),
						ephemeral: true,
					});

				const date = new Date(Date.now() + duration);

				let content = interaction.options.getString("reminder");
				if (!/^https?:\/\//.test(content))
					content = content.replace(/^./, (a) => a.toUpperCase());

				await Util.database.query(
					"INSERT INTO reminders (user_id, timestamp, content, repeat) VALUES ($1, $2, $3, $4)",
					[interaction.user.id, date, content, duration],
				);

				interaction.followUp(
					translations.data.created(
						formatTime(duration, translations.language),
						content,
					),
				);
				break;
			}

			case "remove": {
				const number = interaction.options.getInteger("reminder");
				if (number < 1 || number > reminders.length)
					return interaction.followUp({
						content: translations.data.invalid_number(
							reminders.length.toString(),
						),
						ephemeral: true,
					});

				await Util.database.query(
					"DELETE FROM reminders WHERE id = $1",
					[reminders[number - 1].id],
				);

				interaction.followUp(translations.data.removed());
				break;
			}

			case "list": {
				interaction.followUp({
					embeds: [
						{
							author: {
								name: translations.data.title(
									interaction.user.tag,
								),
								iconURL: interaction.user.displayAvatarURL({
									dynamic: true,
								}),
							},
							color: interaction.guild.me.displayColor,
							description: reminders.length
								? null
								: translations.data.no_reminder(),
							fields: reminders.map((reminder, i) => {
								return {
									name: `\`${i + 1}.\` ${reminder.content}`,
									value: `<t:${Math.round(
										Date.parse(reminder.timestamp) / 1000,
									)}:R>`,
									inline: true,
								};
							}),
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
