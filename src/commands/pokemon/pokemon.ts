import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, Locale, PermissionFlagsBits, PermissionsBitField, User } from "discord.js";
import Util from "../../Util";

import { DatabaseUserPokemon } from "../../types/Database";

import { NameFormat, VariationName, VariationTypeName } from "../../structures/pokemons/Pokemon";
import UserPokemon from "../../structures/pokemons/UserPokemon";

import pagination, { Page } from "../../utils/misc/pagination";
import escapeMarkdown from "../../utils/misc/escapeMarkdown";
import PokemonList from "../../structures/pokemons/PokemonList";

const command: CommandData = {
	name: "pokemon",
	aliases: ["poke", "pkm"],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField([PermissionFlagsBits.EmbedLinks]),

	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "list",
			description: undefined,
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: "user",
					description: undefined,
					required: false,
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "name",
					description: undefined,
					required: false,
					autocomplete: true,
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "nickname",
					description: undefined,
					required: false,
					autocomplete: true,
				},
				{
					type: ApplicationCommandOptionType.Integer,
					name: "id",
					description: undefined,
					required: false,
					min_value: 1,
				},
				{
					type: ApplicationCommandOptionType.Integer,
					name: "generation",
					description: undefined,
					required: false,
					min_value: 1,
					max_value: 8,
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "evolutions",
					description: undefined,
					required: false,
					autocomplete: true,
				},
				{
					type: ApplicationCommandOptionType.Boolean,
					name: "normal",
					description: undefined,
					required: false,
				},
				{
					type: ApplicationCommandOptionType.Boolean,
					name: "legendary",
					description: undefined,
					required: false,
				},
				{
					type: ApplicationCommandOptionType.Boolean,
					name: "ultra-beast",
					description: undefined,
					required: false,
				},
				{
					type: ApplicationCommandOptionType.Boolean,
					name: "shiny",
					description: undefined,
					required: false,
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "variation",
					description: undefined,
					required: false,
					choices: [
						{
							name: undefined,
							value: "mega",
						},
						{
							name: undefined,
							value: "alola",
						},
						{
							name: undefined,
							value: "galar",
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Boolean,
					name: "favorite",
					description: undefined,
					required: false,
				},
				{
					type: ApplicationCommandOptionType.Boolean,
					name: "display-id",
					description: undefined,
					required: false,
				},
			],
		},
		{
			type: ApplicationCommandOptionType.SubcommandGroup,
			name: "favorite",
			description: undefined,
			options: [
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "add",
					description: undefined,
					options: [
						{
							type: ApplicationCommandOptionType.String,
							name: "pokemon",
							description: undefined,
							required: true,
							autocomplete: true,
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "remove",
					description: undefined,
					options: [
						{
							type: ApplicationCommandOptionType.String,
							name: "pokemon",
							description: undefined,
							required: true,
							autocomplete: true,
						},
					],
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "nickname",
			description: undefined,
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "pokemon",
					description: undefined,
					required: true,
					autocomplete: true,
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "nickname",
					description: undefined,
					required: false,
				},
			],
		},
	],

	run: {
		list: async function (input, args, localizations) {
			const user = (args.get("user") as User) ?? input.user;
			const name = args.get("name") as string;
			const nickname = args.get("nickname") as string;
			const id = args.get("id") as number;
			const generation = args.get("generation") as number;
			const evolutions = args.get("evolutions") as string;
			const normal = args.get("normal") as boolean;
			const legendary = args.get("legendary") as boolean;
			const ultraBeast = args.get("ultra-beast") as boolean;
			const shiny = args.get("shiny") as boolean;
			const variationType: VariationTypeName =
				VariationTypeName[args.get("variation") as string] ?? VariationTypeName.default;
			const favorite = args.get("favorite") as boolean;
			const displayId = args.get("display-id") as boolean;

			const { rows: databasePokemons }: { rows: DatabaseUserPokemon[] } = await Util.database.query(
				"SELECT * FROM user_pokemon WHERE user_id = $1",
				[user.id],
			);

			const pokemonList = new PokemonList(input.user, databasePokemons);
			const pokemons = pokemonList.pokemons.filter((pkm) => {
				if (
					name &&
					!new RegExp(name, "i").test(Util.pokedex.findById(pkm.data.nationalId).name.default) &&
					!new RegExp(name, "i").test(Util.pokedex.findById(pkm.data.nationalId).name.localization[input.locale])
				)
					return false;

				if (nickname && !new RegExp(nickname, "i").test(pkm.nickname)) return false;
				if (id && pkm.data.nationalId !== id) return false;
				if (generation && Util.pokedex.findById(pkm.data.nationalId).generation !== generation) return false;

				if (
					evolutions &&
					Util.pokedex.findByName(evolutions, input.locale) &&
					!Util.pokedex
						.findByName(evolutions, input.locale)
						.flatEvolutionLine.some((p) => p.nationalId === pkm.data.nationalId)
				)
					return false;

				if (
					normal &&
					(pkm.shiny || pkm.variationType !== VariationTypeName.default || pkm.variation !== VariationName.default)
				)
					return false;

				if (legendary && !Util.pokedex.findById(pkm.data.nationalId).legendary) return false;
				if (ultraBeast && !Util.pokedex.findById(pkm.data.nationalId).ultraBeast) return false;
				if (shiny && !pkm.shiny) return false;
				if (pkm.variationType !== variationType) return false;
				if (favorite && !pkm.favorite) return false;

				return true;
			});

			pokemons.sort((a, b) => {
				return (
					Number(b.data.legendary) - Number(a.data.legendary) || // Legendary pokémons first
					Number(b.data.ultraBeast) - Number(a.data.ultraBeast) || // Ultra beasts after
					Number(b.shiny) - Number(a.shiny) || // Followed by shiny pokémons
					b.caught - a.caught || // Sort by most caught pokémons
					a.data.nationalId - b.data.nationalId // and finally by pokédex ID
				);
			});

			const pages: Page[] = [];

			if (!pokemons.length)
				pages.push({
					embeds: [
						{
							author: {
								name: localizations.author.format(input.locale, user.tag),
								icon_url: user.displayAvatarURL(),
							},
							color: input.guild.members.me.displayColor,
							description: localizations.no_pokemon.format(input.locale),
						},
					],
				});

			const total = pokemons.reduce((sum, p) => sum + p.caught, 0);

			for (let i = 0; i < pokemons.length; i += Util.config.ITEMS_PER_PAGE) {
				const page: Page = {
					embeds: [
						{
							author: {
								name: localizations.author.format(input.locale, user.tag),
								icon_url: user.displayAvatarURL(),
							},
							title: localizations.total.format(input.locale, total.toString(), total > 1),
							color: input.guild.members.me.displayColor,
							thumbnail: {
								url:
									pokemons.length === 1
										? pokemonList[0].data.image(
												pokemonList[0].shiny,
												pokemonList[0].variationType,
												pokemonList[0].variation,
										  )
										: undefined,
							},
							description: pokemons
								.slice(i, i + Util.config.ITEMS_PER_PAGE)
								.map((p) =>
									localizations.description.format(
										input.locale,
										p.data.formatName(NameFormat.BADGE, p.shiny, p.variationType, p.variation, input.locale),
										p.data.formatName(NameFormat.RAW, p.shiny, p.variationType, p.variation, input.locale),
										displayId,
										`#${p.data.nationalId.toString().padStart(3, "0")}`,
										escapeMarkdown(p.nickname),
										p.caught.toString(),
										p.caught > 1,
										p.favorite,
										`https://www.pokemon.com/${
											input.locale === Locale.French ? "fr" : input.locale === Locale.German ? "de" : "us"
										}/pokedex/${p.data.name.localization
											.get(input.locale)
											.toLowerCase()
											.replace(/[^\w\s]+/g, "")
											.replace(/\s+/g, "-")
											.replace(/\u2642/, "-male")
											.replace(/\u2640/, "-female")}`,
									),
								)
								.join("\n"),
						},
					],
				};

				pages.push(page);
			}

			pagination(input, pages);
		},

		favorite: {
			add: async function (input, args, localizations) {
				const pokemonName = args.get("pokemon") as string;

				const { pokemon, shiny, pokemonVariation } =
					Util.pokedex.findByNameWithVariation(pokemonName, input.locale) ?? {};

				if (!pokemon) {
					await input.reply(localizations.invalid_pokemon.format(input.locale));
					return;
				}

				const {
					rows: [userPokemon],
				}: { rows: Pick<DatabaseUserPokemon, "user_id">[] } = await Util.database.query(
					"SELECT user_id FROM user_pokemon WHERE user_id = $1 AND pokemon_id = $2 AND shiny = $3 AND variation_type = $4 AND variation = $5",
					[
						input.user.id,
						pokemon.nationalId,
						shiny,
						pokemonVariation?.variationType ?? VariationTypeName.default,
						pokemonVariation?.variation ?? VariationName.default,
					],
				);

				if (!userPokemon) {
					await input.reply(localizations.pokemon_not_owned.format(input.locale));
					return;
				}

				await Util.database.query(
					`
					UPDATE user_pokemon SET favorite = true
					WHERE user_id = $1 AND pokemon_id = $2 AND shiny = $3 AND variation_type = $4 AND variation = $5
					`,
					[
						input.user.id,
						pokemon.nationalId,
						shiny,
						pokemonVariation?.variationType ?? VariationTypeName.default,
						pokemonVariation?.variation ?? VariationName.default,
					],
				);

				input.reply(
					localizations.favorite_added.format(
						input.locale,
						pokemon.formatName(
							NameFormat.FULL,
							shiny,
							pokemonVariation?.variationType ?? VariationTypeName.default,
							pokemonVariation?.variation ?? VariationName.default,
							input.locale,
						),
					),
				);
			},

			remove: async function (input, args, localizations) {
				const pokemonName = args.get("pokemon") as string;

				const { pokemon, shiny, pokemonVariation } =
					Util.pokedex.findByNameWithVariation(pokemonName, input.locale) ?? {};

				if (!pokemon) {
					await input.reply(localizations.invalid_pokemon.format(input.locale));
					return;
				}

				const {
					rows: [userPokemon],
				}: { rows: Pick<DatabaseUserPokemon, "user_id">[] } = await Util.database.query(
					"SELECT user_id FROM user_pokemon WHERE user_id = $1 AND pokemon_id = $2 AND shiny = $3 AND variation_type = $4 AND variation = $5",
					[
						input.user.id,
						pokemon.nationalId,
						shiny,
						pokemonVariation?.variationType ?? VariationTypeName.default,
						pokemonVariation?.variation ?? VariationName.default,
					],
				);

				if (!userPokemon) {
					await input.reply(localizations.pokemon_not_owned.format(input.locale));
					return;
				}

				await Util.database.query(
					`
					UPDATE user_pokemon SET favorite = false
					WHERE user_id = $1 AND pokemon_id = $2 AND shiny = $3 AND variation_type = $4 AND variation = $5
					`,
					[
						input.user.id,
						pokemon.nationalId,
						shiny,
						pokemonVariation?.variationType ?? VariationTypeName.default,
						pokemonVariation?.variation ?? VariationName.default,
					],
				);

				input.reply(
					localizations.favorite_removed.format(
						input.locale,
						pokemon.formatName(
							NameFormat.FULL,
							shiny,
							pokemonVariation?.variationType ?? VariationTypeName.default,
							pokemonVariation?.variation ?? VariationName.default,
							input.locale,
						),
					),
				);
			},
		},

		nickname: async function (input, args, localizations) {
			const pokemonName = args.get("pokemon") as string;
			const nickname = args.get("nickname") as string;

			const { pokemon, shiny, pokemonVariation } =
				Util.pokedex.findByNameWithVariation(pokemonName, input.locale) ?? {};

			if (!pokemon) {
				await input.reply(localizations.invalid_pokemon.format(input.locale));
				return;
			}

			const {
				rows: [userPokemon],
			}: { rows: Pick<DatabaseUserPokemon, "user_id">[] } = await Util.database.query(
				"SELECT user_id FROM user_pokemon WHERE user_id = $1 AND pokemon_id = $2 AND shiny = $3 AND variation_type = $4 AND variation = $5",
				[
					input.user.id,
					pokemon.nationalId,
					shiny,
					pokemonVariation?.variationType ?? VariationTypeName.default,
					pokemonVariation?.variation ?? VariationName.default,
				],
			);

			if (!userPokemon) {
				await input.reply(localizations.pokemon_not_owned.format(input.locale));
				return;
			}

			if (nickname && nickname.length > 32) {
				await input.reply(localizations.nickname_too_long.format(input.locale));
				return;
			}

			await Util.database.query(
				`
					UPDATE user_pokemon SET nickname = $6
					WHERE user_id = $1 AND pokemon_id = $2 AND shiny = $3 AND variation_type = $4 AND variation = $5
					`,
				[
					input.user.id,
					pokemon.nationalId,
					shiny,
					pokemonVariation?.variationType ?? VariationTypeName.default,
					pokemonVariation?.variation ?? VariationName.default,
					nickname,
				],
			);

			input.reply(
				localizations.nickname_updated.format(
					input.locale,
					pokemon.formatName(
						NameFormat.FULL,
						shiny,
						pokemonVariation?.variationType ?? VariationTypeName.default,
						pokemonVariation?.variation ?? VariationName.default,
						input.locale,
					),
					nickname,
				),
			);
		},
	},
};

export default command;
