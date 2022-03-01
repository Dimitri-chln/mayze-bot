import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import { DatabasePokemon } from "../../types/structures/Database";
import pagination, { Page } from "../../utils/misc/pagination";
import { VariationType } from "../../utils/pokemon/pokemonInfo";

const command: Command = {
	name: "stats",
	aliases: [],
	description: {
		fr: "Obtenir des statistiques sur le bot",
		en: "Get statistics about the bot",
	},
	usage: "",
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],

	options: {
		fr: [
			{
				name: "pokemons",
				description: "Obtenir des statistiques à propos des pokémons",
				type: "SUB_COMMAND_GROUP",
				options: [
					{
						name: "global",
						description:
							"Obtenir les statistiques globales à propos des pokémons",
						type: "SUB_COMMAND",
					},
					{
						name: "about",
						description: "Obtenir les statistiques d'un pokémon",
						type: "SUB_COMMAND",
						options: [
							{
								name: "pokemon",
								description: "Le pokémon dont tu veux voir les statistiques",
								type: "STRING",
								required: true,
								autocomplete: true,
							},
						],
					},
					{
						name: "caught",
						description: "Voir le classement des pokémons les plus attrapés",
						type: "SUB_COMMAND",
						options: [
							{
								name: "shiny",
								description: "Ne montrer que les pokémons shiny",
								type: "BOOLEAN",
								required: false,
							},
							{
								name: "legendary",
								description: "Ne montrer que les pokémons légendaires",
								type: "BOOLEAN",
								required: false,
							},
							{
								name: "ultra-beast",
								description: "Ne montrer que les chimères",
								type: "BOOLEAN",
								required: false,
							},
							{
								name: "generation",
								description:
									"Ne montrer que les pokémons d'une certaine génération",
								type: "INTEGER",
								required: false,
								minValue: 1,
								maxValue: 8,
							},
							{
								name: "variation",
								description: "Ne montrer qu'un type de variation",
								type: "STRING",
								required: false,
								choices: [
									{
										name: "Pokémons méga",
										value: "mega",
									},
									{
										name: "Pokémons d'Alola",
										value: "alola",
									},
									{
										name: "Pokémons de Galar",
										value: "galar",
									},
								],
							},
						],
					},
				],
			},
		],
		en: [
			{
				name: "pokemons",
				description: "Get statistics about pokémons",
				type: "SUB_COMMAND_GROUP",
				options: [
					{
						name: "global",
						description: "Get global statistics about Mayze's pokémons",
						type: "SUB_COMMAND",
					},
					{
						name: "about",
						description: "Get statistics about one pokémon",
						type: "SUB_COMMAND",
						options: [
							{
								name: "pokemon",
								description: "The pokémon whose statistics to get",
								type: "STRING",
								required: true,
								autocomplete: true,
							},
						],
					},
					{
						name: "caught",
						description: "See the ranking of the most caught pokémons",
						type: "SUB_COMMAND",
						options: [
							{
								name: "shiny",
								description: "Show shiny pokémons only",
								type: "BOOLEAN",
								required: false,
							},
							{
								name: "legendary",
								description: "Show legendary pokémons only",
								type: "BOOLEAN",
								required: false,
							},
							{
								name: "ultra-beast",
								description: "Show ultra beasts only",
								type: "BOOLEAN",
								required: false,
							},
							{
								name: "generation",
								description: "Show pokémons from a specific generation only",
								type: "INTEGER",
								required: false,
								minValue: 1,
								maxValue: 8,
							},
							{
								name: "variation",
								description: "Show one variation type only",
								type: "STRING",
								required: false,
								choices: [
									{
										name: "Mega pokémons",
										value: "mega",
									},
									{
										name: "Alolan pokémons",
										value: "alola",
									},
									{
										name: "Galarian pokémons",
										value: "galar",
									},
								],
							},
						],
					},
				],
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const subCommandGroup = interaction.options.getSubcommandGroup();

		switch (subCommandGroup) {
			case "pokemons": {
				const subCommand = interaction.options.getSubcommand();

				switch (subCommand) {
					case "global": {
						let description = "";

						const {
							rows: [normal],
						}: {
							rows: Omit<
								DatabasePokemonWithCaughtStats,
								keyof DatabasePokemon
							>[];
						} = await Util.database.query(
							`
							SELECT SUM((value -> 'caught')::int)::int AS total
							FROM pokemon, jsonb_each(users)
							WHERE shiny = false AND variation_type = 'default'
							`,
						);
						description += translations.strings.normal(
							(normal.total ?? 0).toString(),
						);

						const {
							rows: [shiny],
						}: {
							rows: Omit<
								DatabasePokemonWithCaughtStats,
								keyof DatabasePokemon
							>[];
						} = await Util.database.query(
							`
							SELECT SUM((value -> 'caught')::int)::int AS total
							FROM pokemon, jsonb_each(users)
							WHERE shiny AND variation_type = 'default'
							`,
						);
						description += translations.strings.shiny(
							(shiny.total ?? 0).toString(),
						);

						const { rows: allNormal }: { rows: DatabasePokemon[] } =
							await Util.database.query(
								`
							SELECT national_id, users
							FROM pokemon
							WHERE shiny = false AND variation_type = 'default'
							`,
							);

						const legendary = allNormal.filter(
							(pokemon) => Util.pokedex.findById(pokemon.national_id).legendary,
						);
						const legendaryTotal = legendary.reduce(
							(total, pkm) =>
								total +
								Object.values(pkm.users).reduce(
									(sum, user) => sum + user.caught,
									0,
								),
							0,
						);
						description += translations.strings.legendary(
							legendaryTotal.toString(),
						);

						const ultraBeast = allNormal.filter(
							(pokemon) =>
								Util.pokedex.findById(pokemon.national_id).ultraBeast,
						);
						const ultraBeastTotal = ultraBeast.reduce(
							(total, pkm) =>
								total +
								Object.values(pkm.users).reduce(
									(sum, user) => sum + user.caught,
									0,
								),
							0,
						);
						description += translations.strings.ultra_beast(
							ultraBeastTotal.toString(),
						);

						const { rows: allShiny }: { rows: DatabasePokemon[] } =
							await Util.database.query(
								`
							SELECT national_id, users
							FROM pokemon
							WHERE shiny AND variation_type = 'default'
							`,
							);

						const legendaryShiny = allShiny.filter(
							(pokemon) => Util.pokedex.findById(pokemon.national_id).legendary,
						);
						const legendaryShinyTotal = legendaryShiny.reduce(
							(total, pkm) =>
								total +
								Object.values(pkm.users).reduce(
									(sum, user) => sum + user.caught,
									0,
								),
							0,
						);
						description += translations.strings.legendary_shiny(
							legendaryShinyTotal.toString(),
						);

						const ultraBeastShiny = allShiny.filter(
							(pokemon) =>
								Util.pokedex.findById(pokemon.national_id).ultraBeast,
						);
						const ultraBeastShinyTotal = ultraBeastShiny.reduce(
							(total, pkm) =>
								total +
								Object.values(pkm.users).reduce(
									(sum, user) => sum + user.caught,
									0,
								),
							0,
						);
						description += translations.strings.ultra_beast_shiny(
							ultraBeastShinyTotal.toString(),
						);

						const {
							rows: [mega],
						}: {
							rows: Omit<
								DatabasePokemonWithCaughtStats,
								keyof DatabasePokemon
							>[];
						} = await Util.database.query(
							`
							SELECT SUM((value -> 'caught')::int)::int AS total
							FROM pokemon, jsonb_each(users)
							WHERE shiny = false AND variation_type = 'mega'
							`,
						);
						description += translations.strings.mega(
							(mega.total ?? 0).toString(),
						);

						const {
							rows: [megaShiny],
						}: {
							rows: Omit<
								DatabasePokemonWithCaughtStats,
								keyof DatabasePokemon
							>[];
						} = await Util.database.query(
							`
							SELECT SUM((value -> 'caught')::int)::int AS total
							FROM pokemon, jsonb_each(users)
							WHERE shiny AND variation = 'mega'
							`,
						);
						description += translations.strings.mega_shiny(
							(megaShiny.total ?? 0).toString(),
						);

						const {
							rows: [alola],
						}: {
							rows: Omit<
								DatabasePokemonWithCaughtStats,
								keyof DatabasePokemon
							>[];
						} = await Util.database.query(
							`
							SELECT SUM((value -> 'caught')::int)::int AS total
							FROM pokemon, jsonb_each(users)
							WHERE shiny = false AND variation_type = 'alola'
							`,
						);
						description += translations.strings.alola(
							(alola.total ?? 0).toString(),
						);

						const {
							rows: [alolaShiny],
						}: {
							rows: Omit<
								DatabasePokemonWithCaughtStats,
								keyof DatabasePokemon
							>[];
						} = await Util.database.query(
							`
							SELECT SUM((value -> 'caught')::int)::int AS total
							FROM pokemon, jsonb_each(users)
							WHERE shiny AND variation_type = 'alola'
							`,
						);
						description += translations.strings.alola_shiny(
							(alolaShiny.total ?? 0).toString(),
						);

						const {
							rows: [galar],
						}: {
							rows: Omit<
								DatabasePokemonWithCaughtStats,
								keyof DatabasePokemon
							>[];
						} = await Util.database.query(
							`
							SELECT SUM((value -> 'caught')::int)::int AS total
							FROM pokemon, jsonb_each(users)
							WHERE shiny = false AND variation_type = 'galar'
							`,
						);
						description += translations.strings.galar(
							(galar.total ?? 0).toString(),
						);

						const {
							rows: [galarShiny],
						}: {
							rows: Omit<
								DatabasePokemonWithCaughtStats,
								keyof DatabasePokemon
							>[];
						} = await Util.database.query(
							`
							SELECT SUM((value -> 'caught')::int)::int AS total
							FROM pokemon, jsonb_each(users)
							WHERE shiny AND variation_type = 'galar'
							`,
						);
						description += translations.strings.galar_shiny(
							(galarShiny.total ?? 0).toString(),
						);

						const {
							rows: [{ total }],
						}: {
							rows: Omit<
								DatabasePokemonWithCaughtStats,
								keyof DatabasePokemon
							>[];
						} = await Util.database.query(
							`
							SELECT SUM((value -> 'caught')::int)::int AS total
							FROM pokemon, jsonb_each(users)
							`,
						);

						description += translations.strings.total(total.toString());

						interaction.followUp({
							embeds: [
								{
									author: {
										name: translations.strings.author(),
										iconURL: interaction.client.user.displayAvatarURL(),
									},
									color: interaction.guild.me.displayColor,
									description,
									footer: {
										text: "✨ Mayze ✨",
									},
								},
							],
						});
						break;
					}

					case "about": {
						const pokemon = Util.pokedex.findByName(
							interaction.options.getString("pokemon", true),
						);
						if (!pokemon)
							return interaction.followUp(
								translations.strings.invalid_pokemon(),
							);

						let description = "",
							total = 0;

						const {
							rows: [normal],
						}: {
							rows: Omit<
								DatabasePokemonWithCaughtStats,
								keyof DatabasePokemon
							>[];
						} = await Util.database.query(
							`
							SELECT SUM((value -> 'caught')::int)::int AS total
							FROM pokemon, jsonb_each(users)
							WHERE national_id = $1 AND shiny = false AND variation_type = 'default'
							`,
							[pokemon.nationalId],
						);
						description += translations.strings.normal(
							(normal.total ?? 0).toString(),
						);
						total += normal.total ?? 0;

						const {
							rows: [shiny],
						}: {
							rows: Omit<
								DatabasePokemonWithCaughtStats,
								keyof DatabasePokemon
							>[];
						} = await Util.database.query(
							`
							SELECT SUM((value -> 'caught')::int)::int AS total
							FROM pokemon, jsonb_each(users)
							WHERE national_id = $1 AND shiny = true AND variation_type = 'default'
							`,
							[pokemon.nationalId],
						);
						description += translations.strings.shiny(
							(shiny.total ?? 0).toString(),
						);
						total += shiny.total ?? 0;

						if (Util.pokedex.alolaPokemons.has(pokemon.nationalId)) {
							const {
								rows: [alola],
							}: {
								rows: Omit<
									DatabasePokemonWithCaughtStats,
									keyof DatabasePokemon
								>[];
							} = await Util.database.query(
								`
								SELECT SUM((value -> 'caught')::int)::int AS total
								FROM pokemon, jsonb_each(users)
								WHERE national_id = $1 AND shiny = false AND variation_type = 'alola'
								`,
								[pokemon.nationalId],
							);
							description += translations.strings.alola(
								(alola.total ?? 0).toString(),
							);
							total += alola.total ?? 0;

							const {
								rows: [alolaShiny],
							}: {
								rows: Omit<
									DatabasePokemonWithCaughtStats,
									keyof DatabasePokemon
								>[];
							} = await Util.database.query(
								`
								SELECT SUM((value -> 'caught')::int)::int AS total
								FROM pokemon, jsonb_each(users)
								WHERE national_id = $1 AND shiny = true AND variation_type = 'alola'
								`,
								[pokemon.nationalId],
							);
							description += translations.strings.alola_shiny(
								(alolaShiny.total ?? 0).toString(),
							);
							total += alolaShiny.total ?? 0;
						}

						if (pokemon.megaEvolutions.length) {
							const {
								rows: [mega],
							}: {
								rows: Omit<
									DatabasePokemonWithCaughtStats,
									keyof DatabasePokemon
								>[];
							} = await Util.database.query(
								`
								SELECT SUM((value -> 'caught')::int)::int AS total
								FROM pokemon, jsonb_each(users)
								WHERE national_id = $1 AND shiny = false AND variation_type = 'mega'
								`,
								[pokemon.nationalId],
							);
							description += translations.strings.mega(
								(mega.total ?? 0).toString(),
							);
							total += mega.total ?? 0;

							const {
								rows: [megaShiny],
							}: {
								rows: Omit<
									DatabasePokemonWithCaughtStats,
									keyof DatabasePokemon
								>[];
							} = await Util.database.query(
								`
								SELECT SUM((value -> 'caught')::int)::int AS total
								FROM pokemon, jsonb_each(users)
								WHERE national_id = $1 AND shiny = false AND variation_type = 'mega'
								`,
								[pokemon.nationalId],
							);
							description += translations.strings.mega_shiny(
								(megaShiny.total ?? 0).toString(),
							);
							total += megaShiny.total ?? 0;
						}

						description += translations.strings.total(total.toString());

						interaction.followUp({
							embeds: [
								{
									author: {
										name: translations.strings.author(),
										iconURL: interaction.client.user.displayAvatarURL(),
									},
									title: `${
										pokemon.names[translations.language]
									}#${pokemon.nationalId.toString().padStart(3, "0")}`,
									color: interaction.guild.me.displayColor,
									description,
									footer: {
										text: "✨ Mayze ✨",
									},
								},
							],
						});
						break;
					}

					case "caught": {
						const shiny = Boolean(
							interaction.options.getBoolean("shiny", false),
						);

						const variationType: VariationType =
							(interaction.options.getString("variation", false) as
								| "mega"
								| "alola"
								| "galar") ?? "default";

						let { rows: pokemons }: { rows: DatabasePokemonWithCaughtStats[] } =
							await Util.database.query(
								`
							SELECT national_id, shiny, variation_type, SUM((value -> 'caught')::int)::int AS total
							FROM pokemon, jsonb_each(users)
							WHERE shiny = $1 AND variation_type = $2
							GROUP BY (national_id, shiny, variation_type)
							ORDER BY total DESC, national_id ASC
							`,
								[shiny, variationType],
							);

						pokemons = pokemons.filter((pkm) => {
							if (
								interaction.options.getBoolean("legendary", false) &&
								!Util.pokedex.findById(pkm.national_id).legendary
							)
								return false;
							if (
								interaction.options.getBoolean("ultra-beast", false) &&
								!Util.pokedex.findById(pkm.national_id).ultraBeast
							)
								return false;

							if (
								interaction.options.getInteger("generation", false) &&
								Util.pokedex.findById(pkm.national_id).generation !==
									interaction.options.getInteger("generation", false)
							)
								return false;

							return true;
						});

						const pages: Page[] = [];

						if (!pokemons.length)
							pages.push({
								embeds: [
									{
										author: {
											name: translations.strings.author(),
											iconURL: interaction.client.user.displayAvatarURL(),
										},
										title: translations.strings.most_caught_title(),
										color: interaction.guild.me.displayColor,
										description: translations.strings.no_caught(),
									},
								],
							});

						for (
							let i = 0;
							i < pokemons.length;
							i += Util.config.ITEMS_PER_PAGE
						) {
							const page: Page = {
								embeds: [
									{
										author: {
											name: translations.strings.author(),
											iconURL: interaction.client.user.displayAvatarURL(),
										},
										title: translations.strings.most_caught_title(),
										color: interaction.guild.me.displayColor,
										description: pokemons
											.slice(i, i + Util.config.ITEMS_PER_PAGE)
											.map((pokemon, j) =>
												translations.strings.most_caught_description(
													(i + j + 1).toString(),
													Util.pokedex
														.findById(pokemon.national_id)
														.formatName(
															translations.language,
															shiny,
															pokemon.variation_type,
															pokemon.variation,
														),
													pokemon.total.toString(),
												),
											)
											.join("\n"),
									},
								],
							};

							pages.push(page);
						}

						pagination(interaction, pages);
						break;
					}
				}
				break;
			}
		}
	},
};

export default command;

interface DatabasePokemonWithCaughtStats extends DatabasePokemon {
	total: number;
}
