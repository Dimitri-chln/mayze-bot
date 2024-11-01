import Command, { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, Collection, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import Util from "../../Util";

import formatTime from "../../utils/misc/formatTime";

const command: CommandData = {
	name: "help",
	aliases: ["h"],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField([PermissionFlagsBits.EmbedLinks]),

	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: "command",
			description: undefined,
			required: false,
			autocomplete: true,
		},
	],

	async run(input, args, localizations) {
		const commandName = args.get("command") as string;

		const publicCommands = Util.commands.filter(
			(cmd) => (!cmd.allowedGuildIds || cmd.allowedGuildIds.includes(input.guild.id)) && cmd.category !== "admin",
		);

		if (commandName) {
			const command =
				publicCommands.get(commandName) ??
				publicCommands.find(
					(cmd) =>
						cmd.name.default === commandName.toLowerCase() ||
						cmd.name.localization.get(input.locale) === commandName.toLowerCase() ||
						cmd.aliases.includes(commandName.toLowerCase()),
				);

			if (!command) {
				await input.reply(localizations.invalid_command.format(input.locale));
				return;
			}

			input.reply({
				embeds: [
					{
						author: {
							name: localizations.author.format(input.locale, command.name.localization.get(input.locale)),
							icon_url: input.client.user.displayAvatarURL(),
						},
						color: input.guild.members.me.displayColor,
						description: localizations.description.format(
							input.locale,
							command.name.localization.get(input.locale),
							command.category.replace(/^./, (match) => match.toUpperCase()),
							command.description.localization.get(input.locale),
							command.formats.toLocaleString(input.locale),
							command.userPermissions.toArray().join("`, `"),
							await formatTime(command.cooldown * 1000, input.locale),
						),
						footer: {
							text: Util.config.DEFAULT_EMBED_FOOTER_TEXT,
						},
					},
				],
			});
		} else {
			const categories: CommandCategory[] = [];

			while (publicCommands.size) {
				const category = publicCommands.first().category;

				categories.push({
					name: category,
					commands: publicCommands.filter((cmd) => cmd.category === category),
				});

				publicCommands.sweep((cmd) => cmd.category === category);
			}

			input.reply({
				embeds: [
					{
						author: {
							name: localizations.list_author.format(input.locale),
							icon_url: input.client.user.displayAvatarURL(),
						},
						color: input.guild.members.me.displayColor,
						fields: categories.map((category) => {
							return {
								name: category.name.replace(/^./, (match) => match.toUpperCase()),
								value: category.commands.map((cmd) => cmd.name.localization.get(input.locale)).join(", "),
								inline: true,
							};
						}),
						footer: {
							text: Util.config.DEFAULT_EMBED_FOOTER_TEXT,
						},
					},
				],
			});
		}
	},
};

export default command;

interface CommandCategory {
	name: string;
	commands: Collection<string, Command>;
}
