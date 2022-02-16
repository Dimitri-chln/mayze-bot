import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import pagination, { Page } from "../../utils/misc/pagination";
import PokemonList from "../../types/pokemon/PokemonList";

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
						name: "alola",
						description: "Pokémons d'Alola uniquement",
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
				name: "evoline",
				description: "Obtenir la ligne d'évolutions d'un pokémon",
				type: "SUB_COMMAND",
				options: [
					{
						name: "pokemon",
						description:
							"Le pokémon dont tu veux obtenir la ligne d'évolutions",
						type: "STRING",
						required: true,
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
						name: "alola",
						description: "Alolan pokémons only",
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
				name: "evoline",
				description: "Get the evolution line of a pokémon",
				type: "SUB_COMMAND",
				options: [
					{
						name: "pokemon",
						description: "The pokémon whose evolution line to get",
						type: "STRING",
						required: true,
					},
				],
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const subCommand = interaction.options.getSubcommand();

		switch (subCommand) {
			case "find": {
				const input = interaction.options.getString("pokemon");
				const { pokemon, shiny, variationType } =
					Util.pokedex.findByNameWithVariation(input) ?? {
						pokemon: Util.pokedex.findById(parseInt(input)),
						shiny: false,
						variationType: "default",
					};

				if (!pokemon)
					return interaction.followUp(translations.strings.invalid_pokemon());

				interaction.followUp({
					embeds: [
						{
							title: `${pokemon.formatName(
								shiny,
								variationType,
								translations.language,
							)} #${pokemon.nationalId.toString().padStart(3, "0")}`,
							color: interaction.guild.me.displayColor,
							image: {
								url: pokemon.image(shiny, variationType),
							},
							fields: [
								{
									name: translations.strings.field_alternative_names(),
									value: Object.keys(pokemon.names)
										.filter((l) => l !== translations.language)
										.map(
											(l) =>
												`${Util.config.LANGUAGE_FLAGS[l]} ${pokemon.names[l]}`,
										)
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
													.map(
														(variation) =>
															`• ${variation.names[translations.language]}`,
													)
													.join("\n") +
											  "\n" +
											  pokemon.megaEvolutions
													.map(
														(megaEvolution) =>
															`• ${megaEvolution.names[translations.language]}`,
													)
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
				const { rows: pokemons } = await Util.database.query(
					"SELECT * FROM pokemon WHERE users ? $1",
					[interaction.user.id],
				);

				const pokemonList = new PokemonList(pokemons, interaction.user.id);

				const userPokedex = Util.pokedex.pokemons.filter((pokemon) => {
					if (
						interaction.options.getBoolean("caught") &&
						!pokemonList.has(pokemon)
					)
						return false;
					if (
						interaction.options.getBoolean("uncaught") &&
						pokemonList.has(pokemon)
					)
						return false;
					if (interaction.options.getBoolean("legendary") && !pokemon.legendary)
						return false;
					if (
						interaction.options.getBoolean("ultra-beast") &&
						!pokemon.ultraBeast
					)
						return false;
					if (
						interaction.options.getBoolean("alola") &&
						!Util.pokedex.alolaPokemons.has(pokemon.nationalId)
					)
						return false;
					if (
						interaction.options.getBoolean("mega") &&
						!Util.pokedex.megaEvolvablePokemons.has(pokemon.nationalId)
					)
						return false;

					return true;
				});

				const shiny = interaction.options.getBoolean("shiny") ?? false;

				const pages: Page[] = [];
				const page: (desc: string) => Page = (desc) => {
					return {
						embeds: [
							{
								author: {
									name: translations.strings.title(interaction.user.tag),
									iconURL: interaction.user.displayAvatarURL({
										dynamic: true,
									}),
								},
								color: interaction.guild.me.displayColor,
								description: desc,
							},
						],
					};
				};
				if (!userPokedex.length)
					pages.push(page(translations.strings.no_pokemon()));

				for (
					let i = 0;
					i < userPokedex.length;
					i += Util.config.ITEMS_PER_PAGE
				) {
					pages.push(
						page(
							userPokedex
								.slice(i, i + Util.config.ITEMS_PER_PAGE)
								.map((pkm) => {
									if (interaction.options.getBoolean("mega")) {
										return pkm.megaEvolutions
											.map((megaEvolution) =>
												translations.strings.description(
													pokemonList.has(pkm),
													pkm.formatName(
														shiny,
														megaEvolution.suffix,
														translations.language,
													),
													pkm.nationalId.toString().padStart(3, "0"),
												),
											)
											.join("\n");
									} else {
										const variationType = interaction.options.getBoolean(
											"alola",
										)
											? "alola"
											: "default";

										return translations.strings.description(
											pokemonList.has(pkm),
											pkm.formatName(
												shiny,
												variationType,
												translations.language,
											),
											pkm.nationalId.toString().padStart(3, "0"),
										);
									}
								})
								.join("\n"),
						),
					);
				}

				pagination(interaction, pages);
				break;
			}

			case "evoline": {
				const pokemon = Util.pokedex.findByName(
					interaction.options.getString("pokemon"),
				);

				if (!pokemon)
					return interaction.followUp(translations.strings.invalid_pokemon());

				const stringEvolutionLine = pokemon.stringEvolutionLine(
					translations.language,
				);

				interaction.followUp({
					embeds: [
						{
							author: {
								name: translations.strings.evoline_title(
									pokemon.names[translations.language] ?? pokemon.names.en,
								),
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
