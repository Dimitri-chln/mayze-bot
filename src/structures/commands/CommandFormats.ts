import Util from "../../Util";

import {
	ApplicationCommandChoicesOption,
	ApplicationCommandOption,
	ApplicationCommandOptionChoiceData,
	ApplicationCommandOptionType,
	ApplicationCommandSubCommand,
	ApplicationCommandSubGroup,
	CommandOptionNumericResolvableType,
	CommandOptionSubOptionResolvableType,
	Locale,
} from "discord.js";

import { MessageCommandInput } from "./CommandInput";

import { CommandLocalization } from "../localizations/LocalizationManager";
import LocalizationItem from "../localizations/LocalizationItem";

export default class CommandFormats {
	readonly options: ApplicationCommandOption[];
	readonly formats: CommandFormat[];

	constructor(options: ApplicationCommandOption[], localizations: CommandLocalization) {
		this.options = options;
		this.formats = [];

		if (
			this.options.length === 0 ||
			(this.options[0].type !== ApplicationCommandOptionType.SubcommandGroup &&
				this.options[0].type !== ApplicationCommandOptionType.Subcommand)
		)
			this.formats.push(new CommandFormat(localizations, this.options as ApplicationCommandNonSubOption[]));
		else
			for (const option of this.options) {
				if (option.type === ApplicationCommandOptionType.SubcommandGroup) {
					for (const subCommand of option.options) {
						this.formats.push(
							new CommandFormat(
								localizations,
								subCommand.options as ApplicationCommandNonSubOption[],
								subCommand,
								option,
							),
						);
					}
				}

				if (option.type === ApplicationCommandOptionType.Subcommand) {
					this.formats.push(
						new CommandFormat(localizations, option.options as ApplicationCommandNonSubOption[], option),
					);
				}
			}
	}

	toLocaleString(locale: Locale) {
		return this.formats.map((format) => format.toLocaleString(locale)).join(" | ");
	}

	match(input: MessageCommandInput) {
		const inputArgs = input.message.content.substring(Util.prefix.length);

		return this.formats.find((format) => {
			const minArgs = format.requiredArgs.length;
			const maxArgs = format.requiredArgs.length + format.optionalArgs.length;

			// Default regex pieces
			const commandNameDefaultRegex =
				input.command.name.default + (input.command.aliases.length ? "|" + input.command.aliases.join("|") : "");
			const subCommandGroupDefaultRegex = format.subCommandGroup ? `\\s+${format.subCommandGroup.name.default}` : "";
			const subCommandDefaultRegex = format.subCommand ? `\\s+${format.subCommand.name.default}` : "";

			// Locale regex pieces
			const commandNameLocaleRegex =
				input.command.name.localization.get(input.locale) +
				(input.command.aliases.length ? "|" + input.command.aliases.join("|") : "");
			const subCommandGroupLocaleRegex = format.subCommandGroup
				? `\\s+${format.subCommandGroup.name.localization.get(input.locale)}`
				: "";
			const subCommandLocaleRegex = format.subCommand
				? `\\s+${format.subCommand.name.localization.get(input.locale)}`
				: "";

			// Args regex pieces
			const argRegex = '\\s+(?:[\\w-]+?=)?((?<!")[^\\s"]+?(?!")|(?<!\\\\)".+?(?<!\\\\)")(?=\\s|$)';
			const flagRegex = format.flags.map((flag) => `(?:\\s+${flag.name.default})?`).join("");

			// Regex
			const defaultRegex = new RegExp(
				`^(?:${commandNameDefaultRegex})${subCommandGroupDefaultRegex}${subCommandDefaultRegex}(?:${argRegex}){${minArgs},${maxArgs}}${flagRegex}$`,
				"i",
			);
			const localeRegex = new RegExp(
				`^(?:${commandNameLocaleRegex})${subCommandGroupLocaleRegex}${subCommandLocaleRegex}(?:${argRegex}){${minArgs},${maxArgs}}${flagRegex}$`,
				"i",
			);

			return defaultRegex.test(inputArgs) || localeRegex.test(inputArgs);
		});
	}
}

export class CommandFormat {
	readonly args: CommandArg<ArgDataType>[];

	constructor(
		localizations: CommandLocalization,
		options: ApplicationCommandNonSubOption[] = [],
		subCommand?: ApplicationCommandSubCommand,
		subCommandGroup?: ApplicationCommandSubGroup,
	) {
		this.args = [];

		if (subCommandGroup) {
			const subCommandGroupName = subCommandGroup.name.replace(/-/g, "_");
			this.args.push(new SubCommandGroupArg(localizations.subcommandgroups[subCommandGroupName].name));
		}

		if (subCommand) {
			const subCommandGroupName = subCommandGroup?.name?.replace(/-/g, "_");
			const subCommandName = subCommand.name.replace(/-/g, "_");
			this.args.push(
				new SubCommandArg(
					subCommandGroup
						? localizations.subcommandgroups[subCommandGroupName].subcommands[subCommandName].name
						: localizations.subcommands[subCommandName].name,
				),
			);
		}

		for (const option of options) {
			const subCommandGroupName = subCommandGroup?.name?.replace(/-/g, "_");
			const subCommandName = subCommand?.name?.replace(/-/g, "_");
			const optionName = option.name.replace(/-/g, "_");

			const localization = subCommandGroup
				? localizations.subcommandgroups[subCommandGroupName].subcommands[subCommandName].options[optionName].name
				: subCommand
				? localizations.subcommands[subCommandName].options[optionName].name
				: localizations.options[optionName].name;

			if (option.type === ApplicationCommandOptionType.Boolean) this.args.push(new FlagArg(localization));
			else if (option.required)
				this.args.push(new RequiredArg(localization, option.type, (option as ApplicationCommandChoicesOption).choices));
			else
				this.args.push(new OptionalArg(localization, option.type, (option as ApplicationCommandChoicesOption).choices));
		}
	}

