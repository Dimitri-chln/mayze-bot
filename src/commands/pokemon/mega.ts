import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import LanguageStrings from "../../types/structures/LanguageStrings";
import Util from "../../Util";

import Pokedex from "../../types/pokemon/Pokedex";
import groupArrayBy from "../../utils/misc/groupArrayBy";



const command: Command = {
	name: "mega",
	description: {
		fr: "Gérer tes méga gemmes",
		en: "Manage your mega gems"
	},
	userPermissions: [],
	botPermissions: ["ADD_REACTIONS"],
	
	options: {
		fr: [
			{
				name: "evolve",
				description: "Faire méga évoluer un pokémon",
				type: "SUB_COMMAND",
				options: [
					{
						name: "pokemon",
						description: "Le pokémon à faire méga évoluer",
						type: "STRING",
						required: true
					},
					{
						name: "type",
						description: "Le type de méga évolution",
						type: "STRING",
						required: true,
						choices: [
							{
								name: "Méga",
								value: "mega"
							},
							{
								name: "Méga X",
								value: "megax"
							},
							{
								name: "Méga Y",
								value: "megay"
							},
							{
								name: "Primal",
								value: "primal"
							}
						]
					},
					{
						name: "shiny",
						description: "Si le pokémon à méga évoluer est shiny ou non",
						type: "BOOLEAN",
						required: false
					}
				]
			},
			{
				name: "gems",
				description: "Voir la liste de tes méga gemmes",
				type: "SUB_COMMAND"
			}
		],
		en: [
			{
				name: "evolve",
				description: "Mega evolve a pokémon",
				type: "SUB_COMMAND",
				options: [
					{
						name: "pokemon",
						description: "The pokémon to mega evolve",
						type: "STRING",
						required: true
					},
					{
						name: "type",
						description: "The mega evolution type",
						type: "STRING",
						required: true,
						choices: [
							{
								name: "Mega",
								value: "mega"
							},
							{
								name: "Mega X",
								value: "megax"
							},
							{
								name: "Mega Y",
								value: "megay"
							},
							{
								name: "Primal",
								value: "primal"
							}
						]
					},
					{
						name: "shiny",
						description: "Whether to mega evolve a shiny pokémon or not",
						type: "BOOLEAN",
						required: false
					}
				]
			},
			{
				name: "gems",
				description: "See the list of your mega gems",
				type: "SUB_COMMAND"
			}
		]
	},
	
	run: async (interaction: CommandInteraction, languageStrings: LanguageStrings) => {
		const subCommand = interaction.options.getSubcommand();
		
		const { rows: [ { gems } ] } = await Util.database.query(
			"SELECT * FROM mega_gems WHERE user_id = $1",
			[ interaction.user.id ]
		);
		
		switch (subCommand) {
			case "evolve": {
				const pokemon = Pokedex.findByName(interaction.options.getString("pokemon"));
				const megaType = interaction.options.getString("type");
				const shiny = interaction.options.getBoolean("shiny") ?? false;

				const { rows: [ pokemonData ] } = await Util.database.query(
					"SELECT * FROM pokemons WHERE pokedex_id = $1 AND shiny = $2 AND variation = 'default' AND users ? $3",
					[ pokemon.nationalId, shiny, interaction.user.id ]
				);
				
				if (!pokemonData) return interaction.reply({
					content: languageStrings.data.pokemon_not_owned(),
					ephemeral: true
				});

				const megaEvolution = pokemon.megaEvolutions.find(mega => mega.suffix === megaType);
				
				if (!megaEvolution) return interaction.reply({
					content: languageStrings.data.invalid_mega_evolution(),
					ephemeral: true
				});

				if (!gems[megaEvolution.megaStone]) return interaction.reply({
					content: languageStrings.data.no_mega_gem(megaEvolution.megaStone),
					ephemeral: true
				});

				Util.database.query(
					`
					UPDATE mega_gems
					SET gems =
						CASE
							WHEN (gems -> $1)::int = 1 THEN gems - $1
							ELSE jsonb_set(gems, '{${megaEvolution.megaStone}}', ((gems -> $1)::int - 1)::text::jsonb)
						END
					WHERE user_id = $2
					`,
					[ megaEvolution.megaStone, interaction.user.id ]
				);
	
				const defaultData = {};
				defaultData[interaction.user.id] = { caught: 1, favorite: false, nickname: null };
				const defaultUserData = { caught: 1, favorite: false, nickname: null };
	
				Util.database.query(
					`
					INSERT INTO pokemons VALUES ($1, $2, $3, $4, $5)
					ON CONFLICT (pokedex_id, shiny, variation)
					DO UPDATE SET users =
						CASE
							WHEN pokemons.users -> $6 IS NULL THEN jsonb_set(pokemons.users, '{${interaction.user.id}}', $7)
							ELSE jsonb_set(pokemons.users, '{${interaction.user.id}, caught}', ((pokemons.users -> $6 -> 'caught')::int + 1)::text::jsonb)
						END
					WHERE pokemons.pokedex_id = EXCLUDED.pokedex_id AND pokemons.shiny = EXCLUDED.shiny AND pokemons.variation = EXCLUDED.variation
					`,
					[ pokemon.nationalId, pokemon.names.en, shiny, megaEvolution.suffix, defaultData, interaction.user.id, defaultUserData ]
				);
	
				Util.database.query(
					`
					UPDATE pokemons
					SET users =
						CASE
							WHEN (users -> $1 -> 'caught')::int = 1 THEN users - $1
							ELSE jsonb_set(users, '{${interaction.user.id}, caught}', ((users -> $1 -> 'caught')::int - 1)::text::jsonb)
						END
					WHERE pokedex_id = $2 AND shiny = $3 AND variation = $4
					`,
					[ interaction.user.id, pokemon.nationalId, shiny, "default" ]
				);
	
				const reply = await interaction.reply({
					embeds: [
						{
							author: {
								name: languageStrings.data.evolving_title(interaction.user.tag),
								iconURL: interaction.user.displayAvatarURL({ dynamic: true })
							},
							color: interaction.guild.me.displayColor,
							thumbnail: {
								url: pokemon.image(shiny, "default")
							},
							description: languageStrings.data.evolving(
								pokemon.formatName(shiny, "default", languageStrings.language)
							)
						}
					],
					fetchReply: true
				}) as Message;
				
				setTimeout(() => {
					reply.edit({
						embeds: [
							reply.embeds[0]
								.setThumbnail(pokemon.image(shiny, megaEvolution.suffix))
								.setDescription(
									languageStrings.data.evolved(
										pokemon.formatName(shiny, "default", languageStrings.language),
										pokemon.formatName(shiny, megaEvolution.suffix, languageStrings.language)
									)
								)
						]
					});
				}, 3_000);
				break;
			}

			case "gems": {
				const gemList = groupArrayBy(Object.entries(gems), 2);
	
				interaction.reply({
					embeds: [
						{
							author: {
								name: languageStrings.data.title(interaction.user.tag),
								iconURL: interaction.user.displayAvatarURL({ dynamic: true })
							},
							color: interaction.guild.me.displayColor,
							// U+00d7 : ×
							description: `\`\`\`\n${gemList.map(group => group.map(([ gem, number ]) => `${gem} \u00d7${number}`.padEnd(20, " ")).join(" ")).join("\n")}\n\`\`\``,
							footer: {
								text: "✨ Mayze ✨"
							}
						}
					]
				});
				break;
			}
		}
	}
};



export default command;