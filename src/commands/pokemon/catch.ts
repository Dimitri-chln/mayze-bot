import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";

import { TextChannel } from "discord.js";
import Pokedex from "../../types/pokemon/Pokedex";
import CatchRates, { PokemonUpgrades } from "../../types/pokemon/CatchRates";
import PokemonList from "../../types/pokemon/PokemonList";
import { pokeball } from "../../assets/image-urls.json";
import { CATCH_REWARD, SHINY_REWARD_MULTIPLIER, ALOLAN_REWARD_MULTIPLIER } from "../../config.json";
import { VariationType } from "../../utils/pokemon/pokemonInfo";



const command: Command = {
	name: "catch",
	description: {
		fr: "Attrape un pokémon !",
		en: "Catch a pokémon!"
	},
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],

	options: {
		fr: [],
		en: []
	},
	
	run: async (interaction: CommandInteraction, translations: Translations) => {
		const SHINY_FREQUENCY = 0.004, ALOLAN_FREQUENCY = 0.05, MEGA_GEM_FREQUENCY = 0.02;

		const UPGRADES_BENEFITS = {
			catch_cooldown: (tier: number) => 0.5 * tier,
			mega_gem_probability: (tier: number) => 2 * tier,
			shiny_probability: (tier: number) => 2 * tier
		};

		const { rows: caughtPokemonsData } = await Util.database.query(
			"SELECT pokedex_id FROM pokemons WHERE users ? $1 AND variation = 'default'",
			[ interaction.user.id ]
		);

		const pokemonList = new PokemonList(caughtPokemonsData, interaction.user.id);

		const { rows: [ userUpgrades ] } = await Util.database.query(
			"SELECT * FROM upgrades WHERE user_id = $1",
			[ interaction.user.id ]
		);
		
		const upgrades: PokemonUpgrades = userUpgrades
			?? {
				user_id: interaction.user.id,
				catch_cooldown_tier: 0,
				new_pokemon_tier: 0,
				legendary_ultrabeast_tier: 0,
				mega_gem_tier: 0,
				shiny_tier: 0
			};

		const catchRates = new CatchRates(pokemonList, upgrades);
		
		let randomPokemon = catchRates.randomPokemon();

		// Pokémon hunting
		let huntFooterText: string;
		{
			const { rows: [ userHunt ] } = await Util.database.query(
				"SELECT * FROM pokemon_hunting WHERE user_id = $1",
				[ interaction.user.id ]
			);
			
			if (userHunt) {
				const huntedPokemon = Pokedex.findById(userHunt.pokemon_id);

				let probability = ((userHunt.hunt_count + 1) / 100) * (huntedPokemon.catchRate / 255);
				if (probability > 1) probability = 1;
				
				if (Math.random() < probability) {
					await Util.database.query(
						"UPDATE pokemon_hunting SET hunt_count = 0 WHERE user_id = $1",
						[ interaction.user.id ]
					);
					
					randomPokemon = huntedPokemon;
				
				} else {
					huntFooterText = translations.data.hunt_probability(/^[aeiou]/i.test(huntedPokemon.names[translations.language]), huntedPokemon.names[translations.language], Math.round(probability * 100 * 10000 / 10000).toString());
				}
			}
		}

		let megaGem: string;
		{
			// Mega Gems
			if (Math.random() < MEGA_GEM_FREQUENCY * (1 + UPGRADES_BENEFITS.mega_gem_probability(upgrades.mega_gem_tier) / 100)) {
				const megaPokemon = Pokedex.megaEvolvablePokemons[
					Math.floor(Math.random() * Pokedex.megaEvolvablePokemons.length)
				];

				megaGem = megaPokemon.megaEvolutions[
					Math.floor(Math.random() * megaPokemon.megaEvolutions.length)
				].megaStone;

				const defaultData = {};
				defaultData[interaction.user.id] = 1;

				Util.database.query(
					`
					INSERT INTO mega_gems VALUES ($1, $2)
					ON CONFLICT (user_id)
					DO UPDATE SET gems = 
						CASE
							WHEN mega_gems.gems -> $3 IS NULL THEN mega_gems.gems || $2
							ELSE jsonb_set(mega_gems.gems, '{${megaGem}}', ((mega_gems.gems -> $3)::int + 1)::text::jsonb)
						END
					WHERE mega_gems.user_id = EXCLUDED.user_id
					`,
					[ interaction.user.id, defaultData, megaGem ]
				);
			}
		}
		
		const shiny = Math.random() < SHINY_FREQUENCY * (1 + (UPGRADES_BENEFITS.shiny_probability(upgrades.shiny_tier) / 100));
		const variation: VariationType = 
			randomPokemon.variations.some(variation => variation.suffix === "alola") && Math.random() < ALOLAN_FREQUENCY
				? "alola"
				: "default";

		const catchReward = Math.round(CATCH_REWARD * (
			255 / randomPokemon.catchRate
			* (shiny ? SHINY_REWARD_MULTIPLIER : 1)
			* (variation === "alola" ? ALOLAN_REWARD_MULTIPLIER : 1)
		));
		
		const defaultData = {};
		defaultData[interaction.user.id] = {
			caught: 1,
			favorite: false,
			nickname: null
		};
		const defaultUserData = {
			caught: 1,
			favorite: false,
			nickname: null
		};

		const { rows: [ { caught: caughtTotal } ] } = await Util.database.query(
			`
			INSERT INTO pokemons VALUES ($1, $2, $3, $4)
			ON CONFLICT (pokedex_id, shiny, variation)
			DO UPDATE SET users =
				CASE
					WHEN pokemons.users -> $5 IS NULL THEN jsonb_set(pokemons.users, '{${interaction.user.id}}', $6)
					ELSE jsonb_set(pokemons.users, '{${interaction.user.id}, caught}', ((pokemons.users -> $5 -> 'caught')::int + 1)::text::jsonb)
				END
			WHERE pokemons.pokedex_id = EXCLUDED.pokedex_id AND pokemons.shiny = EXCLUDED.shiny AND pokemons.variation = EXCLUDED.variation
			RETURNING (users -> $5 -> 'caught')::int AS caught
			`,
			[
				randomPokemon.nationalId,
				shiny,
				variation,
				defaultData,
				interaction.user.id,
				defaultUserData
			]
		);

		Util.database.query(
			"UPDATE pokemon_hunting SET hunt_count = hunt_count + 1 WHERE user_id = $1",
			[ interaction.user.id ]
		).catch(console.error);

		Util.database.query(
			`
			INSERT INTO currency VALUES ($1, $2)
			ON CONFLICT (user_id)
			DO UPDATE SET money = currency.money + $2
			WHERE currency.user_id = EXCLUDED.user_id
			`,
			[ interaction.user.id, catchReward ]
		).catch(console.error);

		const reply = await interaction.reply({
			embeds: [
				{
					author: {
						name: caughtTotal > 1 ? translations.data.caught() : translations.data.caught_new(),
						iconURL: pokeball
					},
					image: {
						url: randomPokemon.image(shiny, variation)
					},
					color: shiny
						? 0xF3D508
						: randomPokemon.legendary || randomPokemon.ultraBeast 
							? 0xCE2F20
							: interaction.guild.me.displayColor,
					description: translations.data.caught_title(
						interaction.user.toString(),
						!shiny && (variation === "alola" || /^[aeiou]/i.test(randomPokemon.names[translations.language])),
						randomPokemon.formatName(shiny, variation, translations.language),
						catchReward.toString()
					) + (megaGem ? translations.data.mega_gem(megaGem) : ""),
					footer: {
						text: "✨ Mayze ✨" + (huntFooterText || ""),
						iconURL: interaction.user.displayAvatarURL({ dynamic: true })
					}
				}
			],
			fetchReply: true
		});

		if (Util.beta) return;

		const logChannel = interaction.client.channels.cache.get('839538540206882836') as TextChannel;

		logChannel.send({
			embeds: [
				{
					author: {
						name: `#${(interaction.channel as TextChannel).name} (${interaction.guild.name})`,
						url: (reply as Message).url,
						iconURL: interaction.guild.iconURL()
					},
					thumbnail: {
						url: randomPokemon.image(shiny, variation)
					},
					color: shiny
						? 0xF3D508
						: randomPokemon.legendary || randomPokemon.ultraBeast 
							? 0xCE2F20
							: 0x010101,
					description: translations.data.caught_title_en(
						interaction.user.toString(),
						!shiny && (variation === "alola" || /^[aeiou]/i.test(randomPokemon.names.en)),
						randomPokemon.formatName(shiny, variation, "en")
					),
					footer: {
						text: "✨ Mayze ✨",
						iconURL: interaction.user.displayAvatarURL({ dynamic: true })
					}
				}
			]
		});
	}
};



export default command;