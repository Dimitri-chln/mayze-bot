import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import groupArrayBy from "../../utils/misc/groupArrayBy";
import { DatabasePokemon } from "../../types/structures/Database";
import { sleep } from "../../utils/misc/sleep";

const command: Command = {
	name: "mega",
	aliases: [],
	description: {
		fr: "Gérer tes méga gemmes",
		en: "Manage your mega gems",
	},
	usage: "",
	userPermissions: [],
	botPermissions: ["ADD_REACTIONS"],

	options: {
		fr: [
			{
				name: "evolve",
				description: "Faire méga évoluer un pokémon",
				type: "SUB_COMMAND",
				options: [
					{
						name: "pokemon",
						description: "Le pokémon à faire méga évoluer",
						type: "STRING",
						required: true,
						autocomplete: true,
					},
					{
						name: "type",
						description: "Le type de méga évolution",
						type: "STRING",
						required: true,
						choices: [
							{
								name: "Méga",
								value: "default",
							},
							{
								name: "Méga X",
								value: "megax",
							},
							{
								name: "Méga Y",
								value: "megay",
							},
							{
								name: "Primal",
								value: "primal",
							},
						],
					},
				],
			},
			{
				name: "gems",
				description: "Voir la liste de tes méga gemmes",
				type: "SUB_COMMAND",
			},
		],
		en: [
			{
				name: "evolve",
				description: "Mega evolve a pokémon",
				type: "SUB_COMMAND",
				options: [
					{
						name: "pokemon",
						description: "The pokémon to mega evolve",
						type: "STRING",
						required: true,
						autocomplete: true,
					},
					{
						name: "type",
						description: "The mega evolution type",
						type: "STRING",
						required: true,
						choices: [
							{
								name: "Mega",
								value: "default",
							},
							{
								name: "Mega X",
								value: "megax",
							},
							{
								name: "Mega Y",
								value: "megay",
							},
							{
								name: "Primal",
								value: "primal",
							},
						],
					},
				],
			},
			{
				name: "gems",
				description: "See the list of your mega gems",
				type: "SUB_COMMAND",
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const subCommand = interaction.options.getSubcommand();

		const {
			rows: [{ gems }],
		} = await Util.database.query(
			"SELECT * FROM mega_gems WHERE user_id = $1",
			[interaction.user.id],
		);

		switch (subCommand) {
			case "evolve": {
				const { pokemon, shiny } =
					Util.pokedex.findByNameWithVariation(
						interaction.options.getString("pokemon", true),
					) ?? {};

				if (!pokemon)
					return interaction.followUp(translations.strings.invalid_pokemon());

				const megaType = interaction.options.getString("type", true) as
					| "default"
					| "megax"
					| "megay"
					| "primal";

				const {
					rows: [pokemonData],
				}: { rows: DatabasePokemon[] } = await Util.database.query(
					"SELECT * FROM pokemon WHERE national_id = $1 AND shiny = $2 AND variation_type = 'default' AND users ? $3",
					[pokemon.nationalId, shiny, interaction.user.id],
				);

				if (!pokemonData)
					return interaction.followUp(translations.strings.pokemon_not_owned());

				const megaEvolution = pokemon.megaEvolutions.find(
					(mega) => mega.variation === megaType,
				);

				if (!megaEvolution)
					return interaction.followUp(
						translations.strings.invalid_mega_evolution(),
					);

				if (!gems[megaEvolution.megaStone])
					return interaction.followUp(
						translations.strings.no_mega_gem(megaEvolution.megaStone),
					);

				Util.database.query(
					`
					UPDATE mega_gems
					SET gems =
						CASE
							WHEN (gems -> $1)::int = 1 THEN gems - $1
							ELSE jsonb_set(gems, '{${megaEvolution.megaStone}}', ((gems -> $1)::int - 1)::text::jsonb)
						END
					WHERE user_id = $2
					`,
					[megaEvolution.megaStone, interaction.user.id],
				);

				const defaultUserData = {
					caught: 1,
					favorite: false,
					nickname: null,
				};
				const defaultData = {};
				defaultData[interaction.user.id] = defaultUserData;

				Util.database.query(
					`
					INSERT INTO pokemon VALUES ($1, $2, $3, $4, $5)
					ON CONFLICT (national_id, shiny, variation_type, variation)
					DO UPDATE SET users =
						CASE
							WHEN pokemon.users -> $6 IS NULL THEN jsonb_set(pokemon.users, '{${interaction.user.id}}', $7)
							ELSE jsonb_set(pokemon.users, '{${interaction.user.id}, caught}', ((pokemon.users -> $6 -> 'caught')::int + 1)::text::jsonb)
						END
					WHERE pokemon.national_id = EXCLUDED.national_id AND pokemon.shiny = EXCLUDED.shiny AND pokemon.variation = EXCLUDED.variation
					`,
					[
						pokemon.nationalId,
						shiny,
						megaEvolution.variationType,
						megaEvolution.variation,
						defaultData,
						interaction.user.id,
						defaultUserData,
					],
				);

				Util.database.query(
					`
					UPDATE pokemon
					SET users =
						CASE
							WHEN (users -> $1 -> 'caught')::int = 1 THEN users - $1
							ELSE jsonb_set(users, '{${interaction.user.id}, caught}', ((users -> $1 -> 'caught')::int - 1)::text::jsonb)
						END
					WHERE national_id = $2 AND shiny = $3 AND variation_type = $4
					`,
					[interaction.user.id, pokemon.nationalId, shiny, "default"],
				);

				const reply = (await interaction.followUp({
					embeds: [
						{
							author: {
								name: translations.strings.evolving_title(interaction.user.tag),
								iconURL: interaction.user.displayAvatarURL({
									dynamic: true,
								}),
							},
							color: interaction.guild.me.displayColor,
							thumbnail: {
								url: pokemon.image(shiny, "default"),
							},
							description: translations.strings.evolving(
								pokemon.formatName(translations.language, shiny, "default"),
							),
						},
					],
					fetchReply: true,
				})) as Message;

				await sleep(3_000);

				interaction.editReply({
					embeds: [
						reply.embeds[0]
							.setThumbnail(
								pokemon.image(
									shiny,
									megaEvolution.variationType,
									megaEvolution.variation,
								),
							)
							.setDescription(
								translations.strings.evolved(
									pokemon.formatName(translations.language, shiny, "default"),
									pokemon.formatName(
										translations.language,
										shiny,
										megaEvolution.variationType,
										megaEvolution.variation,
									),
								),
							),
					],
				});
				break;
			}

			case "gems": {
				const gemList = groupArrayBy(Object.entries(gems), 2);

				interaction.followUp({
					embeds: [
						{
							author: {
								name: translations.strings.author(interaction.user.tag),
								iconURL: interaction.user.displayAvatarURL({
									dynamic: true,
								}),
							},
							color: interaction.guild.me.displayColor,
							// U+00d7 : ×
							description: `\`\`\`\n${gemList
								.map((group) =>
									group
										.map(([gem, number]) =>
											`${gem} \u00d7${number}`.padEnd(20, " "),
										)
										.join(" "),
								)
								.join("\n")}\n\`\`\``,
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
