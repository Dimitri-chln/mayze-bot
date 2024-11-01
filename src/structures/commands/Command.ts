import Util from "../../Util";

import {
	ApplicationCommandChoicesOption,
	ApplicationCommandOptionData,
	ApplicationCommandOptionType,
	PermissionFlagsBits,
	PermissionsBitField,
	Snowflake,
} from "discord.js";

import { DatabaseCooldown, DatabaseItem, DatabaseUserItem } from "../../types/Database";

import { CommandInput } from "./CommandInput";
import CommandArgs, { ArgError } from "./CommandArgs";
import CommandFormats from "./CommandFormats";

import {
	CommandLocalization,
	CommandLocalizationManager,
	DataLocalizationManager,
	SubCommandGroupLocalization,
	SubCommandLocalization,
} from "../localizations/LocalizationManager";
import LocalizationItem from "../localizations/LocalizationItem";

import formatTime from "../../utils/misc/formatTime";

export default class Command {
	private readonly _name: string;
	name: LocalizationItem;
	description: LocalizationItem;
	readonly aliases?: string[];
	formats: CommandFormats;
	readonly userPermissions: PermissionsBitField;
	readonly botPermissions: PermissionsBitField;
	readonly options: ApplicationCommandOptionData[];
	readonly cooldown?: number;
	readonly ephemeralReply?: boolean;
	readonly allowedGuildIds?: Snowflake[];
	readonly voiceRestricted?: boolean;
	readonly voicePlayingRestricted?: boolean;
	readonly path: string;
	readonly category: string;
	localizations: CommandLocalization;

	private _run: CommandRun;

	constructor(data: CommandData, path: string, category: string) {
		this._name = data.name;
		this.aliases = data.aliases ?? [];
		this.userPermissions = data.userPermissions;
		this.botPermissions = data.botPermissions.add(PermissionFlagsBits.SendMessages);
		this.options = data.options;
		this.voiceRestricted = data.voiceRestricted ?? false;
		this.voicePlayingRestricted = data.voicePlayingRestricted ?? false;
		this.cooldown = data.cooldown ?? 2;
		this.ephemeralReply = data.ephemeralReply ?? false;
		this.allowedGuildIds = data.allowedGuildIds ?? null;
		this.path = path;
		this.category = category;
		this._run = data.run;
	}

	async localize() {
		const commandLocalizations = new CommandLocalizationManager(this._name);
		await commandLocalizations.fetch();

		// Localize strings
		this.localizations = commandLocalizations.strings;

		// Localize name and description
		this.name = this.localizations.name;
		this.description = this.localizations.description;

		// Localize options
		this._localizeOptions();

		// Localize formats
		this.formats = new CommandFormats(this.options, this.localizations);
	}

	private _localizeOptions(
		options: readonly ApplicationCommandOptionData[] = this.options,
		localizations:
			| CommandLocalization
			| {
					[K: string]: SubCommandGroupLocalization | SubCommandLocalization;
			  } = this.localizations,
		path = `commands.${this._name}`,
	) {
		for (const option of options) {
			const optionName = option.name.replace(/-/g, "_");

			try {
				if (option.type === ApplicationCommandOptionType.SubcommandGroup) {
					option.nameLocalizations = localizations.subcommandgroups[optionName].name.localization.all();
					option.description = localizations.subcommandgroups[optionName].description.default;
					option.descriptionLocalizations = localizations.subcommandgroups[optionName].description.localization.all();

					if (option.options)
						this._localizeOptions(
							option.options,
							localizations.subcommandgroups[optionName] as SubCommandGroupLocalization,
							`${path}.${optionName}`,
						);
				} else if (option.type === ApplicationCommandOptionType.Subcommand) {
					option.nameLocalizations = localizations.subcommands[optionName].name.localization.all();
					option.description = localizations.subcommands[optionName].description.default;
					option.descriptionLocalizations = localizations.subcommands[optionName].description.localization.all();

					if (option.options)
						this._localizeOptions(
							option.options,
							localizations.subcommands[optionName] as SubCommandLocalization,
							`${path}.${optionName}`,
						);
				} else {
					option.nameLocalizations = localizations.options[optionName].name.localization.all();
					option.description = localizations.options[optionName].description.default;
					option.descriptionLocalizations = localizations.options[optionName].description.localization.all();

					if ((option as ApplicationCommandChoicesOption).choices) {
						for (const choice of (option as ApplicationCommandChoicesOption).choices) {
							choice.name = localizations.options[optionName].choices[choice.value].default;
							choice.nameLocalizations = localizations.options[optionName].choices[choice.value].localization.all();
						}
					}
				}
			} catch (err) {
				throw new Error(`Failed localizing "${path}.${option.name}"`);
			}
		}
	}

