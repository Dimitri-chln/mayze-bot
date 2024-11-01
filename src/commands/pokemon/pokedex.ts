import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import Util from "../../Util";

import { DatabaseUserPokemon } from "../../types/Database";

import { NameFormat, VariationName, VariationTypeName } from "../../structures/pokemons/Pokemon";
import PokemonList from "../../structures/pokemons/PokemonList";

import pagination, { Page } from "../../utils/misc/pagination";

const command: CommandData = {
	name: "pokedex",
	aliases: ["dex"],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField([PermissionFlagsBits.EmbedLinks]),

	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "find",
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
			name: "list",
			description: undefined,
			options: [
				{
					type: ApplicationCommandOptionType.Boolean,
					name: "caught",
					description: undefined,
					required: false,
				},
				{
					type: ApplicationCommandOptionType.Boolean,
					name: "missing",
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
					type: ApplicationCommandOptionType.Integer,
					name: "generation",
					description: undefined,
					required: false,
					min_value: 1,
					max_value: 8,
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
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "evolutions",
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

	run: {
		find: async function (input, args, localizations) {
			const pokemonName = args.get("pokemon") as string;

			const { pokemon, shiny, pokemonVariation } = Util.pokedex.findByNameWithVariation(pokemonName, input.locale) ?? {
				pokemon: Util.pokedex.findById(parseInt(pokemonName)),
				shiny: false,
			};

			if (!pokemon) {
				await input.reply(localizations.invalid_pokemon.format(input.locale));
				return;
			}

			await input.reply({
				embeds: [
					{
						title: `${pokemon.formatName(
							NameFormat.FULL,
							shiny,
							pokemonVariation?.variationType ?? VariationTypeName.default,
							pokemonVariation?.variation ?? VariationName.default,
							input.locale,
						)} #${pokemon.nationalId.toString().padStart(3, "0")}`,
						color: input.guild.members.me.displayColor,
						image: {
							url: pokemon.image(
								shiny,
								pokemonVariation?.variationType ?? VariationTypeName.default,
								pokemonVariation?.variation ?? VariationName.default,
							),
						},
						fields: [
							{
								name: localizations.field_types.format(input.locale),
								value: pokemon.types.map((type) => `- ${type}`).join("\n"),
								inline: true,
							},
							{
								name: localizations.field_forms.format(input.locale),
								value: pokemon.variations.length
									? pokemon.variations.map((variation) => `- ${variation.name.format(input.locale)}`).join("\n") + "\n"
									: "∅",
								inline: true,
							},
						],
						footer: {
							text: Util.config.DEFAULT_EMBED_FOOTER_TEXT,
						},
					},
				],
			});
		},

		list: async function (input, args, localizations) {
			const caught = args.get("caught") as boolean;
			const missing = args.get("missing") as boolean;
			const shiny = args.get("shiny") as boolean;
			const legendary = args.get("legendary") as boolean;
			const ultraBeast = args.get("ultraBeast") as boolean;
			const generation = args.get("generation") as number;
			const variationType: VariationTypeName =
				VariationTypeName[args.get("variation") as string] ?? VariationTypeName.default;

			const { rows: databasePokemons }: { rows: DatabaseUserPokemon[] } = await Util.database.query(
				"SELECT * FROM user_pokemon WHERE user_id = $1",
				[input.user.id],
			);

			const pokemonList = new PokemonList(input.user, databasePokemons);

			const userPokedex = Util.pokedex.pokemons.filter((pokemon) => {
				if (caught && !pokemonList.has(pokemon.nationalId, shiny, variationType)) return false;
				if (missing && pokemonList.has(pokemon.nationalId, shiny, variationType)) return false;
				if (legendary && !pokemon.legendary) return false;
				if (ultraBeast && !pokemon.ultraBeast) return false;
				if (generation && pokemon.generation !== generation) return false;
				if (!pokemon.variations.some((variation) => variation.variationType === variationType)) return false;

				return true;
			});

			const userPokedexArray = [...userPokedex.values()];
			const pages: Page[] = [];

			if (!userPokedex.size)
				pages.push({
					embeds: [
						{
							author: {
								name: localizations.author.format(input.locale, input.user.tag),
								icon_url: input.user.displayAvatarURL(),
							},
							color: input.guild.members.me.displayColor,
							description: localizations.no_pokemon.format(input.locale),
						},
					],
				});

			for (let i = 0; i < userPokedex.size; i += Util.config.ITEMS_PER_PAGE) {
				pages.push({
					embeds: [
						{
							author: {
								name: localizations.author.format(input.locale, input.user.tag),
								icon_url: input.user.displayAvatarURL(),
							},
							color: input.guild.members.me.displayColor,
							description: userPokedexArray
								.slice(i, i + Util.config.ITEMS_PER_PAGE)
								.map((pkm) => {
									if (variationType === VariationTypeName.default)
										return localizations.description.format(
											input.locale,
											pokemonList.has(pkm.nationalId, shiny, variationType),
											pkm.formatName(NameFormat.FULL, shiny, variationType, VariationName.default, input.locale),
											pkm.nationalId.toString().padStart(3, "0"),
										);
									else
										return pkm.variations
											.filter((variation) => variation.variationType === variationType)
											.map((variation) =>
												localizations.description.format(
													input.locale,
													pokemonList.has(pkm.nationalId, shiny, variationType),
													pkm.formatName(NameFormat.FULL, shiny, variationType, variation.variation, input.locale),
													pkm.nationalId.toString().padStart(3, "0"),
												),
											);
								})
								.flat(1)
								.join("\n"),
						},
					],
				});
			}

			await pagination(input, pages);
		},

		evolutions: async function (input, args, localizations) {
			const pokemonName = args.get("pokemon") as string;

			const pokemon =
				Util.pokedex.findByName(pokemonName, input.locale) ?? Util.pokedex.findById(parseInt(pokemonName));

			if (!pokemon) {
				await input.reply(localizations.invalid_pokemon.format(input.locale));
				return;
			}

			const stringEvolutionLine = pokemon.stringEvolutionLine[input.locale];

			await input.reply({
				embeds: [
					{
						author: {
							name: localizations.author.format(input.locale, pokemon.name.format(input.locale)),
							icon_url: input.client.user.displayAvatarURL(),
						},
						thumbnail: {
							url: `https://assets.poketwo.net/images/${pokemon.nationalId}.png`,
						},
						color: input.guild.members.me.displayColor,
						description: `\`\`\`\n${stringEvolutionLine}\n\`\`\``,
						footer: {
							text: Util.config.DEFAULT_EMBED_FOOTER_TEXT,
						},
					},
				],
			});
		},
	},
};

export default command;
