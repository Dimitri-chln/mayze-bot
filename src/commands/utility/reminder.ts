import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import dhms from "dhms";
import formatTime from "../../utils/misc/formatTime";

const command: Command = {
	name: "reminder",
	aliases: [],
	description: {
		fr: "Gérer tes rappels",
		en: "Manage your reminders",
	},
	usage: "",
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
								description: "La durée dans laquelle le rappel doit s'activer",
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
								description: "La date à laquelle le rappel doit s'activer",
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
						description: "Créer un rappel qui se répétera à intervalles réguliers",
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
							{
								name: "occurrences",
								description: "Le nombre de répétitions du rappel",
								type: "NUMBER",
								required: false,
								minValue: 1,
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
								description: "The time before the reminder triggers",
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
								description: "The date which the reminder will trigger at",
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
						description: "Create a reminder that will repeat based on a duration",
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
							{
								name: "occurrences",
								description: "The number of times to repeat the reminder",
								type: "NUMBER",
								required: false,
								minValue: 1,
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

	runInteraction: async (interaction, translations) => {
		const subCommand = interaction.options.getSubcommand();

		const { rows: reminders } = await Util.database.query("SELECT * FROM reminder WHERE user_id = $1", [
			interaction.user.id,
		]);

		switch (subCommand) {
			case "in": {
				const duration: number = dhms(interaction.options.getString("duration", true));

				if (!duration) return interaction.followUp(translations.strings.invalid_duration());

				const date = new Date(Date.now() + duration);

				let content = interaction.options.getString("reminder", true);
				if (!/^https?:\/\//.test(content)) content = content.replace(/^./, (a) => a.toUpperCase());

				await Util.database.query("INSERT INTO reminder (user_id, timestamp, content) VALUES ($1, $2, $3)", [
					interaction.user.id,
					date,
					content,
				]);

				interaction.followUp(translations.strings.created(formatTime(duration, translations.language), content));
				break;
			}

			case "on": {
				const input = interaction.options.getString("date", true).trim();
				const match =
					input.match(/^(\d{1,2})-(\d{1,2})-(\d+)(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/) ??
					input.match(/^(\d{1,2})\/(\d{1,2})\/(\d+)(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);

				const date = match
					? new Date(
							`${match[2]}-${match[1]}-${match[3]}${
								match[4] && match[5] ? ` ${match[4]}:${match[5]}${match[6] ? `:${match[6]}` : ""}` : ""
							}`,
					  )
					: new Date(input);

				if (!date) return interaction.followUp(translations.strings.invalid_date());

				const duration = date.valueOf() - Date.now();

				if (duration < 0) return interaction.reply(translations.strings.date_passed());

				let content = interaction.options.getString("reminder", true);
				if (!/^https?:\/\//.test(content)) content = content.replace(/^./, (a) => a.toUpperCase());

				await Util.database.query("INSERT INTO reminder (user_id, timestamp, content) VALUES ($1, $2, $3)", [
					interaction.user.id,
					date,
					content,
				]);

				interaction.followUp(translations.strings.created(formatTime(duration, translations.language), content));
				break;
			}

			case "each": {
				const duration: number = dhms(interaction.options.getString("duration", true));

				if (!duration) return interaction.followUp(translations.strings.invalid_duration());

				const occurrences = interaction.options.getNumber("occurrences", false) ?? -1;

				if (occurrences < 1) return interaction.followUp(translations.strings.invalid_occurrences());

				const date = new Date(Date.now() + duration);

				let content = interaction.options.getString("reminder", true);
				if (!/^https?:\/\//.test(content)) content = content.replace(/^./, (a) => a.toUpperCase());

				await Util.database.query(
					"INSERT INTO reminder (user_id, timestamp, content, repeat, occurrences) VALUES ($1, $2, $3, $4, $5)",
					[interaction.user.id, date, content, duration, occurrences],
				);

				interaction.followUp(translations.strings.created(formatTime(duration, translations.language), content));
				break;
			}

			case "remove": {
				const number = interaction.options.getInteger("reminder", true);
				if (number < 1 || number > reminders.length)
					return interaction.followUp(translations.strings.invalid_number(reminders.length.toString()));

				await Util.database.query("DELETE FROM reminder WHERE id = $1", [reminders[number - 1].id]);

				interaction.followUp(translations.strings.removed());
				break;
			}

			case "list": {
				interaction.followUp({
					embeds: [
						{
							author: {
								name: translations.strings.author(interaction.user.tag),
								iconURL: interaction.user.displayAvatarURL({
									dynamic: true,
								}),
							},
							color: interaction.guild.me.displayColor,
							description: reminders.length ? null : translations.strings.no_reminder(),
							fields: reminders.map((reminder, i) => {
								return {
									name: `\`${i + 1}.\` ${reminder.content}`,
									value: `<t:${Math.round(Date.parse(reminder.timestamp) / 1000)}:R>`,
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
