import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import { Collection, GuildMember, MessageEmbed } from "discord.js";
import { sleep } from "../../utils/misc/sleep";

const command: Command = {
	name: "russian-roulette",
	aliases: [],
	description: {
		fr: "Jouer à la roulette russe",
		en: "Play the russian roulette",
	},
	usage: "",
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],

	options: {
		fr: [
			{
				name: "create",
				description: "Créer une nouvelle partie de roulette russe",
				type: "SUB_COMMAND",
			},
			{
				name: "join",
				description: "Rejoindre la partie de roulette russe en cours",
				type: "SUB_COMMAND",
			},
			{
				name: "delete",
				description: "Supprimer ta partie de roulette russe en cours",
				type: "SUB_COMMAND",
			},
			{
				name: "start",
				description: "Lancer la partie de roulette russe créée",
				type: "SUB_COMMAND",
				options: [
					{
						name: "option",
						description: "Option pour la partie",
						type: "STRING",
						required: false,
						choices: [
							{
								name: "Expulser le perdant du serveur",
								value: "kick",
							},
							{
								name: "Timeout le perdant pendant 5 minutes",
								value: "timeout",
							},
						],
					},
				],
			},
		],
		en: [
			{
				name: "create",
				description: "Create a new russian roulette game",
				type: "SUB_COMMAND",
			},
			{
				name: "join",
				description: "Join the current russian roulette game",
				type: "SUB_COMMAND",
			},
			{
				name: "delete",
				description: "Delete your current russian roulette game",
				type: "SUB_COMMAND",
			},
			{
				name: "start",
				description: "Start the current russian roulette game",
				type: "SUB_COMMAND",
				options: [
					{
						name: "option",
						description: "Game option",
						type: "STRING",
						required: false,
						choices: [
							{
								name: "Kick the loser from the server",
								value: "kick",
							},
							{
								name: "Timeout the loser for 5 minutes",
								value: "timeout",
							},
						],
					},
				],
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const subCommand = interaction.options.getSubcommand();

		const currentGame = Util.russianRouletteGames.get(interaction.channel.id);

		switch (subCommand) {
			case "create": {
				if (currentGame) return interaction.followUp(translations.strings.already_running());

				const newGame: typeof currentGame = {
					creator: interaction.member as GuildMember,
					members: new Collection(),
				};

				newGame.members.set(interaction.user.id, interaction.member as GuildMember);

				Util.russianRouletteGames.set(interaction.channel.id, newGame);

				interaction.followUp({
					embeds: [
						{
							author: {
								name: translations.strings.created_title(),
								iconURL: interaction.user.displayAvatarURL({
									dynamic: true,
								}),
							},
							color: interaction.guild.me.displayColor,
							description: translations.strings.created_description(),
							footer: {
								text: "✨ Mayze ✨",
							},
						},
					],
				});
				break;
			}

			case "join": {
				if (!currentGame) return interaction.followUp(translations.strings.no_game());

				if (currentGame.members.has(interaction.user.id))
					return interaction.followUp(translations.strings.already_joined());

				currentGame.members.set(interaction.user.id, interaction.member as GuildMember);

				interaction.followUp(translations.strings.joined(interaction.user.toString()));
				break;
			}

			case "delete": {
				if (!currentGame) return interaction.followUp(translations.strings.no_game());

				if (
					currentGame.creator.id !== interaction.user.id &&
					!(interaction.member as GuildMember).permissions.has("KICK_MEMBERS")
				)
					return interaction.followUp(translations.strings.deletion_not_allowed());

				Util.russianRouletteGames.delete(interaction.channel.id);

				interaction.followUp(translations.strings.deleted());
				break;
			}

			case "start": {
				if (!currentGame) return interaction.followUp(translations.strings.no_game());

				if (
					currentGame.creator.id !== interaction.user.id &&
					!(interaction.member as GuildMember).permissions.has("KICK_MEMBERS")
				)
					return interaction.followUp(translations.strings.starting_not_allowed());

				if (currentGame.members.size < 2) return interaction.followUp(translations.strings.not_enough_players());

				const embed = new MessageEmbed()
					.setAuthor({
						name: translations.strings.started(),
						iconURL: interaction.user.displayAvatarURL({
							dynamic: true,
						}),
					})
					.setColor(interaction.guild.me.displayColor)
					.setDescription("...")
					.setFooter({
						text: "✨ Mayze ✨",
					});

				const reply = (await interaction.followUp({
					embeds: [embed],
					fetchReply: true,
				})) as Message;

				for (let i = 0; i < 5; i++) {
					if (currentGame.members.size === 1) break;

					await sleep(2_000);

					const savedPlayer = currentGame.members.random();
					currentGame.members.delete(savedPlayer.user.id);

					reply
						.edit({
							embeds: [embed.setDescription(`**${savedPlayer.user.tag}** ...`)],
						})
						.catch(console.error);
				}

				await sleep(2_000);

				const deadPlayer = currentGame.members.random();

				interaction.editReply({
					embeds: [embed.setDescription(translations.strings.dead(deadPlayer.user.tag))],
				});

				const gameOption = interaction.options.getString("option", false) as "kick" | "timeout";

				switch (gameOption) {
					case "kick": {
						if (
							deadPlayer.roles.highest.position < interaction.guild.me.roles.highest.position &&
							!deadPlayer.premiumSinceTimestamp
						)
							deadPlayer.kick(translations.strings.reason());
						break;
					}

					case "timeout": {
						if (deadPlayer.roles.highest.position < interaction.guild.me.roles.highest.position)
							deadPlayer.timeout(5 * 60 * 1000, translations.strings.reason());
						break;
					}
				}

				Util.russianRouletteGames.delete(interaction.channel.id);
				break;
			}
		}
	},
};

export default command;
