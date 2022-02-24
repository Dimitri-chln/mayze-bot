import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import { ButtonInteraction, CollectorFilter } from "discord.js";

const command: Command = {
	name: "hunt",
	aliases: [],
	description: {
		fr: "Chasse un pokémon en particulier",
		en: "Hunt a specific pokémon",
	},
	usage: "",

	userPermissions: [],
	botPermissions: ["ADD_REACTIONS"],

	options: {
		fr: [
			{
				name: "pokemon",
				description: 'Le pokémon à chasser (utilise "none" pour réinitialiser)',
				type: "STRING",
				required: false,
				autocomplete: true,
			},
		],
		en: [
			{
				name: "pokemon",
				description: 'The pokémon to hunt (use "none" to reset)',
				type: "STRING",
				required: false,
				autocomplete: true,
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const input = interaction.options.getString("pokemon", false);

		if (!input) {
			const {
				rows: [huntedPokemonData],
			} = await Util.database.query(
				"SELECT * FROM pokemon_hunting WHERE user_id = $1",
				[interaction.user.id],
			);

			if (huntedPokemonData) {
				const huntedPokemon = Util.pokedex.findById(
					huntedPokemonData.pokemon_id,
				);

				const probability =
					huntedPokemonData.hunt_count < 100
						? (huntedPokemonData.hunt_count / 100) *
						  (huntedPokemon.catchRate / 255)
						: 1;

				return interaction.followUp(
					translations.strings.hunt_info(
						huntedPokemon.names[translations.language] ??
							huntedPokemon.names.en,
						(Math.round(probability * 100 * 10_000) / 10_000).toString(),
					),
				);
			} else {
				return interaction.followUp(translations.strings.not_hunting());
			}
		}

		if (input === "none") {
			Util.database
				.query("DELETE FROM pokemon_hunting WHERE user_id = $1", [
					interaction.user.id,
				])
				.then(() => {
					interaction.followUp(translations.strings.deleted());
				});

			return;
		}

		const pokemon = Util.pokedex.findByName(input);
		if (!pokemon)
			return interaction.followUp(translations.strings.invalid_pokemon());

		const reply = (await interaction.followUp({
			content: translations.strings.confirmation(
				pokemon.names[translations.language] ?? pokemon.names.en,
			),
			components: [
				{
					type: "ACTION_ROW",
					components: [
						{
							type: "BUTTON",
							customId: "confirm",
							emoji: Util.config.EMOJIS.check.data,
							style: "SUCCESS",
						},
						{
							type: "BUTTON",
							customId: "cancel",
							emoji: Util.config.EMOJIS.cross.data,
							style: "DANGER",
						},
					],
				},
			],
			fetchReply: true,
		})) as Message;

		const filter: CollectorFilter<[ButtonInteraction]> = (buttonInteraction) =>
			buttonInteraction.user.id === interaction.user.id;

		try {
			const buttonInteraction = await reply.awaitMessageComponent({
				filter,
				componentType: "BUTTON",
				time: 60_000,
			});

			switch (buttonInteraction.customId) {
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

					buttonInteraction.update({
						content: translations.strings.hunting(
							pokemon.names[translations.language] ?? pokemon.names.en,
						),
						components: [
							{
								type: "ACTION_ROW",
								components: [
									{
										type: "BUTTON",
										customId: "confirm",
										emoji: Util.config.EMOJIS.check.data,
										style: "SUCCESS",
										disabled: true,
									},
									{
										type: "BUTTON",
										customId: "cancel",
										emoji: Util.config.EMOJIS.cross.data,
										style: "DANGER",
										disabled: true,
									},
								],
							},
						],
					});
					break;
				}

				case "cancel": {
					buttonInteraction.update({
						content: translations.strings.cancelled(),
						components: [
							{
								type: "ACTION_ROW",
								components: [
									{
										type: "BUTTON",
										customId: "confirm",
										emoji: Util.config.EMOJIS.check.data,
										style: "SUCCESS",
										disabled: true,
									},
									{
										type: "BUTTON",
										customId: "cancel",
										emoji: Util.config.EMOJIS.cross.data,
										style: "DANGER",
										disabled: true,
									},
								],
							},
						],
					});
					break;
				}
			}
		} catch (err) {
			interaction.editReply({
				content: translations.strings.cancelled(),
				components: [
					{
						type: "ACTION_ROW",
						components: [
							{
								type: "BUTTON",
								customId: "confirm",
								emoji: Util.config.EMOJIS.check.data,
								style: "SUCCESS",
								disabled: true,
							},
							{
								type: "BUTTON",
								customId: "cancel",
								emoji: Util.config.EMOJIS.cross.data,
								style: "DANGER",
								disabled: true,
							},
						],
					},
				],
			});
		}
	},
};

export default command;
