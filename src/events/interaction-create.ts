import Event from "../types/structures/Event";
import Util from "../Util";

import { GuildMember, Interaction } from "discord.js";
import runCommand from "../utils/misc/runCommand";

const event: Event = {
	name: "interactionCreate",
	once: false,

	run: async (interaction: Interaction) => {
		switch (interaction.type) {
			case "PING": {
				break;
			}

			case "APPLICATION_COMMAND": {
				if (interaction.isCommand()) {
					const command = Util.commands.get(interaction.commandName);
					if (!command) return;

					await interaction.deferReply({ ephemeral: command.ephemeralReply });
					runCommand(command, interaction).catch(console.error);
				}

				if (interaction.isContextMenu()) {
					// Run
				}
				break;
			}

			case "APPLICATION_COMMAND_AUTOCOMPLETE": {
				if (interaction.isAutocomplete()) {
					const autocompleteHandler = Util.autocompleteHandlers.get(interaction.commandName);

					if (autocompleteHandler) {
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
							const results =
								option.type === "STRING"
									? await option.run(interaction, focusedOption.value as string)
									: await option.run(interaction, focusedOption.value as number);

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
					}
				}
				break;
			}

			case "MESSAGE_COMPONENT": {
				if (interaction.isSelectMenu()) {
					if (interaction.customId.startsWith("color_select_menu")) {
						// Collègues
						if ((interaction.member as GuildMember).roles.cache.has("689169136374644752"))
							return interaction.followUp({ content: "T'es puni", ephemeral: true });

						const roleId = interaction.values[0];
						const role = interaction.guild.roles.cache.get(roleId);

						await (interaction.member as GuildMember).roles.remove(Util.colorRoles);
						await (interaction.member as GuildMember).roles.add(role);

						interaction.reply({ content: "Ta couleur a été modifiée avec succès", ephemeral: true });
					}
				}
				break;
			}
		}
	},
};

export default event;