	toLocaleString(locale: Locale) {
		return this.args.map((arg) => arg.toLocaleString(locale)).join(" ");
	}

	get subCommandGroup() {
		return this.args.find((arg) => arg.type === ArgType.SubcommandGroup);
	}

	get subCommand() {
		return this.args.find((arg) => arg.type === ArgType.Subcommand);
	}

	get requiredArgs() {
		return this.args.filter((arg) => arg.type === ArgType.Required);
	}

	get optionalArgs() {
		return this.args.filter((arg) => arg.type === ArgType.Optional);
	}

	get flags() {
		return this.args.filter((arg) => arg.type === ArgType.Flag);
	}
}

class BaseArg<Type extends ApplicationCommandOptionType> {
	readonly type: ArgType;
	readonly name: LocalizationItem;
	readonly dataType: Type;

	constructor(type: ArgType, name: LocalizationItem, dataType: Type) {
		this.type = type;
		this.name = name;
		this.dataType = dataType;
	}

	toLocaleString(locale: Locale) {
		return `${this.name.localization.get(locale)}`;
	}
}

export class SubCommandGroupArg extends BaseArg<ApplicationCommandOptionType.SubcommandGroup> {
	constructor(name: LocalizationItem) {
		super(ArgType.SubcommandGroup, name, ApplicationCommandOptionType.SubcommandGroup);
	}
}

export class SubCommandArg extends BaseArg<ApplicationCommandOptionType.Subcommand> {
	constructor(name: LocalizationItem) {
		super(ArgType.Subcommand, name, ApplicationCommandOptionType.Subcommand);
	}
}

export class RequiredArg<Type extends ArgDataType> extends BaseArg<Type> {
	readonly choices: ApplicationCommandOptionType.String | CommandOptionNumericResolvableType extends Type
		? readonly ApplicationCommandOptionChoiceData<string | number>[]
		: Type extends ApplicationCommandOptionType.String
		? readonly ApplicationCommandOptionChoiceData<string>[]
		: Type extends CommandOptionNumericResolvableType
		? readonly ApplicationCommandOptionChoiceData<number>[]
		: never;

	constructor(
		name: LocalizationItem,
		type: Type,
		choices: ApplicationCommandOptionType.String | CommandOptionNumericResolvableType extends Type
			? readonly ApplicationCommandOptionChoiceData<string | number>[]
			: Type extends ApplicationCommandOptionType.String
			? readonly ApplicationCommandOptionChoiceData<string>[]
			: Type extends CommandOptionNumericResolvableType
			? readonly ApplicationCommandOptionChoiceData<number>[]
			: never,
	) {
		super(ArgType.Required, name, type);
		this.choices = choices;
	}

	toLocaleString(locale: Locale) {
		return `<${this.name.localization.get(locale)}>`;
	}
}

export class OptionalArg<Type extends ArgDataType> extends BaseArg<Type> {
	readonly choices: ApplicationCommandOptionType.String | CommandOptionNumericResolvableType extends Type
		? readonly ApplicationCommandOptionChoiceData<string | number>[]
		: Type extends ApplicationCommandOptionType.String
		? readonly ApplicationCommandOptionChoiceData<string>[]
		: Type extends CommandOptionNumericResolvableType
		? readonly ApplicationCommandOptionChoiceData<number>[]
		: never;

	constructor(
		name: LocalizationItem,
		type: Type,
		choices: ApplicationCommandOptionType.String | CommandOptionNumericResolvableType extends Type
			? readonly ApplicationCommandOptionChoiceData<string | number>[]
			: Type extends ApplicationCommandOptionType.String
			? readonly ApplicationCommandOptionChoiceData<string>[]
			: Type extends CommandOptionNumericResolvableType
			? readonly ApplicationCommandOptionChoiceData<number>[]
			: never,
	) {
		super(ArgType.Optional, name, type);
		this.choices = choices;
	}

	toLocaleString(locale: Locale) {
		return `[${this.name.localization.get(locale)}]`;
	}
}

export class FlagArg extends BaseArg<ApplicationCommandOptionType.Boolean> {
	constructor(name: LocalizationItem) {
		super(ArgType.Flag, name, ApplicationCommandOptionType.Boolean);
	}

	toLocaleString(locale: Locale) {
		return `--${this.name.localization.get(locale)}`;
	}
}

type ApplicationCommandNonSubOption = Exclude<
	ApplicationCommandOption,
	ApplicationCommandSubGroup | ApplicationCommandSubCommand
>;

export type CommandArg<Type extends ArgDataType> =
	| SubCommandGroupArg
	| SubCommandArg
	| RequiredArg<Type>
	| OptionalArg<Type>
	| FlagArg;

export enum ArgType {
	SubcommandGroup,
	Subcommand,
	Required,
	Optional,
	Flag,
}

export type ArgDataType = Exclude<ApplicationCommandOptionType, CommandOptionSubOptionResolvableType>;
