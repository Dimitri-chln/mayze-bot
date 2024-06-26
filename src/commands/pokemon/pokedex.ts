import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import pagination, { Page } from "../../utils/misc/pagination";
import PokemonList from "../../types/pokemon/PokemonList";
import { VariationType } from "../../utils/pokemon/pokemonInfo";

const command: Command = {
	name: "pokedex",
	aliases: [],
	description: {
		fr: "Obtenir des informations sur un pokémon ou sur ton pokédex",
		en: "Get information about a pokémon or your pokédex",
	},
	usage: "",

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
						required: true,
						autocomplete: true,
					},
				],
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
						required: false,
					},
					{
						name: "uncaught",
						description: "Pokémons que tu n'as pas attrapés uniquement",
						type: "BOOLEAN",
						required: false,
					},
					{
						name: "shiny",
						description: "Pokémons shiny uniquement",
						type: "BOOLEAN",
						required: false,
					},
					{
						name: "legendary",
						description: "Pokémons légendaires uniquement",
						type: "BOOLEAN",
						required: false,
					},
					{
						name: "ultra-beast",
						description: "Chimères uniquement",
						type: "BOOLEAN",
						required: false,
					},
					{
						name: "generation",
						description: "Pokémons d'une certaine génération uniquement",
						type: "INTEGER",
						required: false,
						minValue: 1,
						maxValue: 8,
					},
					{
						name: "alola",
						description: "Pokémons d'Alola uniquement",
						type: "BOOLEAN",
						required: false,
					},
					{
						name: "galar",
						description: "Pokémons de Galar uniquement",
						type: "BOOLEAN",
						required: false,
					},
					{
						name: "mega",
						description: "Pokémons méga uniquement",
						type: "BOOLEAN",
						required: false,
					},
				],
			},
			{
				name: "evo-line",
				description: "Obtenir la ligne d'évolutions d'un pokémon",
				type: "SUB_COMMAND",
				options: [
					{
						name: "pokemon",
						description: "Le pokémon dont tu veux obtenir la ligne d'évolutions",
						type: "STRING",
						required: true,
						autocomplete: true,
					},
				],
			},
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
						required: true,
						autocomplete: true,
					},
				],
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
						required: false,
					},
					{
						name: "uncaught",
						description: "Pokémons you haven't caught only",
						type: "BOOLEAN",
						required: false,
					},
					{
						name: "shiny",
						description: "Shiny pokémons only",
						type: "BOOLEAN",
						required: false,
					},
					{
						name: "legendary",
						description: "Legendary pokémons only",
						type: "BOOLEAN",
						required: false,
					},
					{
						name: "ultra-beast",
						description: "Ultra beasts only",
						type: "BOOLEAN",
						required: false,
					},
					{
						name: "generation",
						description: "Pokémons from a specific generation only",
						type: "INTEGER",
						required: false,
						minValue: 1,
						maxValue: 8,
					},
					{
						name: "alola",
						description: "Alolan pokémons only",
						type: "BOOLEAN",
						required: false,
					},
					{
						name: "galar",
						description: "Galarian pokémons only",
						type: "BOOLEAN",
						required: false,
					},
					{
						name: "mega",
						description: "Mega pokémons only",
						type: "BOOLEAN",
						required: false,
					},
				],
			},
			{
				name: "evo-line",
				description: "Get the evolution line of a pokémon",
				type: "SUB_COMMAND",
				options: [
					{
						name: "pokemon",
						description: "The pokémon whose evolution line to get",
						type: "STRING",
						required: true,
						autocomplete: true,
					},
				],
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const subCommand = interaction.options.getSubcommand();

		switch (subCommand) {
			case "find": {
				const input = interaction.options.getString("pokemon", true);
				const { pokemon, shiny, pokemonVariation } = Util.pokedex.findByNameWithVariation(input) ?? {
					pokemon: Util.pokedex.findById(parseInt(input)),
					shiny: false,
					variationType: "default",
				};

				if (!pokemon) return interaction.followUp(translations.strings.invalid_pokemon());

				interaction.followUp({
					embeds: [
						{
							title: `${pokemon.formatName(
								translations.language,
								shiny,
								pokemonVariation?.variationType ?? "default",
							)} #${pokemon.nationalId.toString().padStart(3, "0")}`,
							color: interaction.guild.me.displayColor,
							image: {
								url: pokemon.image(shiny, pokemonVariation?.variationType ?? "default"),
							},
							fields: [
								{
									name: translations.strings.field_alternative_names(),
									value: Object.keys(pokemon.names)
										.filter((l) => l !== translations.language)
										.map((l) => `${Util.config.LANGUAGE_FLAGS[l]} ${pokemon.names[l]}`)
										.join("\n"),
									inline: true,
								},
								{
									name: translations.strings.field_height(),
									value: pokemon.heightEu,
									inline: true,
								},
								{
									name: translations.strings.field_weight(),
									value: pokemon.weightEu,
									inline: true,
								},
								{
									name: translations.strings.field_base_stats(),
									value: translations.strings.base_stats(
										pokemon.baseStats.hp.toString(),
										pokemon.baseStats.atk.toString(),
										pokemon.baseStats.def.toString(),
										pokemon.baseStats.spAtk.toString(),
										pokemon.baseStats.spDef.toString(),
										pokemon.baseStats.speed.toString(),
									),
									inline: true,
								},
								{
									name: translations.strings.field_forms(),
									value:
										pokemon.variations.length || pokemon.megaEvolutions.length
											? pokemon.variations
													.map((variation) => `• ${variation.names[translations.language]}`)
													.join("\n") +
											  "\n" +
											  pokemon.megaEvolutions
													.map((megaEvolution) => `• ${megaEvolution.names[translations.language]}`)
													.join("\n")
											: "∅",
									inline: true,
								},
								{
									name: translations.strings.field_types(),
									value: pokemon.types.map((type) => `• ${type}`).join("\n"),
									inline: true,
								},
							],
							footer: {
								text: "✨ Mayze ✨",
							},
						},
					],
				});
				break;
			}

			case "list": {
				const { rows: pokemons } = await Util.database.query("SELECT * FROM pokemon WHERE users ? $1", [
					interaction.user.id,
				]);

				const shiny = Boolean(interaction.options.getBoolean("shiny", false));

				const variationType: VariationType = interaction.options.getBoolean("mega", false)
					? "mega"
					: interaction.options.getBoolean("alola", false)
					? "alola"
					: interaction.options.getBoolean("galar", false)
					? "galar"
					: "default";

				const pokemonList = new PokemonList(pokemons, interaction.user.id);

				const userPokedex = Util.pokedex.pokemons.filter((pokemon) => {
					if (interaction.options.getBoolean("caught", false) && !pokemonList.has(pokemon, shiny, variationType))
						return false;

					if (interaction.options.getBoolean("uncaught", false) && pokemonList.has(pokemon, shiny, variationType))
						return false;

					if (interaction.options.getBoolean("legendary", false) && !pokemon.legendary) return false;

					if (interaction.options.getBoolean("ultra-beast", false) && !pokemon.ultraBeast) return false;

					if (
						interaction.options.getInteger("generation", false) &&
						pokemon.generation !== interaction.options.getInteger("generation", false)
					)
						return false;

					if (variationType === "mega" && !Util.pokedex.megaEvolvablePokemons.has(pokemon.nationalId)) return false;

					if (variationType === "alola" && !Util.pokedex.alolaPokemons.has(pokemon.nationalId)) return false;

					if (variationType === "galar" && !Util.pokedex.galarPokemons.has(pokemon.nationalId)) return false;

					return true;
				});

				const pages: Page[] = [];

				if (!userPokedex.length)
					pages.push({
						embeds: [
							{
								author: {
									name: translations.strings.author(interaction.user.tag),
									iconURL: interaction.user.displayAvatarURL({
										dynamic: true,
									}),
								},
								color: interaction.guild.me.displayColor,
								description: translations.strings.no_pokemon(),
							},
						],
					});

				for (let i = 0; i < userPokedex.length; i += Util.config.ITEMS_PER_PAGE) {
					pages.push({
						embeds: [
							{
								author: {
									name: translations.strings.author(interaction.user.tag),
									iconURL: interaction.user.displayAvatarURL({
										dynamic: true,
									}),
								},
								color: interaction.guild.me.displayColor,
								description: userPokedex
									.slice(i, i + Util.config.ITEMS_PER_PAGE)
									.map((pkm) => {
										if (variationType === "mega") {
											return pkm.megaEvolutions.map((megaEvolution) =>
												translations.strings.description(
													pokemonList.has(pkm, shiny, "mega"),
													pkm.formatName(
														translations.language,
														shiny,
														megaEvolution.variationType,
														megaEvolution.variation,
													),
													pkm.nationalId.toString().padStart(3, "0"),
												),
											);
										} else {
											return translations.strings.description(
												pokemonList.has(pkm, shiny, variationType),
												pkm.formatName(translations.language, shiny, variationType),
												pkm.nationalId.toString().padStart(3, "0"),
											);
										}
									})
									.flat(1)
									.join("\n"),
							},
						],
					});
				}

				pagination(interaction, pages);
				break;
			}

			case "evo-line": {
				const pokemon =
					Util.pokedex.findByName(interaction.options.getString("pokemon", true)) ??
					Util.pokedex.findById(parseInt(interaction.options.getString("pokemon", true)));

				if (!pokemon) return interaction.followUp(translations.strings.invalid_pokemon());

				const stringEvolutionLine = pokemon.stringEvolutionLine(translations.language);

				interaction.followUp({
					embeds: [
						{
							author: {
								name: translations.strings.evoline_title(pokemon.names[translations.language] ?? pokemon.names.en),
								iconURL: interaction.client.user.displayAvatarURL(),
							},
							thumbnail: {
								url: `https://assets.poketwo.net/images/${pokemon.nationalId}.png?v=26`,
							},
							color: interaction.guild.me.displayColor,
							description: `\`\`\`\n${stringEvolutionLine}\n\`\`\``,
							footer: {
								text: "✨ Mayze ✨",
							},
						},
					],
				});
				break;
			}
		}
	},
};

export default command;