	async run(input: CommandInput): Promise<any> {
		const dataLocalizations = new DataLocalizationManager();
		await dataLocalizations.fetch();

		// Admin commands
		if (this.category === "admin" && input.member.user.id !== Util.owner.id) return;

		// Check allowed guilds
		if (this.allowedGuildIds && !this.allowedGuildIds.includes(input.guild.id)) return;

		// User permissions
		const userPermissions = input.member.permissionsIn(input.channel.id);
		const missingUserPermissions = userPermissions.missing(this.userPermissions);

		if (missingUserPermissions.length && input.member.user.id !== Util.owner.id)
			return input
				.reply(
					dataLocalizations.strings.command_execution.user_missing_permissions.format(
						input.locale,
						missingUserPermissions.join("`, `"),
					),
				)
				.catch(console.error);

		// Check bot permissions
		const botPermissions = input.bot.permissionsIn(input.channel.id);
		const missingBotPermissions = botPermissions.missing(this.botPermissions);

		if (missingBotPermissions.length)
			return input
				.reply(
					dataLocalizations.strings.command_execution.bot_missing_permissions.format(
						input.locale,
						missingBotPermissions.join("`, `"),
					),
				)
				.catch(console.error);

		// Check voice restriction
		if (
			this.voiceRestricted &&
			!input.member.voice.channelId /*||
				(Util.musicPlayer.get(input.guild.id) &&
					input.member.voice.channelId !== Util.musicPlayer.get(input.guild.id).voiceChannel.id)*/
		)
			return input
				.reply(dataLocalizations.strings.command_execution.not_in_vc.format(input.locale))
				.catch(console.error);

		// Check voice playing restriction
		/*if (this.voicePlayingRestricted && !Util.musicPlayer.isPlaying(input.guild.id))
			return input
				.reply(dataLocalizations.strings.command_execution.no_music.format(input.locale))
				.catch(console.error);*/

		// Parse command args
		let args: CommandArgs;

		try {
			args = new CommandArgs(input, this.formats);
		} catch (err) {
			if (err instanceof ArgError) {
				switch (err.error) {
					case "ArgTypeError": {
						let argType: string;

						switch (err.arg.dataType) {
							case ApplicationCommandOptionType.String:
								argType = dataLocalizations.strings.command_execution.data_type.string.format(input.locale);
								break;
							case ApplicationCommandOptionType.Integer:
								argType = dataLocalizations.strings.command_execution.data_type.integer.format(input.locale);
								break;
							case ApplicationCommandOptionType.User:
								argType = dataLocalizations.strings.command_execution.data_type.user.format(input.locale);
								break;
							case ApplicationCommandOptionType.Channel:
								argType = dataLocalizations.strings.command_execution.data_type.channel.format(input.locale);
								break;
							case ApplicationCommandOptionType.Role:
								argType = dataLocalizations.strings.command_execution.data_type.role.format(input.locale);
								break;
							case ApplicationCommandOptionType.Mentionable:
								argType = dataLocalizations.strings.command_execution.data_type.mentionable.format(input.locale);
								break;
							case ApplicationCommandOptionType.Number:
								argType = dataLocalizations.strings.command_execution.data_type.number.format(input.locale);
								break;
							case ApplicationCommandOptionType.Attachment:
								argType = dataLocalizations.strings.command_execution.data_type.attachment.format(input.locale);
								break;
							default:
								throw new Error("UnknownArgType");
						}

						return input
							.reply(
								dataLocalizations.strings.command_execution.incorrect_arg_type.format(
									input.locale,
									err.arg.toLocaleString(input.locale),
									argType,
								),
							)
							.catch(console.error);
					}
					case "ArgChoiceError": {
						if (
							err.arg.dataType === ApplicationCommandOptionType.String ||
							err.arg.dataType === ApplicationCommandOptionType.Integer ||
							err.arg.dataType === ApplicationCommandOptionType.Number
						)
							return input
								.reply(
									dataLocalizations.strings.command_execution.incorrect_arg_choice.format(
										input.locale,
										err.arg.toLocaleString(input.locale),
										err.arg.choices
											.map((choice) => `${choice.value} (${choice.nameLocalizations[input.locale]})`)
											.join("`, `"),
									),
								)
								.catch(console.error);
					}
				}
			} else if (err.message === "IncorrectFormat")
				return input
					.reply(
						dataLocalizations.strings.command_execution.incorrect_format.format(
							input.locale,
							Util.prefix,
							this.name.localization.get(input.locale),
							this.formats.toLocaleString(input.locale),
						),
					)
					.catch(console.error);
			else return console.error(err);
		}

		// Check cooldown
		const NOW = Date.now();

		const {
			rows: [cooldownData],
		}: { rows: Pick<DatabaseCooldown, "expires_at">[] } = await Util.database.query(
			"SELECT expires_at FROM cooldown WHERE command = $1 AND user_id = $2",
			[this.name.default, input.user.id],
		);

		const expiresAt = cooldownData?.expires_at;
		if (expiresAt) {
			if (NOW < expiresAt.valueOf()) {
				const timeLeft = Math.max(expiresAt.valueOf() - NOW, 1000);

				return input
					.reply(
						dataLocalizations.strings.command_execution.cooldown.format(
							input.locale,
							await formatTime(timeLeft, input.locale),
							this.name.localization.get(input.locale),
							Util.client.application.commands.cache.find((cmd) => cmd.name === this.name.default).id ??
								input.guild.commands.cache.get(this.name.default).id,
						),
					)
					.catch(console.error);
			}
		}

		// Cooldown reduction
		let cooldownReduction = 0;

		// /catch
		{
			if (this.name.default === "catch") {
				const {
					rows: [catchCooldownReduction],
				}: { rows: Pick<DatabaseUserItem & DatabaseItem, "quantity">[] } = await Util.database.query(
					`
					SELECT quantity FROM user_item
					JOIN item ON item.id = user_item.item_id
					WHERE user_item.user_id = $1 AND item.name = 'catch_cooldown_reduction'
					`,
					[input.user.id],
				);

				if (catchCooldownReduction) cooldownReduction += 30 * catchCooldownReduction.quantity;
			}
		}

		// Update cooldown
		const cooldownAmount = (this.cooldown - cooldownReduction) * 1000;
		await Util.database.query(
			`
			INSERT INTO cooldown VALUES ($1, $2, $3)
			ON CONFLICT (command, user_id)
			DO UPDATE SET
				expires_at = $3
			WHERE cooldown.command = EXCLUDED.command AND cooldown.user_id = EXCLUDED.user_id
			`,
			[this.name.default, input.user.id, new Date(NOW + cooldownAmount)],
		);

		// Run the command
		let run: RunFunction, localizations: CommandRunLocalizations;

		if (args.subCommandGroup && args.subCommand) {
			run = this._run[args.subCommandGroup][args.subCommand] as RunFunction;
			localizations = this.localizations.subcommandgroups[args.subCommandGroup].subcommands[args.subCommand].data;
		} else if (args.subCommand) {
			run = this._run[args.subCommand] as RunFunction;
			localizations = this.localizations.subcommands[args.subCommand].data;
		} else {
			run = this._run as RunFunction;
			localizations = this.localizations.data;
		}

		return run(input, args, localizations).catch((err: Error) => {
			console.error(err);
			input.reply(dataLocalizations.strings.command_execution.error.format(input.locale)).catch(console.error);
		});
	}
}

export interface CommandData {
	readonly name: string;
	readonly aliases?: string[];
	readonly userPermissions: PermissionsBitField;
	readonly botPermissions: PermissionsBitField;
	readonly options: ApplicationCommandOptionData[];
	readonly cooldown?: number;
	readonly ephemeralReply?: boolean;
	readonly allowedGuildIds?: Snowflake[];
	readonly voiceRestricted?: boolean;
	readonly voicePlayingRestricted?: boolean;

	readonly run: CommandRun;
}

type RunFunction = (input: CommandInput, args: CommandArgs, localizations: CommandRunLocalizations) => Promise<void>;

type CommandRun =
	| RunFunction /* Base command */
	| {
			[K: string]:
				| RunFunction /* Subcommand group (if any) or subcommand */
				| {
						[K: string]: RunFunction /* Subcommand (if subcommand group exists) */;
				  };
	  };

interface CommandRunLocalizations {
	[K: string]: LocalizationItem;
}
