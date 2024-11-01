import Util from "../../Util";

import { ApplicationCommandType, ChatInputApplicationCommandData, PermissionFlagsBits } from "discord.js";

export default async function initializeApplicationCommands() {
	console.log("Fetching global and admin application commands");
	await Util.client.application.commands.fetch();
	await Util.client.guilds.fetch();
	await Util.client.guilds.cache.get(Util.config.ADMIN_GUILD_ID).commands.fetch();
	console.log("Fetched all global and admin application commands successfully");

	// Delete commands that don't exist anymore
	// - Global commands
	await Promise.all(
		Util.client.application.commands.cache
			.filter((command) => !Util.commands.has(command.name))
			.map(async (command) => {
				console.log(`Deleting global application command /${command.name}`);
				await command.delete();
			}),
	);

	// - Guild commands
	await Promise.all(
		Util.client.guilds.cache.map(async (guild) => {
			await guild.commands.fetch();
			await Promise.all(
				guild.commands.cache
					.filter(
						(command) =>
							!Util.commands.has(command.name) || !Util.commands.get(command.name).allowedGuildIds?.includes(guild.id),
					)
					.map(async (command) => {
						console.log(`Deleting application command /${command.name} in guild: ${guild.id}`);
						await command.delete();
					}),
			);
		}),
	);

	// Create or edit commands
	await Promise.all(
		Util.commands.map(async (command) => {
			const applicationCommandData: ChatInputApplicationCommandData = {
				type: ApplicationCommandType.ChatInput,
				name: command.name.default,
				nameLocalizations: command.name.localization.all(),
				description: command.description.default,
				descriptionLocalizations: command.description.localization.all(),
				options: command.options,
				dmPermission: false,
				defaultMemberPermissions: command.userPermissions,
			};

			// Admin commands
			if (command.category === "admin") {
				applicationCommandData.defaultMemberPermissions = [PermissionFlagsBits.Administrator];

				const guild = Util.client.guilds.cache.get(Util.config.ADMIN_GUILD_ID);
				const applicationCommand = guild.commands.cache.find((cmd) => cmd.name === applicationCommandData.name);

				if (!applicationCommand) {
					console.log(`Creating admin application command /${applicationCommandData.name}`);
					await guild.commands.create(applicationCommandData).catch(console.error);
				}

				if (applicationCommand && !applicationCommand.equals(applicationCommandData, true)) {
					console.log(`Editing admin application command /${applicationCommandData.name}`);
					await guild.commands.edit(applicationCommand.id, applicationCommandData).catch(console.error);
				}
			} else {
				if (command.allowedGuildIds) {
					// Guild commands
					for (const guildId of command.allowedGuildIds.filter((id) => Util.client.guilds.cache.has(id))) {
						const guild = Util.client.guilds.cache.get(guildId);
						await guild.commands.fetch();
						const applicationCommand = guild.commands.cache.find((cmd) => cmd.name === applicationCommandData.name);

						if (!applicationCommand) {
							console.log(`Creating application command /${applicationCommandData.name} in guild: ${guildId}`);
							await guild.commands.create(applicationCommandData).catch(console.error);
						}

						if (applicationCommand && !applicationCommand.equals(applicationCommandData, true)) {
							console.log(`Editing application command /${applicationCommandData.name} in guild: ${guildId}`);
							await guild.commands.edit(applicationCommand.id, applicationCommandData).catch(console.error);
						}
					}
				} else {
					// Global commands
					const applicationCommand = Util.client.application.commands.cache.find(
						(cmd) => cmd.name === applicationCommandData.name,
					);

					if (!applicationCommand) {
						console.log(`Creating global application command /${applicationCommandData.name}`);
						await Util.client.application.commands.create(applicationCommandData).catch(console.error);
					}

					if (applicationCommand && !applicationCommand.equals(applicationCommandData, true)) {
						console.log(`Editing global application command /${applicationCommandData.name}`);
						await Util.client.application.commands
							.edit(applicationCommand.id, applicationCommandData)
							.catch(console.error);
					}
				}
			}
		}),
	).catch(console.error);
}
