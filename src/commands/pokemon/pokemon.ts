import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import { DatabasePokemon } from "../../types/structures/Database";
import pagination, { Page } from "../../utils/misc/pagination";
import PokemonList from "../../types/pokemon/PokemonList";
import escapeMarkdown from "../../utils/misc/espapeMarkdown";

const command: Command = {
	name: "pokemon",
	aliases: [],
	description: {
		fr: "Obtenir la liste des pokémons que tu as attrapés",
		en: "Get the list of all the pokémons you caught",
	},
	usage: "",
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],

	options: {
		fr: [
			{
				name: "addfav",
				description: "Ajouter un pokémon à tes favoris",
				type: "SUB_COMMAND",
				options: [
					{
						name: "pokemon",
						description: "Le pokémon à ajouter",
						type: "STRING",
						required: true,
					},
				],
			},
			{
				name: "removefav",
				description: "Retirer un pokémon de tes favoris",
				type: "SUB_COMMAND",
				options: [
					{
						name: "pokemon",
						description: "Le pokémon à retirer",
						type: "STRING",
						required: true,
					},
				],
			},
			{
				name: "nick",
				description: "Modifier le surnom d'un de tes pokémons",
				type: "SUB_COMMAND",
				options: [
					{
						name: "pokemon",
						description: "Le pokémon à renommer",
						type: "STRING",
						required: true,
					},
					{
						name: "nickname",
						description:
							"Le nouveau surnom du pokémon. Laisse vide pour le réinitialiser",
						type: "STRING",
						required: false,
					},
				],
			},
			{
				name: "list",
				description: "Obtenir la liste de tes pokémons",
				type: "SUB_COMMAND",
				options: [
					{
						name: "user",
						description: "L'utilisateur dont tu veux obtenir la liste",
						type: "USER",
						required: false,
					},
					{
						name: "normal",
						description: "Une option pour n'afficher que les pokémons normaux",
						type: "BOOLEAN",
						required: false,
					},
					{
						name: "favorite",
						description: "Une option pour n'afficher que tes pokémons favoris",
						type: "BOOLEAN",
						required: false,
					},
					{
						name: "legendary",
						description:
							"Une option pour n'afficher que les pokémons légendaires",
						type: "BOOLEAN",
						required: false,
					},
					{
						name: "ultra-beast",
						description: "Une option pour n'afficher que les chimères",
						type: "BOOLEAN",
						required: false,
					},
					{
						name: "shiny",
						description: "Une option pour n'afficher que les pokémons shiny",
						type: "BOOLEAN",
						required: false,
					},
					{
						name: "alola",
						description: "Une option pour n'afficher que les pokémons d'Alola",
						type: "BOOLEAN",
						required: false,
					},
					{
						name: "mega",
						description: "Une option pour n'afficher que les méga pokémons",
						type: "BOOLEAN",
						required: false,
					},
					{
						name: "id",
						description:
							"Une option pour trouver un pokémon grâce à son ID. Pour afficher les ID à côté des pokémons, utiliser la valeur 0",
						type: "INTEGER",
						required: false,
					},
					{
						name: "name",
						description:
							"Une option pour trouver un pokémon grâce à son nom ou surnom",
						type: "STRING",
						required: false,
					},
					{
						name: "evolution",
						description:
							"Une option pour trouver la ligne d'évolutions complète d'un pokémon",
						type: "STRING",
						required: false,
					},
				],
			},
		],
		en: [
			{
				name: "addfav",
				description: "Add a pokémon to your favorites",
				type: "SUB_COMMAND",
				options: [
					{
						name: "pokemon",
						description: "The pokémon to add",
						type: "STRING",
						required: true,
					},
				],
			},
			{
				name: "removefav",
				description: "Remove a pokémon from your favorites",
				type: "SUB_COMMAND",
				options: [
					{
						name: "pokemon",
						description: "The pokémon to remove",
						type: "STRING",
						required: true,
					},
				],
			},
			{
				name: "nick",
				description: "Change the nickname of one of your pokémons",
				type: "SUB_COMMAND",
				options: [
					{
						name: "pokemon",
						description: "The pokémon to rename",
						type: "STRING",
						required: true,
					},
					{
						name: "nickname",
						description:
							"The new nickname of the pokémon. Leave blank to reset",
						type: "STRING",
						required: false,
					},
				],
			},
			{
				name: "list",
				description: "Get the list of your pokémons",
				type: "SUB_COMMAND",
				options: [
					{
						name: "user",
						description: "The user whose pokémons to check",
						type: "USER",
						required: false,
					},
					{
						name: "normal",
						description: "An option to display normal pokémons only",
						type: "BOOLEAN",
						required: false,
					},
					{
						name: "favorite",
						description: "An option to display your favorite pokémons only",
						type: "BOOLEAN",
						required: false,
					},
					{
						name: "legendary",
						description: "An option to display legendary pokémons only",
						type: "BOOLEAN",
						required: false,
					},
					{
						name: "ultra-beast",
						description: "An option to display ultra beasts only",
						type: "BOOLEAN",
						required: false,
					},
					{
						name: "shiny",
						description: "An option to display shiny pokémons only",
						type: "BOOLEAN",
						required: false,
					},
					{
						name: "alola",
						description: "An option to display alolan pokémons only",
						type: "BOOLEAN",
						required: false,
					},
					{
						name: "mega",
						description: "An option to display mega pokémons only",
						type: "BOOLEAN",
						required: false,
					},
					{
						name: "id",
						description:
							"An option to find a pokémon by its ID. To display IDs next to the pokémons instead, use the value 0",
						type: "INTEGER",
						required: false,
					},
					{
						name: "name",
						description: "An option to find a pokémon by its name or nickname",
						type: "STRING",
						required: false,
					},
					{
						name: "evolution",
						description:
							"An option to show the whole evolution line of a pokémon",
						type: "STRING",
						required: false,
					},
				],
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const subCommand = interaction.options.getSubcommand();

		switch (subCommand) {
			case "addfav": {
				const { pokemon, shiny, variationType } =
					Util.pokedex.findByNameWithVariation(
						interaction.options.getString("pokemon", true),
					) ?? {};

				if (!pokemon)
					return interaction.followUp(translations.strings.invalid_pokemon());

				const { rows: pokemons } = await Util.database.query(
					"SELECT * FROM pokemon WHERE pokedex_id = $1 AND shiny = $2 AND variation = $3 AND users ? $4",
					[pokemon.nationalId, shiny, variationType, interaction.user.id],
				);

				if (!pokemons.length)
					return interaction.followUp(translations.strings.pokemon_not_owned());

				await Util.database.query(
					`
					UPDATE pokemon SET users = jsonb_set(users, '{${interaction.user.id}, favorite}', TRUE::text::jsonb)
					WHERE pokedex_id = $1 AND shiny = $2 AND variation = $3
					`,
					[pokemon.nationalId, shiny, variationType],
				);

				interaction.followUp(
					translations.strings.favorite_added(
						pokemon.formatName(shiny, variationType, translations.language),
					),
				);
				break;
			}

			case "removefav": {
				const { pokemon, shiny, variationType } =
					Util.pokedex.findByNameWithVariation(
						interaction.options.getString("pokemon", true),
					) ?? {};

				if (!pokemon)
					return interaction.followUp(translations.strings.invalid_pokemon());

				const { rows: pokemons } = await Util.database.query(
					"SELECT * FROM pokemon WHERE pokedex_id = $1 AND shiny = $2 AND variation = $3 AND users ? $4",
					[pokemon.nationalId, shiny, variationType, interaction.user.id],
				);

				if (!pokemons.length)
					return interaction.followUp(translations.strings.pokemon_not_owned());

				await Util.database.query(
					`
					UPDATE pokemon SET users = jsonb_set(users, '{${interaction.user.id}, favorite}', FALSE::text::jsonb)
					WHERE pokedex_id = $1 AND shiny = $2 AND variation = $3
					`,
					[pokemon.nationalId, shiny, variationType],
				);

				interaction.followUp(
					translations.strings.favorite_removed(
						pokemon.formatName(shiny, variationType, translations.language),
					),
				);
				break;
			}

			case "nick": {
				const { pokemon, shiny, variationType } =
					Util.pokedex.findByNameWithVariation(
						interaction.options.getString("pokemon", true),
					) ?? {};

				if (!pokemon)
					return interaction.followUp(translations.strings.invalid_pokemon());

				const { rows: pokemons } = await Util.database.query(
					"SELECT * FROM pokemon WHERE pokedex_id = $1 AND shiny = $2 AND variation = $3 AND users ? $4",
					[pokemon.nationalId, shiny, variationType, interaction.user.id],
				);

				if (!pokemons.length)
					return interaction.followUp(translations.strings.pokemon_not_owned());

				const nickname = interaction.options.getString("nickname", false);
				if (nickname && nickname.length > 30)
					return interaction.followUp(translations.strings.nickname_too_long());

				await Util.database.query(
					`
					UPDATE pokemon SET users = jsonb_set(users, '{${
						interaction.user.id
					}, nickname}', '${nickname ? `"${nickname}"` : null}'::jsonb)
					WHERE pokedex_id = $1 AND shiny = $2 AND variation = $3
					`,
					[pokemon.nationalId, shiny, variationType],
				);

				interaction.followUp(
					translations.strings.nickname_updated(
						pokemon.formatName(shiny, variationType, translations.language),
						nickname,
					),
				);
				break;
			}

			case "list": {
				const user =
					interaction.options.getUser("user", false) ?? interaction.user;

				const { rows: pokemons }: { rows: DatabasePokemon[] } =
					await Util.database.query("SELECT * FROM pokemon WHERE users ? $1", [
						user.id,
					]);

				const pokemonList = new PokemonList(
					pokemons.filter((pkm) => {
						if (
							interaction.options.getBoolean("normal", false) &&
							(pkm.shiny || pkm.variation !== "default")
						)
							return false;
						if (
							interaction.options.getBoolean("favorite", false) &&
							!pkm.users[user.id].favorite
						)
							return false;
						if (
							interaction.options.getBoolean("legendary", false) &&
							!Util.pokedex.findById(pkm.pokedex_id).legendary
						)
							return false;
						if (
							interaction.options.getBoolean("ultra-beast", false) &&
							!Util.pokedex.findById(pkm.pokedex_id).ultraBeast
						)
							return false;
						if (interaction.options.getBoolean("shiny", false) && !pkm.shiny)
							return false;
						if (
							interaction.options.getBoolean("alola", false) &&
							pkm.variation !== "alola"
						)
							return false;
						if (
							interaction.options.getBoolean("mega", false) &&
							!["mega", "megax", "megay", "primal"].includes(pkm.variation)
						)
							return false;

						if (
							interaction.options.getInteger("id", false) &&
							interaction.options.getInteger("id", false) !== 0 &&
							pkm.pokedex_id !== interaction.options.getInteger("id", false)
						)
							return false;

						if (
							interaction.options.getString("name", false) &&
							!new RegExp(interaction.options.getString("name", false), "i").test(
								Util.pokedex.findById(pkm.pokedex_id).names[
									translations.language
								],
							) &&
							!new RegExp(interaction.options.getString("name", false), "i").test(
								pkm.users[user.id].nickname,
							)
						)
							return false;

						if (
							interaction.options.getString("evolution", false) &&
							Util.pokedex.findByName(
								interaction.options.getString("evolution", false),
							) &&
							!Util.pokedex
								.findByName(interaction.options.getString("evolution", false))
								.flatEvolutionLine()
								.some((p) => p.nationalId === pkm.pokedex_id)
						)
							return false;

						return true;
					}),
					user.id,
				);

				pokemonList.pokemons.sort((a, b) => {
					return (
						Number(b.data.legendary) - Number(a.data.legendary) || // legendary pokémons first
						Number(b.data.ultraBeast) - Number(a.data.ultraBeast) || // ultra beasts after
						Number(b.shiny) - Number(a.shiny) || // followed by shiny pokémons
						b.caught - a.caught || // sort by most caught pokémons
						a.data.nationalId - b.data.nationalId
					); // and finally by pokédex ID
				});

				const pages: Page[] = [];

				if (!pokemonList.pokemons.length)
					pages.push({
						embeds: [
							{
								author: {
									name: translations.strings.title(user.tag),
									iconURL: user.displayAvatarURL({
										dynamic: true,
									}),
								},
								color: interaction.guild.me.displayColor,
								description: translations.strings.no_pokemon(),
							},
						],
					});

				const total = pokemonList.pokemons.reduce(
					(sum, p) => sum + p.caught,
					0,
				);

				for (
					let i = 0;
					i < pokemonList.pokemons.length;
					i += Util.config.ITEMS_PER_PAGE
				) {
					const page: Page = {
						embeds: [
							{
								author: {
									name: translations.strings.title(user.tag),
									iconURL: user.displayAvatarURL({
										dynamic: true,
									}),
								},
								title: translations.strings.total(total.toString(), total > 1),
								color: interaction.guild.me.displayColor,
								description: pokemonList.pokemons
									.slice(i, i + Util.config.ITEMS_PER_PAGE)
									.map((p) =>
										translations.strings.description(
											p.data.formatName(
												p.shiny,
												p.variation,
												translations.language,
												"badge",
											),
											p.data.formatName(
												p.shiny,
												p.variation,
												translations.language,
												"raw",
											),
											interaction.options.getInteger("id", false) === 0
												? `#${p.data.nationalId.toString().padStart(3, "0")}`
												: "",
											escapeMarkdown(p.nickname),
											p.caught.toString(),
											p.caught > 1,
											p.favorite
												? `https~d//www.pokemon.com/${
														translations.language === "en"
															? "us"
															: translations.language
												  }/pokedex/${p.data.names[translations.language]
														.toLowerCase()
														.replace(/[:\.']/g, "")
														.replace(/\s/g, "-")
														.replace(/\u2642/, "-male")
														.replace(/\u2640/, "-female")}`
												: "",
										),
									)
									.join("\n"),
							},
						],
					};

					if (pokemonList.pokemons.length === 1)
						page.embeds[0].thumbnail = {
							url: pokemonList.pokemons[0].data.image(
								pokemonList.pokemons[0].shiny,
								pokemonList.pokemons[0].variation,
							),
						};

					pages.push(page);
				}

				pagination(interaction, pages);
				break;
			}
		}
	},
};

export default command;
