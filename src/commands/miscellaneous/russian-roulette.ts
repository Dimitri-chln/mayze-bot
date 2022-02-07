import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";

import { Collection, GuildMember, MessageEmbed } from "discord.js";



const command: Command = {
	name: "russian-roulette",
	description: {
		fr: "Jouer à la roulette russe",
		en: "Play the russian roulette"
	},
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],
	
	options: {
		fr: [
			{
				name: "create",
				description: "Créer une nouvelle partie de roulette russe",
				type: "SUB_COMMAND"
			},
			{
				name: "join",
				description: "Rejoindre la partie de roulette russe en cours",
				type: "SUB_COMMAND"
			},
			{
				name: "delete",
				description: "Supprimer ta partie de roulette russe en cours",
				type: "SUB_COMMAND"
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
								value: "kick"
							},
							{
								name: "Timeout le perdant pendant 5 minutes",
								value: "timeout"
							}
						]
					}
				]
			}
		],
		en: [
			{
				name: "create",
				description: "Create a new russian roulette game",
				type: "SUB_COMMAND"
			},
			{
				name: "join",
				description: "Join the current russian roulette game",
				type: "SUB_COMMAND"
			},
			{
				name: "delete",
				description: "Delete your current russian roulette game",
				type: "SUB_COMMAND"
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
								value: "kick"
							},
							{
								name: "Timeout the loser for 5 minutes",
								value: "timeout"
							}
						]
					}
				]
			}
		]
	},
	
	run: async (interaction, translations) => {
		const subCommand = interaction.options.getSubcommand();

		const currentGame = Util.russianRouletteGames.get(interaction.channel.id);

		switch (subCommand) {
			case "create": {
				if (currentGame) return interaction.reply({
					content: translations.data.already_running(),
					ephemeral: true
				});

				const newGame: typeof currentGame = {
					creator: interaction.member as GuildMember,
					members: new Collection()
				};

				Util.russianRouletteGames.set(interaction.channel.id, newGame);

				interaction.reply({
					embeds: [
						{
							author: {
								name: translations.data.created_title(),
								iconURL: interaction.user.displayAvatarURL({ dynamic: true })
							},
							color: interaction.guild.me.displayColor,
							description: translations.data.created_description(),
							footer: {
								text: "✨ Mayze ✨"
							}
						}
					]
				});
				break;
			}

			case "join": {
				if (!currentGame) return interaction.reply({
					content: translations.data.no_game(),
					ephemeral: true
				});
				
				if (currentGame.members.has(interaction.user.id)) return interaction.reply({
					content: translations.data.already_joined(),
					ephemeral: true
				});
				
				currentGame.members.set(interaction.user.id, interaction.member as GuildMember);

				interaction.reply(
					translations.data.joined(interaction.user.toString())
				);
				break;
			}

			case "delete": {
				if (!currentGame) return interaction.reply({
					content: translations.data.no_game(),
					ephemeral: true
				});

				if (
					currentGame.creator.id !== interaction.user.id &&
					!(interaction.member as GuildMember).permissions.has("KICK_MEMBERS")
				) return interaction.reply({
					content: translations.data.deletion_not_allowed(),
					ephemeral: true
				});

				Util.russianRouletteGames.delete(interaction.channel.id);

				interaction.reply(translations.data.deleted());
				break;
			}

			case "start": {
				if (!currentGame) return interaction.reply({
					content: translations.data.no_game(),
					ephemeral: true
				});

				if (
					currentGame.creator.id !== interaction.user.id &&
					!(interaction.member as GuildMember).permissions.has("KICK_MEMBERS")
				) return interaction.reply({
					content: translations.data.starting_not_allowed(),
					ephemeral: true
				});

				if (currentGame.members.size < 2) return interaction.reply({
					content: translations.data.not_enough_players(),
					ephemeral: true
				});
				
				const embed = new MessageEmbed()
					.setAuthor({
						name: "La partie de roulette russe a commencé!",
						iconURL: interaction.user.displayAvatarURL({ dynamic: true })
					})
					.setColor(interaction.guild.me.displayColor)
					.setDescription("...")
					.setFooter({
						text: "✨ Mayze ✨"
					});

				const reply = await interaction.reply({
					embeds: [ embed ],
					fetchReply: true
				}) as Message;
				
				await roulette(reply, embed, currentGame);

				Util.russianRouletteGames.delete(interaction.channel.id);
				break;
			}
		}

		async function roulette(message: Message, embed: MessageEmbed, game: typeof currentGame, i: number = 0) {
			if (game.members.size > 1 && i < 5) {
				setTimeout(() => {
					const savedPlayer = game.members.random();
					game.members.delete(savedPlayer.user.id);
					
					message.edit({
						embeds: [ embed.setDescription(`**${savedPlayer.user.tag}** ...`) ]
					}).catch(console.error);
					
					roulette(message, embed, game, i + 1);
				}, 2000);
			
			} else {
				setTimeout(() => {
					const deadPlayer = game.members.random();
					
					message.edit({
						embeds: [ embed.setDescription(translations.data.dead(deadPlayer.user.tag)) ]
					}).catch(console.error);

					const gameOption = interaction.options.getString("options") as "kick" | "timeout";
					
					switch (gameOption) {
						case "kick": {
							if (
								deadPlayer.roles.highest.position < interaction.guild.me.roles.highest.position &&
								!deadPlayer.premiumSinceTimestamp
							) deadPlayer.kick(translations.data.reason());
							break;
						}

						case "timeout": {
							deadPlayer.timeout(5 * 60 * 1000, translations.data.reason());
							break;
						}
					}
				}, 2000);
			}
		}
	}
};



export default command;