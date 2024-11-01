import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import Util from "../../Util";

import dhms from "dhms";
import validator from "validator";

import { DatabaseReminder } from "../../types/Database";

import formatTime from "../../utils/misc/formatTime";
import parseDate from "../../utils/misc/parseDate";

const command: CommandData = {
	name: "reminder",
	aliases: ["rmd"],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField([PermissionFlagsBits.EmbedLinks]),

	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "list",
			description: undefined,
		},
		{
			type: ApplicationCommandOptionType.SubcommandGroup,
			name: "create",
			description: undefined,
			options: [
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "in",
					description: undefined,
					options: [
						{
							type: ApplicationCommandOptionType.String,
							name: "duration",
							description: undefined,
							required: true,
						},
						{
							type: ApplicationCommandOptionType.String,
							name: "reminder",
							description: undefined,
							required: true,
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "on",
					description: undefined,
					options: [
						{
							type: ApplicationCommandOptionType.String,
							name: "date",
							description: undefined,
							required: true,
						},
						{
							type: ApplicationCommandOptionType.String,
							name: "reminder",
							description: undefined,
							required: true,
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "each",
					description: undefined,
					options: [
						{
							type: ApplicationCommandOptionType.String,
							name: "duration",
							description: undefined,
							required: true,
						},
						{
							type: ApplicationCommandOptionType.String,
							name: "reminder",
							description: undefined,
							required: true,
						},
						{
							type: ApplicationCommandOptionType.Integer,
							name: "occurrences",
							description: undefined,
							required: false,
							min_value: 1,
						},
					],
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "remove",
			description: undefined,
			options: [
				{
					type: ApplicationCommandOptionType.Integer,
					name: "reminder",
					description: undefined,
					required: true,
					min_value: 1,
				},
			],
		},
	],

	run: {
		list: async function (input, args, localizations) {
			const { rows: reminders }: { rows: DatabaseReminder[] } = await Util.database.query(
				"SELECT * FROM reminder WHERE user_id = $1",
				[input.user.id],
			);

			input.reply({
				embeds: [
					{
						author: {
							name: localizations.author.format(input.locale, input.user.tag),
							icon_url: input.user.displayAvatarURL(),
						},
						color: input.guild.members.me.displayColor,
						description: reminders.length ? undefined : localizations.no_reminder.format(input.locale),
						fields: reminders.map((reminder, i) => {
							return {
								name: `\`${i + 1}.\` ${reminder.content}`,
								value: `<t:${Math.round(Date.parse(reminder.timestamp) / 1000)}:R>`,
								inline: true,
							};
						}),
						footer: {
							text: Util.config.DEFAULT_EMBED_FOOTER_TEXT,
						},
					},
				],
			});
		},

		create: {
			in: async function (input, args, localizations) {
				const duration: number = dhms(args.get("duration") as string);
				const reminder = args.get("reminder") as string;

				if (!duration) {
					await input.reply(localizations.invalid_duration.format(input.locale));
					return;
				}

				const date = new Date(Date.now() + duration);
				const content = /^https?:\/\//.test(reminder)
					? reminder
					: reminder.replace(/^./, (match) => match.toUpperCase());

				await Util.database.query("INSERT INTO reminder (user_id, timestamp, content) VALUES ($1, $2, $3)", [
					input.user.id,
					date,
					content,
				]);

				input.reply(localizations.created.format(input.locale, await formatTime(duration, input.locale), content));
			},

			on: async function (input, args, localizations) {
				const date = args.get("date") as string;
				const reminder = args.get("reminder") as string;

				const parsedDate = parseDate(date.trim());
				if (!parsedDate) {
					await input.reply(localizations.invalid_date.format(input.locale));
					return;
				}

				const duration = parsedDate.valueOf() - Date.now();
				if (duration < 0) {
					await input.reply(localizations.date_passed.format(input.locale));
					return;
				}

				const content = /^https?:\/\//.test(reminder)
					? reminder
					: reminder.replace(/^./, (match) => match.toUpperCase());

				await Util.database.query("INSERT INTO reminder (user_id, timestamp, content) VALUES ($1, $2, $3)", [
					input.user.id,
					date,
					content,
				]);

				input.reply(localizations.created.format(input.locale, await formatTime(duration, input.locale), content));
			},

			each: async function (input, args, localizations) {
				const duration: number = dhms(args.get("duration") as string);
				const reminder = args.get("reminder") as string;
				const occurrences = args.get("occurrences") as number;

				if (!duration) {
					await input.reply(localizations.invalid_duration.format(input.locale));
					return;
				}
				if (occurrences < 1) {
					await input.reply(localizations.invalid_occurrences.format(input.locale));
					return;
				}

				const date = new Date(Date.now() + duration);
				const content = /^https?:\/\//.test(reminder)
					? reminder
					: reminder.replace(/^./, (match) => match.toUpperCase());

				await Util.database.query(
					"INSERT INTO reminder (user_id, timestamp, content, repeat, occurrences) VALUES ($1, $2, $3, $4, $5)",
					[input.user.id, date, content, duration, occurrences],
				);

				input.reply(localizations.created.format(input.locale, await formatTime(duration, input.locale), content));
			},
		},

		remove: async function (input, args, localizations) {
			const reminder = args.get("reminder") as number;

			const { rows: reminders }: { rows: DatabaseReminder[] } = await Util.database.query(
				"SELECT * FROM reminder WHERE user_id = $1",
				[input.user.id],
			);

			if (reminder < 1 || reminder > reminders.length) {
				await input.reply(localizations.invalid_number.format(input.locale, reminders.length.toString()));
				return;
			}

			await Util.database.query("DELETE FROM reminder WHERE id = $1", [reminders[reminder - 1].id]);
			input.reply(localizations.removed.format(input.locale));
		},
	},
};

export default command;
