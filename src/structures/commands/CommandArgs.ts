import { ApplicationCommandOptionType, Attachment, Channel, Role, User } from "discord.js";

import validator from "validator";

import { CommandInput, CommandInputType } from "./CommandInput";
import CommandFormats, { ArgDataType, ArgType, CommandArg } from "./CommandFormats";

import parseBoolean from "../../utils/misc/parseBoolean";

export default class CommandArgs {
	readonly subCommandGroup?: string;
	readonly subCommand?: string;
	private readonly _options: {
		[K: string]: Arg;
	};

	constructor(input: CommandInput, formats: CommandFormats) {
		this._options = {};

		switch (input.type) {
			case CommandInputType.Message: {
				const format = formats.match(input);
				if (!format) throw new Error("IncorrectFormat");

				// Arguments
				const inputArgs = input.message.content
					.match(/(?<=\s|^)(?!--)(?:[\w-]+?=)?(?:(?<!")[^\s"]+?(?!")|(?<!\\)".+?(?<!\\)")(?=\s|$)/g)
					.map((match) => match.replace(/\\"/g, '"'));

				inputArgs.shift(); // Remove the command name as we don't need it

				let argCounter = 0;
				let attachmentCounter = 0;

				for (const inputArg of inputArgs) {
					const match = inputArg.match(/^(?:([\w-]+)=)?"?(.+?)"?$/);

					const argName = match[1]?.toLowerCase();
					const argValue = match[2];

					const formatArg = argName
						? format.args.find((a) => a.name.default.toLowerCase() === argName) ??
						  format.args.find((a) => a.name.localization.get(input.locale).toLowerCase() === argName)
						: format.args[argCounter++];

					if (!formatArg || formatArg.dataType === ApplicationCommandOptionType.Boolean)
						throw new Error("IncorrectFormat");

					switch (formatArg.type) {
						case ArgType.SubcommandGroup:
							this.subCommandGroup = formatArg.name.default;
							break;

						case ArgType.Subcommand:
							this.subCommand = formatArg.name.default;
							break;

						case ArgType.Required:
						case ArgType.Optional:
							// Check type
							let parsedArgValue: Arg;
							let id: string;

							switch (formatArg.dataType) {
								case ApplicationCommandOptionType.String:
									parsedArgValue = argValue;
									if (formatArg.choices) {
										const choice = formatArg.choices.find(
											(choice) =>
												argValue === choice.value ||
												argValue === choice.name ||
												argValue === choice.nameLocalizations[input.locale],
										);
										if (!choice) throw new ArgError(formatArg, "ArgChoiceError");
										parsedArgValue = choice.value;
									}
									break;

								case ApplicationCommandOptionType.Integer:
									parsedArgValue = parseFloat(argValue);
									if (!validator.isInt(argValue)) throw new ArgError(formatArg, "ArgTypeError");
									if (formatArg.choices) {
										const choice = formatArg.choices.find(
											(choice) =>
												argValue === choice.value ||
												argValue === choice.name ||
												argValue === choice.nameLocalizations[input.locale],
										);
										if (!choice) throw new ArgError(formatArg, "ArgChoiceError");
										parsedArgValue = choice.value;
									}
									break;

								case ApplicationCommandOptionType.User:
									id = argValue.match(/^(\d{18,20})$|^<@!?(\d{18,20})>$/)?.[0].match(/\d{18,20}/)?.[0];
									parsedArgValue = input.guild.members.cache.get(id)?.user;
									if (!parsedArgValue) throw new ArgError(formatArg, "ArgTypeError");
									break;

								case ApplicationCommandOptionType.Channel:
									id = argValue.match(/^(\d{18,20})$|^<#(\d{18,20})>$/)?.[0].match(/\d{18,20}/)?.[0];
									parsedArgValue = input.guild.channels.cache.get(id);
									if (!parsedArgValue) throw new ArgError(formatArg, "ArgTypeError");
									break;

								case ApplicationCommandOptionType.Role:
									id = argValue.match(/^(\d{18,20})$|^<@&(\d{18,20})>$/)?.[0].match(/\d{18,20}/)?.[0];
									parsedArgValue = input.guild.roles.cache.get(id);
									if (!parsedArgValue) throw new ArgError(formatArg, "ArgTypeError");
									break;

								case ApplicationCommandOptionType.Mentionable:
									id = argValue.match(/^(\d{18,20})$|^<@(?:!&)?(\d{18,20})>$/)?.[0].match(/\d{18,20}/)?.[0];
									parsedArgValue = input.guild.members.cache.get(id)?.user ?? input.guild.roles.cache.get(id);
									if (!parsedArgValue) throw new ArgError(formatArg, "ArgTypeError");
									break;

								case ApplicationCommandOptionType.Number:
									parsedArgValue = parseFloat(argValue);
									if (Number.isNaN(parsedArgValue)) throw new ArgError(formatArg, "ArgTypeError");
									if (formatArg.choices) {
										const choice = formatArg.choices.find(
											(choice) =>
												argValue === choice.name ||
												argValue === choice.nameLocalizations[input.locale] ||
												argValue === choice.value,
										);
										if (!choice) throw new ArgError(formatArg, "ArgChoiceError");
										parsedArgValue = choice.value;
									}
									break;

								case ApplicationCommandOptionType.Attachment:
									parsedArgValue = input.message.attachments.at(attachmentCounter++);
									if (!parsedArgValue) throw new ArgError(formatArg, "ArgTypeError");
									break;
							}

							this._options[formatArg.name.default] = parsedArgValue;
							break;

						default:
							throw Error("FormattingError");
					}
				}

				// Flags
				for (const flag of format.flags) {
					if (this._options[flag.name.default] === undefined)
						// If the flag hasn't been set already
						this._options[flag.name.default] =
							input.message.content.includes(flag.name.default) ||
							input.message.content.includes(flag.name.localization.get(input.locale));
				}
				break;
			}

			case CommandInputType.Interaction: {
				this.subCommandGroup = input.interaction.options.getSubcommandGroup();
				this.subCommand = input.interaction.options.getSubcommand();

				this._options = {};

				input.interaction.command.options
					.flat()
					.filter(
						(option) =>
							option.type !== ApplicationCommandOptionType.SubcommandGroup &&
							option.type !== ApplicationCommandOptionType.Subcommand,
					)
					.forEach((option) => {
						switch (option.type) {
							case ApplicationCommandOptionType.String:
								this._options[option.name] = input.interaction.options.getString(option.name, option.required);

								break;
							case ApplicationCommandOptionType.Integer:
								this._options[option.name] = input.interaction.options.getInteger(option.name, option.required);
								break;
							case ApplicationCommandOptionType.Boolean:
								this._options[option.name] = input.interaction.options.getBoolean(option.name, option.required);
								break;
							case ApplicationCommandOptionType.User:
								this._options[option.name] = input.interaction.options.getUser(option.name, option.required);
								break;
							case ApplicationCommandOptionType.Channel:
								this._options[option.name] = input.interaction.options.getChannel(
									option.name,
									option.required,
								) as Channel;
								break;
							case ApplicationCommandOptionType.Role:
								this._options[option.name] = input.interaction.options.getRole(option.name, option.required) as Role;
								break;
							case ApplicationCommandOptionType.Mentionable:
								this._options[option.name] = input.interaction.options.getMentionable(option.name, option.required) as
									| User
									| Role;
								break;
							case ApplicationCommandOptionType.Number:
								this._options[option.name] = input.interaction.options.getNumber(option.name, option.required);
								break;
							case ApplicationCommandOptionType.Attachment:
								this._options[option.name] = input.interaction.options.getAttachment(option.name, option.required);
								break;
							default:
								throw new Error("InvalidOptionType");
						}
					});
				break;
			}

			default:
				throw new Error("InvalidInput");
		}
	}

	get(arg: string) {
		return this._options[arg];
	}
}

type Arg = string | number | boolean | User | Channel | Role | Attachment;

type ArgErrorType = "ArgTypeError" | "ArgChoiceError";

export class ArgError extends Error {
	readonly arg: CommandArg<ArgDataType>;
	readonly error: ArgErrorType;

	constructor(arg: CommandArg<ArgDataType>, error: ArgErrorType) {
		super("ArgError");
		this.arg = arg;
		this.error = error;
	}
}
