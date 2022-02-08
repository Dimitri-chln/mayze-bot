import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";

import Pokedex from "../../types/pokemon/Pokedex";
import { DatabasePokemon } from "../../types/structures/Database";
import pagination, { Page } from "../../utils/misc/pagination";
import { VariationType } from "../../utils/pokemon/pokemonInfo";

const command: Command = {
	name: "stats",
	description: {
		fr: "Obtenir des statistiques sur le bot",
		en: "Get statistics about the bot",
	},
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
								description:
									"Le pokémon dont tu veux voir les statistiques",
								type: "STRING",
								required: true,
							},
						],
					},
					{
						name: "caught",
						description:
							"Voir le classement des pokémons les plus attrapés",
						type: "SUB_COMMAND",
						options: [
							{
								name: "shiny",
								description:
									"Ne montrer que les pokémons shiny",
								type: "BOOLEAN",
								required: false,
							},
							{
								name: "legendary",
								description:
									"Ne montrer que les pokémons légendaires",
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
								name: "variation",
								description:
									"Ne montrer qu'un type de variation",
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
						description:
							"Get global statistics about Mayze's pokémons",
						type: "SUB_COMMAND",
					},
					{
						name: "about",
						description: "Get statistics about one pokémon",
						type: "SUB_COMMAND",
						options: [
							{
								name: "pokemon",
								description:
									"The pokémon whose statistics to get",
								type: "STRING",
								required: true,
							},
						],
					},
					{
						name: "caught",
						description:
							"See the ranking of the most caught pokémons",
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
								],
							},
						],
					},
				],
			},
		],
	},

	run: async (interaction, translations) => {
		const subCommandGroup = interaction.options.getSubcommandGroup();

		switch (subCommandGroup) {
			case "pokemons": {
				const subCommand = interaction.options.getSubcommand();

				switch (subCommand) {
					case "global": {
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
							FROM pokemons, jsonb_each(users)
							WHERE shiny = false AND variation = 'default'
							`,
						);
						description += translations.data.normal(
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
							FROM pokemons, jsonb_each(users)
							WHERE shiny AND variation = 'default'
							`,
						);
						description += translations.data.shiny(
							(shiny.total ?? 0).toString(),
						);
						total += shiny.total ?? 0;

						const { rows: allNormal }: { rows: DatabasePokemon[] } =
							await Util.database.query(
								`
							SELECT pokedex_id, users
							FROM pokemons
							WHERE shiny = false AND variation = 'default'
							`,
							);

						const legendary = allNormal.filter(
							(pokemon) =>
								Pokedex.findById(pokemon.pokedex_id).legendary,
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
						description += translations.data.legendary(
							legendaryTotal.toString(),
						);
						total += legendaryTotal;

						const ultraBeast = allNormal.filter(
							(pokemon) =>
								Pokedex.findById(pokemon.pokedex_id).ultraBeast,
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
						description += translations.data.ultra_beast(
							ultraBeastTotal.toString(),
						);
						total += ultraBeastTotal;

						const { rows: allShiny }: { rows: DatabasePokemon[] } =
							await Util.database.query(
								`
							SELECT pokedex_id, users
							FROM pokemons
							WHERE shiny AND variation = 'default'
							`,
							);

						const legendaryShiny = allShiny.filter(
							(pokemon) =>
								Pokedex.findById(pokemon.pokedex_id).legendary,
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
						description += translations.data.legendary_shiny(
							legendaryShinyTotal.toString(),
						);
						total += legendaryShinyTotal;

						const ultraBeastShiny = allShiny.filter(
							(pokemon) =>
								Pokedex.findById(pokemon.pokedex_id).ultraBeast,
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
						description += translations.data.ultra_beast_shiny(
							ultraBeastShinyTotal.toString(),
						);
						total += ultraBeastShinyTotal;

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
							FROM pokemons, jsonb_each(users)
							WHERE shiny = false AND variation = 'alola'
							`,
						);
						description += translations.data.alola(
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
							FROM pokemons, jsonb_each(users)
							WHERE shiny AND variation = 'alola'
							`,
						);
						description += translations.data.alola_shiny(
							(alolaShiny.total ?? 0).toString(),
						);
						total += alolaShiny.total ?? 0;

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
							FROM pokemons, jsonb_each(users)
							WHERE shiny = false AND variation = ANY('{ "mega", "megax", "megay", "primal" }')
							`,
						);
						description += translations.data.mega(
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
							FROM pokemons, jsonb_each(users)
							WHERE shiny AND variation = ANY('{ "mega", "megax", "megay", "primal" }')
							`,
						);
						description += translations.data.mega_shiny(
							(megaShiny.total ?? 0).toString(),
						);
						total += megaShiny.total ?? 0;

						description += translations.data.total(
							total.toString(),
						);

						interaction.followUp({
							embeds: [
								{
									author: {
										name: translations.data.title(),
										iconURL:
											interaction.client.user.displayAvatarURL(),
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
						const pokemon = Pokedex.findByName(
							interaction.options.getString("pokemon"),
						);
						if (!pokemon)
							return interaction.followUp(
								translations.data.invalid_pokemon(),
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
							FROM pokemons, jsonb_each(users)
							WHERE pokedex_id = $1 AND shiny = false AND variation = 'default'
							`,
							[pokemon.nationalId],
						);
						description += translations.data.normal(
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
							FROM pokemons, jsonb_each(users)
							WHERE pokedex_id = $1 AND shiny = true AND variation = 'default'
							`,
							[pokemon.nationalId],
						);
						description += translations.data.shiny(
							(shiny.total ?? 0).toString(),
						);
						total += shiny.total ?? 0;

						if (Pokedex.alolaPokemons.has(pokemon.nationalId)) {
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
								FROM pokemons, jsonb_each(users)
								WHERE pokedex_id = $1 AND shiny = false AND variation = 'alola'
								`,
								[pokemon.nationalId],
							);
							description += translations.data.alola(
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
								FROM pokemons, jsonb_each(users)
								WHERE pokedex_id = $1 AND shiny = true AND variation = 'alola'
								`,
								[pokemon.nationalId],
							);
							description += translations.data.alola_shiny(
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
								FROM pokemons, jsonb_each(users)
								WHERE pokedex_id = $1 AND shiny = false AND variation = ANY('{ "mega", "megax", "megay", "primal" }')
								`,
								[pokemon.nationalId],
							);
							description += translations.data.mega(
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
								FROM pokemons, jsonb_each(users)
								WHERE pokedex_id = $1 AND shiny = false AND variation = ANY('{ "mega", "megax", "megay", "primal" }')
								`,
								[pokemon.nationalId],
							);
							description += translations.data.mega_shiny(
								(megaShiny.total ?? 0).toString(),
							);
							total += megaShiny.total ?? 0;
						}

						description += translations.data.total(
							total.toString(),
						);

						interaction.followUp({
							embeds: [
								{
									author: {
										name: translations.data.title(),
										iconURL:
											interaction.client.user.displayAvatarURL(),
									},
									title: `${
										pokemon.names[translations.language]
									}#${pokemon.nationalId
										.toString()
										.padStart(3, "0")}`,
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
							interaction.options.getBoolean("shiny"),
						);
						const variation: VariationType =
							(interaction.options.getString("variation") as
								| "mega"
								| "alola") ?? "default";

						let {
							rows: pokemons,
						}: { rows: DatabasePokemonWithCaughtStats[] } =
							await Util.database.query(
								`
							SELECT pokedex_id, shiny, variation, SUM((value -> 'caught')::int)::int AS total
							FROM pokemons, jsonb_each(users)
							WHERE shiny = $1 AND variation = $2
							GROUP BY pokedex_id, shiny, variation
							ORDER BY total DESC, pokedex_id ASC
							`,
								[shiny, variation],
							);

						pokemons = pokemons.filter((pkm) => {
							if (
								interaction.options.getBoolean("legendary") &&
								!Pokedex.findById(pkm.pokedex_id).legendary
							)
								return false;
							if (
								interaction.options.getBoolean("ultra-beast") &&
								!Pokedex.findById(pkm.pokedex_id).ultraBeast
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
											name: translations.data.title(),
											iconURL:
												interaction.client.user.displayAvatarURL(),
										},
										title: translations.data.most_caught_title(),
										color: interaction.guild.me
											.displayColor,
										description:
											translations.data.no_caught(),
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
											name: translations.data.title(),
											iconURL:
												interaction.client.user.displayAvatarURL(),
										},
										title: translations.data.most_caught_title(),
										color: interaction.guild.me
											.displayColor,
										description: pokemons
											.slice(
												i,
												i + Util.config.ITEMS_PER_PAGE,
											)
											.map((pokemon, j) =>
												translations.data.most_caught_description(
													(i + j + 1).toString(),
													Pokedex.findById(
														pokemon.pokedex_id,
													).formatName(
														shiny,
														variation,
														translations.language,
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
