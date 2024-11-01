import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import Util from "../../Util";

import { DatabaseUserMegaStone } from "../../types/Database";

import groupArrayBy from "../../utils/misc/groupArrayBy";

const command: CommandData = {
	name: "mega",
	aliases: [],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField([PermissionFlagsBits.AddReactions]),

	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "gems",
			description: undefined,
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "evolve",
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
					name: "gem",
					description: undefined,
					required: true,
					autocomplete: true,
				},
			],
		},
	],

	run: {
		gems: async function (input, args, localizations) {
			const { rows: megaStones }: { rows: DatabaseUserMegaStone[] } = await Util.database.query(
				"SELECT * FROM user_mega_stone WHERE user_id = $1",
				[input.user.id],
			);

			const gemList = groupArrayBy(megaStones, 2);

			input.reply({
				embeds: [
					{
						author: {
							name: localizations.author.format(input.locale, input.user.tag),
							icon_url: input.user.displayAvatarURL(),
						},
						color: input.guild.members.me.displayColor,
						// U+00d7 : ×
						description: `\`\`\`\n${gemList
							.map((group) => group.map(([gem, number]) => `${gem} \u00d7${number}`.padEnd(20, " ")).join(" "))
							.join("\n")}\n\`\`\``,
						footer: {
							text: "✨ Mayze ✨",
						},
					},
				],
			});
		},

		evolve: async function (input, args, localizations) {},
	},
};

const command: Command = {
	runInteraction: async (interaction, translations) => {
		const subCommand = interaction.options.getSubcommand();

		const {
			rows: [{ gems }],
		} = await Util.database.query("SELECT * FROM mega_gems WHERE user_id = $1", [interaction.user.id]);

		switch (subCommand) {
			case "evolve": {
				const { pokemon, shiny } =
					Util.pokedex.findByNameWithVariation(interaction.options.getString("pokemon", true)) ?? {};

				if (!pokemon) return interaction.followUp(translations.strings.invalid_pokemon());

				const megaType = interaction.options.getString("type", true) as "default" | "megax" | "megay" | "primal";

				const {
					rows: [pokemonData],
				}: { rows: DatabasePokemon[] } = await Util.database.query(
					"SELECT * FROM pokemon WHERE national_id = $1 AND shiny = $2 AND variation_type = 'default' AND users ? $3",
					[pokemon.nationalId, shiny, interaction.user.id],
				);

				if (!pokemonData) return interaction.followUp(translations.strings.pokemon_not_owned());

				const megaEvolution = pokemon.megaEvolutions.find((mega) => mega.variation === megaType);

				if (!megaEvolution) return interaction.followUp(translations.strings.invalid_mega_evolution());

				if (!gems[megaEvolution.megaStone])
					return interaction.followUp(translations.strings.no_mega_gem(megaEvolution.megaStone));

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
								name: translations.strings.evolving_author(interaction.user.tag),
								iconURL: interaction.user.displayAvatarURL({
									dynamic: true,
								}),
							},
							color: interaction.guild.me.displayColor,
							thumbnail: {
								url: pokemon.image(shiny, "default"),
							},
							description: translations.strings.evolving(pokemon.formatName(translations.language, shiny, "default")),
						},
					],
					fetchReply: true,
				})) as Message;

				await sleep(3_000);

				interaction.editReply({
					embeds: [
						reply.embeds[0]
							.setThumbnail(pokemon.image(shiny, megaEvolution.variationType, megaEvolution.variation))
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
				break;
			}
		}
	},
};

export default command;
