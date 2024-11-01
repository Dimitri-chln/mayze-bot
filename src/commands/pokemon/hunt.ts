import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import Util from "../../Util";

import { DatabasePokemonHunting } from "../../types/Database";

import confirmation from "../../utils/misc/confirmation";

const command: CommandData = {
	name: "hunt",
	aliases: [],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField([PermissionFlagsBits.EmbedLinks]),

	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "info",
			description: undefined,
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "start",
			description: undefined,
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "pokemon",
					description: undefined,
					required: true,
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "stop",
			description: undefined,
		},
	],

	run: {
		info: async function (input, args, localizations) {
			const {
				rows: [pokemonHuntingData],
			}: { rows: Pick<DatabasePokemonHunting, "pokemon_id" | "hunt_count">[] } = await Util.database.query(
				"SELECT pokemon_id, hunt_count FROM pokemon_hunting WHERE user_id = $1",
				[input.user.id],
			);

			if (!pokemonHuntingData) {
				await input.reply(localizations.not_hunting.format(input.locale));
				return;
			}

			const huntedPokemon = Util.pokedex.findById(pokemonHuntingData.pokemon_id);
			const probability = Math.min((pokemonHuntingData.hunt_count / 100) * (huntedPokemon.catchRate / 255), 1);

			input.reply({
				embeds: [
					{
						author: {
							name: localizations.author.format(input.locale),
							icon_url: input.user.displayAvatarURL(),
						},
						thumbnail: {
							url: huntedPokemon.image(),
						},
						color: input.guild.members.me.displayColor,
						description: localizations.description.format(
							input.locale,
							huntedPokemon.name.localization.get(input.locale),
							(Math.round(probability * 100 * 10_000) / 10_000).toString(),
						),
						footer: {
							text: Util.config.DEFAULT_EMBED_FOOTER_TEXT,
						},
					},
				],
			});
		},

		start: async function (input, args, localizations) {
			const pokemonName = args.get("pokemon") as string;

			const pokemon = Util.pokedex.findByName(pokemonName, input.locale);
			if (!pokemon) {
				await input.reply(localizations.invalid_pokemon.format(input.locale));
				return;
			}

			const confirmed = await confirmation(
				input,
				localizations.confirmation.format(input.locale, pokemon.name.localization.get(input.locale)),
				localizations.hunting.format(input.locale, pokemon.name.localization.get(input.locale)),
				localizations.cancelled.format(input.locale),
			);

			if (!confirmed) return;

			await Util.database.query(
				`
				INSERT INTO pokemon_hunting VALUES ($1, $2)
				ON CONFLICT (user_id)
				DO UPDATE SET pokemon_id = EXCLUDED.pokemon_id, hunt_count = 0
				WHERE pokemon_hunting.user_id = EXCLUDED.user_id
				`,
				[input.user.id, pokemon.nationalId],
			);
		},

		stop: async function (input, args, localizations) {
			const {
				rows: [pokemonHuntingData],
			}: { rows: Pick<DatabasePokemonHunting, "pokemon_id" | "hunt_count">[] } = await Util.database.query(
				"SELECT pokemon_id, hunt_count FROM pokemon_hunting WHERE user_id = $1",
				[input.user.id],
			);

			if (!pokemonHuntingData) {
				await input.reply(localizations.not_hunting.format(input.locale));
				return;
			}

			const huntedPokemon = Util.pokedex.findById(pokemonHuntingData.pokemon_id);

			const confirmed = await confirmation(
				input,
				localizations.confirmation.format(input.locale, huntedPokemon.name.localization.get(input.locale)),
				localizations.stopped_hunting.format(input.locale, huntedPokemon.name.localization.get(input.locale)),
				localizations.cancelled.format(input.locale),
			);

			if (!confirmed) return;

			await Util.database.query("DELETE FROM pokemon_hunting WHERE user_id = $1", [input.user.id]);
		},
	},
};

export default command;
