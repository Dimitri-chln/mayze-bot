import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import LanguageStrings from "../../types/structures/LanguageStrings";
import Util from "../../Util";

import formatTime from "../../utils/misc/formatTime";
import { Collection } from "discord.js";



const command: Command = {
	name: "help",
	description: {
		fr: "Obtenir la liste des commandes ou des informations sur une commande spécifique",
		en: "Get all commands or help on one specific command"
	},
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],
	
	options: {
		fr: [
			{
				name: "command",
				description: "La commande pour laquelle obtenir une aide",
				type: "STRING",
				required: false
			}
		],
		en: [
			{
				name: "command",
				description: "The command to get help with",
				type: "STRING",
				required: false
			}
		]
	},
	
	run: async (interaction: CommandInteraction, languageStrings: LanguageStrings) => {
		const commands = Util.commands.filter(cmd => !cmd.guildIds?.includes(interaction.guild.id));
		const commandName = interaction.options.getString("command").toLowerCase();

		if (!commandName) {
			const publicCommands = Util.commands.filter(cmd => cmd.category !== "admin");
			const categories: { name: string, commands: Collection<string, Command> }[] = [];
			
			while (publicCommands.size) {
				const category = publicCommands.first().category;
				categories.push({ name: category, commands: publicCommands.filter(cmd => cmd.category === category) });
				publicCommands.sweep(cmd => cmd.category === category);
			}

			interaction.reply({
				embeds: [
					{
						author: {
							name: languageStrings.data.commands_list(),
							iconURL: interaction.client.user.displayAvatarURL()
						},
						color: interaction.guild.me.displayColor,
						fields: categories.map(category => {
							return { name: category.name.replace(/^./, a => a.toUpperCase()), value: category.commands.map(cmd => cmd.name).join(", "), inline: true };
						}),
						footer: {
							text: "✨ Mayze ✨"
						}
					}
				]
			});

		} else {

			const command = commands.get(commandName);
			if (!command) return interaction.reply({
				content: languageStrings.data.invalid_command(),
				ephemeral: true
			});

			interaction.reply({
				embeds: [
					{
						author: {
							name: languageStrings.data.title(Util.prefix + command.name),
							iconURL: interaction.client.user.displayAvatarURL()
						},
						color: interaction.guild.me.displayColor,
						description: languageStrings.data.description(
							command.name,
							command.category.replace(/^./, a => a.toUpperCase()),
							command.description[languageStrings.language],
							command.userPermissions.join("`, `") ?? "∅",
							(command.cooldown ?? 2).toString()
						),
						footer: {
							text: "✨ Mayze ✨"
						}
					}
				]
			});
		}
	}
};



export default command;