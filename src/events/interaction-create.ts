import Event from "../types/Event";
import Util from "../Util";

import { ApplicationCommandType, Interaction, InteractionType, PermissionFlagsBits } from "discord.js";

import { InteractionCommandInput } from "../structures/commands/CommandInput";

const event: Event = {
	name: "interactionCreate",
	once: false,

	run: async (interaction: Interaction) => {
		switch (interaction.type) {
			case InteractionType.ApplicationCommand: {
				if (interaction.commandType === ApplicationCommandType.ChatInput) {
					if (!interaction.appPermissions.has(PermissionFlagsBits.SendMessages)) return;

					try {
						const input = new InteractionCommandInput(interaction);
						await interaction.deferReply({ ephemeral: input.command.ephemeralReply });

						input.command.run(input).catch(console.error);
					} catch (err) {
						// The command doesn't exit
					}
				}
				break;
			}

			case InteractionType.ApplicationCommandAutocomplete: {
				const autocompleteHandler = Util.autocompleteHandlers.get(interaction.commandName);
				if (!autocompleteHandler) return;

				const subCommandGroup = interaction.options.getSubcommandGroup(false);
				const subCommand = interaction.options.getSubcommand(false);
				const focusedOption = interaction.options.getFocused(true);

				const option = autocompleteHandler.options.find(
					(option) =>
						option.subCommandGroup === subCommandGroup &&
						option.subCommand === subCommand &&
						option.name === focusedOption.name,
				);

				try {
					const results = await option.run(interaction, focusedOption.value);

					const finalResults = results
						.filter((result) => {
							switch (option.filterType) {
								case "STARTS_WITH": {
									return result.name.toLowerCase().startsWith(focusedOption.value.toString().toLowerCase());
								}

								case "CONTAINS": {
									return result.name.toLowerCase().includes(focusedOption.value.toString().toLowerCase());
								}
							}
						})
						.slice(0, 25);

					interaction.respond(finalResults);
				} catch (err) {
					console.error(err);
				}

				break;
			}
		}
	},
};

export default event;
