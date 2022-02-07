import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";

import Pokedex from "../../types/pokemon/Pokedex";
import { CollectorFilter, MessageReaction, User } from "discord.js";



const command: Command = {
	name: "hunt",
	description: {
		fr: "Chasse un pokémon en particulier",
		en: "Hunt a specific pokémon"
	},
	
	userPermissions: [],
	botPermissions: ["ADD_REACTIONS"],

	options: {
		fr: [
			{
				name: "pokemon",
				description: "Le pokémon à chasser (\"none\" pour réinitialiser)",
				type: "STRING",
				required: false
			}
		],
		en: [
			{
				name: "pokemon",
				description: "The pokémon to hunt (\"none\" to reset)",
				type: "STRING",
				required: false
			}
		]
	},
	
	run: async (interaction, translations) => {
		const input = interaction.options.getString("pokemon");
		
		if (!input) {
			const { rows: [ huntedPokemonData ] } = await Util.database.query(
				"SELECT * FROM pokemon_hunting WHERE user_id = $1",
				[ interaction.user.id ]
			);
			
			if (huntedPokemonData) {
				const huntedPokemon = Pokedex.findById(huntedPokemonData.pokemon_id);
				
				const probability = huntedPokemonData.hunt_count < 100
					? (huntedPokemonData.hunt_count / 100) * (huntedPokemon.catchRate / 255)
					: 1;
	
				interaction.reply({
					content: translations.data.hunt_info(
						huntedPokemon.names[translations.language] ?? huntedPokemon.names.en,
						(Math.round(probability * 100 * 10_000) / 10_000).toString()
					),
					ephemeral: true
				});
			
			} else {
				interaction.reply({
					content: translations.data.not_hunting(),
					ephemeral: true
				});
			}

			return;
		}
		
		if (input === "none") {
			Util.database.query(
				"DELETE FROM pokemon_hunting WHERE user_id = $1",
				[ interaction.user.id ]
			)
				.then(() => {
					interaction.reply({
						content: translations.data.deleted(),
						ephemeral: true
					});
				});
			
			return;
		}
				
		const pokemon = Pokedex.findByName(input);
		if (!pokemon) return interaction.reply({
			content: translations.data.invalid_pokemon(),
			ephemeral: true
		});

		const msg = await interaction.reply({
			content: translations.data.confirmation(
				pokemon.names[translations.language] ?? pokemon.names.en
			),
			ephemeral: true,
			fetchReply: true
		}) as Message;
		
		await msg.react("✅").catch(console.error);
		await msg.react("❌").catch(console.error);

		const filter: CollectorFilter<[MessageReaction, User]> = (reaction, user) => user.id === interaction.user.id && ["✅", "❌"].includes(reaction.emoji.name);
		const collected = await msg.awaitReactions({ filter, max: 1, time: 30000 });
		
		msg.reactions.removeAll().catch(console.error);

		if (!collected.size) return;
		if (collected.first().emoji.name === "✅") {
			await Util.database.query(
				`
				INSERT INTO pokemon_hunting VALUES ($1, $2)
				ON CONFLICT (user_id)
				DO UPDATE SET pokemon_id = EXCLUDED.pokemon_id, hunt_count = 0
				WHERE pokemon_hunting.user_id = EXCLUDED.user_id
				`,
				[ interaction.user.id, pokemon.nationalId ]
			);
			
			interaction.reply({
				content: translations.data.hunting(
					pokemon.names[translations.language] ?? pokemon.names.en
				),
				ephemeral: true
			});

		} else {
			interaction.reply({
				content: translations.data.cancelled(),
				ephemeral: true
			});
		}
	}
};



export default command;