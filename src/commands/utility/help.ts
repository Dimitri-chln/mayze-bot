import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import formatTime from "../../utils/misc/formatTime";
import { Collection } from "discord.js";

const command: Command = {
	name: "help",
	aliases: [],
	description: {
		fr: "Obtenir la liste des commandes ou des informations sur une commande spécifique",
		en: "Get all commands or help on one specific command",
	},
	usage: "",
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],

	options: {
		fr: [
			{
				name: "command",
				description: "La commande pour laquelle obtenir une aide",
				type: "STRING",
				required: false,
			},
		],
		en: [
			{
				name: "command",
				description: "The command to get help with",
				type: "STRING",
				required: false,
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const publicCommands = Util.commands.filter(
			(cmd) =>
				(!cmd.guildIds || cmd.guildIds.includes(interaction.guild.id)) &&
				cmd.category !== "admin",
		);
		const commandName = interaction.options.getString("command", false)?.toLowerCase();

		if (!commandName) {
			const categories: {
				name: string;
				commands: Collection<string, Command>;
			}[] = [];

			while (publicCommands.size) {
				const category = publicCommands.first().category;
				categories.push({
					name: category,
					commands: publicCommands.filter((cmd) => cmd.category === category),
				});
				publicCommands.sweep((cmd) => cmd.category === category);
			}

			interaction.followUp({
				embeds: [
					{
						author: {
							name: translations.strings.command_list(),
							iconURL: interaction.client.user.displayAvatarURL(),
						},
						color: interaction.guild.me.displayColor,
						fields: categories.map((category) => {
							return {
								name: category.name.replace(/^./, (a) => a.toUpperCase()),
								value: category.commands.map((cmd) => cmd.name).join(", "),
								inline: true,
							};
						}),
						footer: {
							text: "✨ Mayze ✨",
						},
					},
				],
			});
		} else {
			const command = publicCommands.get(commandName);
			if (!command)
				return interaction.followUp(translations.strings.invalid_command());

			interaction.followUp({
				embeds: [
					{
						author: {
							name: translations.strings.author(command.name),
							iconURL: interaction.client.user.displayAvatarURL(),
						},
						color: interaction.guild.me.displayColor,
						description: translations.strings.description(
							command.name,
							command.category.replace(/^./, (a) => a.toUpperCase()),
							command.description[translations.language],
							command.userPermissions.length
								? command.userPermissions.join("`, `")
								: "∅",
							formatTime((command.cooldown ?? 2) * 1000),
						),
						footer: {
							text: "✨ Mayze ✨",
						},
					},
				],
			});
		}
	},
};

export default command;
