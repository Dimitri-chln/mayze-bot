import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";

import Pokedex from "../../types/pokemon/Pokedex";
import Pokemon from "../../types/pokemon/Pokemon";
import pagination, { Page } from "../../utils/misc/pagination";
import PokemonList from "../../types/pokemon/PokemonList";



const command: Command = {
	name: "pokedex",
	description: {
		fr: "Obtenir des informations sur un pokémon ou sur ton pokédex",
		en: "Get information about a pokémon or your pokédex"
	},
	
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],
	
	options: {
		fr: [
			{
				name: "find",
				description: "Trouver un pokémon en particulier dans le pokédex",
				type: "SUB_COMMAND",
				options: [
					{
						name: "pokemon",
						description: "Le nom ou l'ID du pokémon",
						type: "STRING",
						required: true
					}
				]
			},
			{
				name: "list",
				description: "Voir ton pokédex",
				type: "SUB_COMMAND",
				options: [
					{
						name: "caught",
						description: "Pokémons que tu as attrapés uniquement",
						type: "BOOLEAN",
						required: false
					},
					{
						name: "uncaught",
						description: "Pokémons que tu n'as pas attrapés uniquement",
						type: "BOOLEAN",
						required: false
					},
					{
						name: "shiny",
						description: "Pokémons shiny uniquement",
						type: "BOOLEAN",
						required: false
					},
					{
						name: "legendary",
						description: "Pokémons légendaires uniquement",
						type: "BOOLEAN",
						required: false
					},
					{
						name: "ultra-beast",
						description: "Chimères uniquement",
						type: "BOOLEAN",
						required: false
					},
					{
						name: "alola",
						description: "Pokémons d'Alola uniquement",
						type: "BOOLEAN",
						required: false
					},
					{
						name: "mega",
						description: "Pokémons méga uniquement",
						type: "BOOLEAN",
						required: false
					}
				]
			}
		],
		en: [
			{
				name: "find",
				description: "Find a particular pokémon in the pokédex",
				type: "SUB_COMMAND",
				options: [
					{
						name: "pokemon",
						description: "The pokémon's name or ID",
						type: "STRING",
						required: true
					}
				]
			},
			{
				name: "list",
				description: "See your pokédex",
				type: "SUB_COMMAND",
				options: [
					{
						name: "caught",
						description: "Pokémons you caught only",
						type: "BOOLEAN",
						required: false
					},
					{
						name: "uncaught",
						description: "Pokémons you haven't caught only",
						type: "BOOLEAN",
						required: false
					},
					{
						name: "shiny",
						description: "Shiny pokémons only",
						type: "BOOLEAN",
						required: false
					},
					{
						name: "legendary",
						description: "Legendary pokémons only",
						type: "BOOLEAN",
						required: false
					},
					{
						name: "ultra-beast",
						description: "Ultra beasts only",
						type: "BOOLEAN",
						required: false
					},
					{
						name: "alola",
						description: "Alolan pokémons only",
						type: "BOOLEAN",
						required: false
					},
					{
						name: "mega",
						description: "Mega pokémons only",
						type: "BOOLEAN",
						required: false
					}
				]
			}
		]
	},
	
	run: async (interaction: CommandInteraction, translations: Translations) => {
		const { getPokemonVariation, getCleanName } = require("../utils/pokemonInfo");
		
		const subCommand = interaction.options.getSubcommand();
		
		switch (subCommand) {
			case "find": {
				const input = interaction.options.getString("pokemon");
				const pokemonWithVariation = Pokedex.findByNameWithVariation(input);
				
				const pokemon = pokemonWithVariation
					? pokemonWithVariation.pokemon
					: Pokedex.findById(parseInt(input));
				const shiny = pokemonWithVariation
					? pokemonWithVariation.shiny
					: false;
				const variation = pokemonWithVariation
					? pokemonWithVariation.variationType
					: "default";
					
				if (!pokemon) return interaction.reply({
					content: translations.data.invalid_pokemon(),
					ephemeral: true
				});

				interaction.reply({
					embeds: [
						{
							title: `${pokemon.formatName(shiny, variation, translations.language)} #${pokemon.nationalId.toString().padStart(3, "0")}`,
							color: interaction.guild.me.displayColor,
							image: {
								url: pokemon.image(shiny, variation)
							},
							fields: [
								{
									name: translations.data.field_alternative_names(),
									value: Object.keys(pokemon.names).filter(l => l !== translations.language).map(l => `${Util.config.LANUAGE_FLAGS[l]} ${pokemon.names[l]}`).join("\n"),
									inline: true
								},
								{
									name: translations.data.field_height(),
									value: pokemon.heightEu,
									inline: true
								},
								{
									name: translations.data.field_weight(),
									value: pokemon.weightEu,
									inline: true
								},
								{
									name: translations.data.field_base_stats(),
									value: translations.data.base_stats(
										pokemon.baseStats.hp.toString(),
										pokemon.baseStats.atk.toString(),
										pokemon.baseStats.def.toString(),
										pokemon.baseStats.spAtk.toString(),
										pokemon.baseStats.spDef.toString(),
										pokemon.baseStats.speed.toString()
									),
									inline: true
								},
								{
									name: translations.data.field_forms(),
									value: 
										pokemon.variations.map(variation => `• ${variation.names[translations.language]}`).join("\n") + "\n" +
										pokemon.megaEvolutions.map(megaEvolution => `• ${megaEvolution.names[translations.language]}`).join("\n"),
									inline: true
								},
								{
									name: translations.data.field_types(),
									value: pokemon.types.map(type => `• ${type}`).join("\n"),
									inline: true
								}
							],
							footer: {
								text: "✨ Mayze ✨"
							}
						}
					]
				});
				break;
			}

			case "list": {
				const { rows: pokemons } = await Util.database.query(
					"SELECT * FROM pokemons WHERE users ? $1",
					[ interaction.user.id ]
				);

				const pokemonList = new PokemonList(pokemons, interaction.user.id);
				
				const userPokedex = Pokedex.pokemons.filter(pokemon => {
					if (interaction.options.getBoolean("caught") && !pokemonList.has(pokemon)) return false;
					if (interaction.options.getBoolean("uncaught") && pokemonList.has(pokemon)) return false;
					if (interaction.options.getBoolean("legendary") && !pokemon.legendary) return false;
					if (interaction.options.getBoolean("ultra-beast") && !pokemon.ultraBeast) return false;
					if (interaction.options.getBoolean("alola") && !pokemon.variations.some(variation => variation.suffix === "alola")) return false;
					if (interaction.options.getBoolean("mega") && !pokemon.megaEvolutions.length) return false;

					return true;
				});

				const shiny = interaction.options.getBoolean("shiny") ?? false;

				const pages: Page[] = [];
				const page: Page = {
					embeds: [
						{
							author: {
								name: translations.data.title(interaction.user.tag),
								iconURL: interaction.user.displayAvatarURL({ dynamic: true })
							},
							color: interaction.guild.me.displayColor,
							description: translations.data.no_pokemon()
						}
					]
				};
				if (!userPokedex.length) pages.push(page);

				for (let i = 0; i < userPokedex.length; i += Util.config.ITEMS_PER_PAGE) {
					page.embeds[0].description = userPokedex
						.slice(i, i + Util.config.ITEMS_PER_PAGE)
						.map(pkm => {
							if (interaction.options.getBoolean("mega")) {
								return pkm.megaEvolutions.map(megaEvolution => translations.data.description(
									pokemonList.has(pkm),
									pkm.formatName(shiny, megaEvolution.suffix, translations.language),
									pkm.nationalId.toString().padStart(3, "0")
								)).join("\n");
							
							} else {
								const variationType = interaction.options.getBoolean("alola")
									? "alola"
									: "default";
								
								return translations.data.description(
									pokemonList.has(pkm),
									pkm.formatName(shiny, variationType, translations.language),
									pkm.nationalId.toString().padStart(3, "0")
								);
							}
						}).join("\n");
					
					pages.push(page);
				};
				
				pagination(interaction, pages);
				break;
			}
		}
	}
};



export default command;