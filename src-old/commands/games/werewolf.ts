import { ButtonInteraction, CollectorFilter, Message, TextChannel } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import { Collection, GuildMember } from "discord.js";
import Game from "../../types/werewolf/Game";
import composition from "../../assets/werewolf-composition.json";
import shuffle from "../../utils/misc/shuffle";

const command: Command = {
	name: "werewolf",
	aliases: [],
	description: {
		fr: "Jouer une partie de Loup-garou sur Discord",
		en: "Play a game of Werewolf on Discord",
	},
	usage: "join | leave | start | end | config | players",
	userPermissions: [],
	botPermissions: ["EMBED_LINKS", "MANAGE_ROLES", "MANAGE_CHANNELS"],
	guildIds: [Util.config.MAIN_GUILD_ID, "724530039781326869"],

	options: {
		fr: [
			{
				name: "join",
				description: "Rejoindre la prochaine partie de Loup-garou",
				type: "SUB_COMMAND",
			},
			{
				name: "leave",
				description: "Quitter la prochaine partie de Loup-garou",
				type: "SUB_COMMAND",
			},
			{
				name: "start",
				description: "Commencer une nouvelle partie de Loup-garou",
				type: "SUB_COMMAND",
			},
			{
				name: "end",
				description: "Arrêter la partie de Loup-garou en cours",
				type: "SUB_COMMAND",
			},
			{
				name: "config",
				description: "Voir la configuration des rôles et salons pour les parties Loup-garou",
				type: "SUB_COMMAND",
			},
			{
				name: "players",
				description: "Voir la liste des joueurs de la partie de Loup-garou en cours",
				type: "SUB_COMMAND",
			},
		],
		en: [
			{
				name: "join",
				description: "Join the next Werewolf game",
				type: "SUB_COMMAND",
			},
			{
				name: "leave",
				description: "Leave the next Werewolf game",
				type: "SUB_COMMAND",
			},
			{
				name: "start",
				description: "Start a new Werewolf game",
				type: "SUB_COMMAND",
			},
			{
				name: "end",
				description: "End the ongoing Werewolf game",
				type: "SUB_COMMAND",
			},
			{
				name: "config",
				description: "Get the channels and roles config for Werewolf games",
				type: "SUB_COMMAND",
			},
			{
				name: "players",
				description: "Get the list of all players of the ongoing Werewolf game",
				type: "SUB_COMMAND",
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const subCommand = interaction.options.getSubcommand(true);

		const {
			INGAME_ROLE_ID,
			VILLAGE_ROLE_ID,
			WEREWOLVES_ROLE_ID,
			VILLAGE_CHANNEL_ID,
			WEREWOLVES_CHANNEL_ID,
			DEAD_CHANNEL_ID,
		} = Util.config.WEREWOLF[interaction.guild.id];

		const ingameRole = interaction.guild.roles.cache.get(INGAME_ROLE_ID);
		const villageRole = interaction.guild.roles.cache.get(VILLAGE_ROLE_ID);
		const werewolvesRole = interaction.guild.roles.cache.get(WEREWOLVES_ROLE_ID);
		const villageChannel = interaction.guild.channels.cache.get(VILLAGE_CHANNEL_ID) as TextChannel;
		const werewolvesChannel = interaction.guild.channels.cache.get(WEREWOLVES_CHANNEL_ID) as TextChannel;
		const deadChannel = interaction.guild.channels.cache.get(DEAD_CHANNEL_ID) as TextChannel;

		const runningGame = Util.werewolfGames.get(interaction.guild.id);

		switch (subCommand) {
			case "join": {
				if (runningGame && !runningGame.ended) return interaction.followUp(translations.strings.already_ongoing());
				if (ingameRole.members.size >= 16) return interaction.followUp(translations.strings.max_players());

				const unJailedRoles = (interaction.member as GuildMember).roles.cache.filter(
					(role) =>
						role.permissions.has("ADMINISTRATOR") &&
						interaction.guild.roles.cache.some((r) => r.name === role.name + " (Jailed)"),
				);

				const jailedRoles = interaction.guild.roles.cache.filter((role) =>
					(interaction.member as GuildMember).roles.cache.some(
						(r) => r.permissions.has("ADMINISTRATOR") && role.name === r.name + " (Jailed)",
					),
				);

				await (interaction.member as GuildMember).roles.remove(unJailedRoles);
				await (interaction.member as GuildMember).roles.add(jailedRoles);
				await (interaction.member as GuildMember).roles.add(ingameRole);

				if (interaction.channel.id !== villageChannel.id)
					villageChannel.send(translations.strings.joined(interaction.user.toString()));

				interaction.followUp(translations.strings.joined(interaction.user.toString()));
				break;
			}

			case "leave": {
				if (runningGame && !runningGame.ended) return interaction.followUp(translations.strings.already_started());

				const unJailedRoles = interaction.guild.roles.cache.filter(
					(role) =>
						role.permissions.has("ADMINISTRATOR") &&
						(interaction.member as GuildMember).roles.cache.some((r) => r.name === role.name + " (Jailed)"),
				);

				const jailedRoles = (interaction.member as GuildMember).roles.cache.filter((role) =>
					interaction.guild.roles.cache.some(
						(r) => r.permissions.has("ADMINISTRATOR") && role.name === r.name + " (Jailed)",
					),
				);

				await (interaction.member as GuildMember).roles.add(unJailedRoles).catch(console.error);
				await (interaction.member as GuildMember).roles.remove(jailedRoles).catch(console.error);
				await (interaction.member as GuildMember).roles.remove(ingameRole);

				if (interaction.channel.id !== villageChannel.id)
					villageChannel.send(translations.strings.left(interaction.user.toString()));

				interaction.followUp(translations.strings.left(interaction.user.toString()));
				break;
			}

			case "start": {
				if (
					!(interaction.member as GuildMember).permissions.has("ADMINISTRATOR") &&
					interaction.user.id !== Util.owner.id
				)
					return interaction.followUp(translations.strings.not_allowed());

				if (interaction.channel.id !== villageChannel.id)
					return interaction.followUp(translations.strings.wrong_channel());

				if (runningGame && !runningGame.ended) return interaction.followUp(translations.strings.already_started());

				const startMessage = (await interaction
					.followUp({
						content: ingameRole.toString(),
						embeds: [
							{
								author: {
									name: translations.strings.start_title(),
									iconURL: interaction.client.user.displayAvatarURL(),
								},
								color: interaction.guild.me.displayColor,
								description: translations.strings.start_description(),
								footer: {
									text: "🐺 Mayze 🐺",
								},
							},
						],
						components: [
							{
								type: "ACTION_ROW",
								components: [
									{
										type: "BUTTON",
										customId: "confirm",
										label: translations.strings.play(),
										emoji: "🐺",
										style: "SECONDARY",
									},
								],
							},
						],
						allowedMentions: {
							roles: [ingameRole.id],
						},
					})
					.catch(console.error)) as Message;

				if (!startMessage) return;

				const playingMembers: Collection<string, GuildMember> = new Collection();

				const filter: CollectorFilter<[ButtonInteraction]> = (buttonInteraction) =>
					ingameRole.members.has(buttonInteraction.user.id);

				const collector = startMessage.createMessageComponentCollector({
					componentType: "BUTTON",
					filter: filter,
					time: 30_000,
				});

				collector.on("collect", (buttonInteraction) => {
					if (playingMembers.has(buttonInteraction.user.id)) {
						buttonInteraction.reply({
							content: translations.strings.already_joined(),
							ephemeral: true,
						});
					} else {
						playingMembers.set(buttonInteraction.user.id, buttonInteraction.member as GuildMember);
						buttonInteraction.reply(
							translations.strings.playing(buttonInteraction.user.tag, playingMembers.size.toString()),
						);
					}
				});

				collector.on("end", async () => {
					interaction.editReply({
						content: ingameRole.toString(),
						embeds: [
							{
								author: {
									name: translations.strings.start_title(),
									iconURL: interaction.client.user.displayAvatarURL(),
								},
								color: interaction.guild.me.displayColor,
								description: translations.strings.start_description(),
								footer: {
									text: "🐺 Mayze 🐺",
								},
							},
						],
						components: [
							{
								type: "ACTION_ROW",
								components: [
									{
										type: "BUTTON",
										customId: "confirm",
										label: translations.strings.play(),
										emoji: "🐺",
										style: "SECONDARY",
										disabled: true,
									},
								],
							},
						],
					});

					if (playingMembers.size < 4) {
						interaction.followUp(translations.strings.not_enough_players());
						return;
					}

					ingameRole.members.forEach(async (member) => {
						if (playingMembers.has(member.user.id)) return;

						const unJailedRoles = interaction.guild.roles.cache.filter(
							(role) =>
								role.permissions.has("ADMINISTRATOR") &&
								(interaction.member as GuildMember).roles.cache.some((r) => r.name === role.name + " (Jailed)"),
						);

						const jailedRoles = (interaction.member as GuildMember).roles.cache.filter((role) =>
							interaction.guild.roles.cache.some(
								(r) => r.permissions.has("ADMINISTRATOR") && role.name === r.name + " (Jailed)",
							),
						);

						await (interaction.member as GuildMember).roles.add(unJailedRoles).catch(console.error);
						await (interaction.member as GuildMember).roles.remove(jailedRoles).catch(console.error);
						await (interaction.member as GuildMember).roles.remove(ingameRole);
					});

					const game = await new Game(
						interaction.guild,
						{
							ingameRole,
							villageRole,
							werewolvesRole,
							villageChannel,
							werewolvesChannel,
							deadChannel,
						},
						translations.language,
						playingMembers,
					).init();

					Util.werewolfGames.set(interaction.guild.id, game);

					game.start();
				});
				break;
			}

			case "end": {
				if (
					!(interaction.member as GuildMember).permissions.has("ADMINISTRATOR") &&
					interaction.user.id !== Util.owner.id
				)
					return interaction.followUp(translations.strings.not_allowed());

				if (interaction.channel.id !== villageChannel.id)
					return interaction.followUp(translations.strings.wrong_channel());

				if (!runningGame) return interaction.followUp(translations.strings.no_game());

				runningGame.end();
				break;
			}

			case "config": {
				interaction.followUp({
					embeds: [
						{
							title: translations.strings.config_title(),
							color: interaction.guild.me.displayColor,
							description: translations.strings.config_description(
								ingameRole.toString(),
								villageRole.toString(),
								werewolvesRole.toString(),
								villageChannel.toString(),
								werewolvesChannel.toString(),
								deadChannel.toString(),
								Object.values(composition.roles)
									.map(
										(role) =>
											interaction.guild.roles.cache.find((r) => r.name === role[translations.language])?.toString() ??
											`~~${role[translations.language]}~~`,
									)
									.join(", "),
							),
							footer: {
								text: "🐺 Mayze 🐺",
							},
						},
					],
				});
				break;
			}

			case "players": {
				if (runningGame && !runningGame.ended) {
					const players = runningGame.players.all;

					interaction.followUp({
						embeds: [
							{
								author: {
									name: translations.strings.player_list(),
									iconURL: interaction.client.user.displayAvatarURL(),
								},
								color: interaction.guild.me.displayColor,
								fields: [
									{
										name: translations.strings.fields()[0],
										value: players
											.map((player, i) => {
												if (player.alive) return `\`${i + 1}.\` ${player.member.user.tag}`;
												return `\`${i + 1}.\` ~~${player.member.user.tag}~~ (${player.role})`;
											})
											.join("\n"),
										inline: true,
									},
									{
										name: translations.strings.fields()[1],
										value: shuffle(players)
											.map((player) => `• ${player.role}`)
											.join("\n"),
										inline: true,
									},
								],
								footer: {
									text: "🐺 Mayze 🐺",
								},
							},
						],
					});
				} else {
					interaction.followUp({
						embeds: [
							{
								author: {
									name: translations.strings.player_list(),
									iconURL: interaction.client.user.displayAvatarURL(),
								},
								color: interaction.guild.me.displayColor,
								description: ingameRole.members.size
									? Array.from(ingameRole.members)
											.map(([, m], i) => `\`${i + 1}.\` ${m.user.tag}`)
											.join("\n")
									: translations.strings.no_player(),
								footer: {
									text: "🐺 Mayze 🐺",
								},
							},
						],
					});
				}
				break;
			}
		}
	},
};

export default command;
