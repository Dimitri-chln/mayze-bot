import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";

import Pokedex from "../../types/pokemon/Pokedex";
import { ButtonInteraction, CollectorFilter } from "discord.js";

const command: Command = {
	name: "hunt",
	description: {
		fr: "Chasse un pokémon en particulier",
		en: "Hunt a specific pokémon",
	},

	userPermissions: [],
	botPermissions: ["ADD_REACTIONS"],

	options: {
		fr: [
			{
				name: "pokemon",
				description:
					'Le pokémon à chasser (utilise "none" pour réinitialiser)',
				type: "STRING",
				required: false,
			},
		],
		en: [
			{
				name: "pokemon",
				description: 'The pokémon to hunt (use "none" to reset)',
				type: "STRING",
				required: false,
			},
		],
	},

	run: async (interaction, translations) => {
		const input = interaction.options.getString("pokemon");

		if (!input) {
			const {
				rows: [huntedPokemonData],
			} = await Util.database.query(
				"SELECT * FROM pokemon_hunting WHERE user_id = $1",
				[interaction.user.id],
			);

			if (huntedPokemonData) {
				const huntedPokemon = Pokedex.findById(
					huntedPokemonData.pokemon_id,
				);

				const probability =
					huntedPokemonData.hunt_count < 100
						? (huntedPokemonData.hunt_count / 100) *
						  (huntedPokemon.catchRate / 255)
						: 1;

				return interaction.followUp(
					translations.data.hunt_info(
						huntedPokemon.names[translations.language] ??
							huntedPokemon.names.en,
						(
							Math.round(probability * 100 * 10_000) / 10_000
						).toString(),
					),
				);
			} else {
				return interaction.followUp(translations.data.not_hunting());
			}
		}

		if (input === "none") {
			Util.database
				.query("DELETE FROM pokemon_hunting WHERE user_id = $1", [
					interaction.user.id,
				])
				.then(() => {
					interaction.followUp(translations.data.deleted());
				});

			return;
		}

		const pokemon = Pokedex.findByName(input);
		if (!pokemon)
			return interaction.followUp(translations.data.invalid_pokemon());

		const reply = (await interaction.followUp({
			content: translations.data.confirmation(
				pokemon.names[translations.language] ?? pokemon.names.en,
			),
			components: [
				{
					type: "ACTION_ROW",
					components: [
						{
							type: "BUTTON",
							customId: "confirm",
							emoji: "✅",
							style: "SUCCESS",
						},
						{
							type: "BUTTON",
							customId: "cancel",
							emoji: "❌",
							style: "DANGER",
						},
					],
				},
			],
			fetchReply: true,
		})) as Message;

		const filter: CollectorFilter<[ButtonInteraction]> = (
			buttonInteraction,
		) => buttonInteraction.user.id === interaction.user.id;
		const collected = await reply.awaitMessageComponent({
			filter,
			componentType: "BUTTON",
			time: 60_000,
		});

		collected.update({
			content: reply.content,
			components: [
				{
					type: "ACTION_ROW",
					components: [
						{
							type: "BUTTON",
							customId: "confirm",
							emoji: "✅",
							style: "SUCCESS",
							disabled: true,
						},
						{
							type: "BUTTON",
							customId: "cancel",
							emoji: "❌",
							style: "DANGER",
							disabled: true,
						},
					],
				},
			],
		});

		switch (collected.customId) {
			case "confirm": {
				await Util.database.query(
					`
					INSERT INTO pokemon_hunting VALUES ($1, $2)
					ON CONFLICT (user_id)
					DO UPDATE SET pokemon_id = EXCLUDED.pokemon_id, hunt_count = 0
					WHERE pokemon_hunting.user_id = EXCLUDED.user_id
					`,
					[interaction.user.id, pokemon.nationalId],
				);

				interaction.followUp(
					translations.data.hunting(
						pokemon.names[translations.language] ??
							pokemon.names.en,
					),
				);
				break;
			}

			case "cancel": {
				interaction.followUp(translations.data.cancelled());
				break;
			}
		}
	},
};

export default command;
