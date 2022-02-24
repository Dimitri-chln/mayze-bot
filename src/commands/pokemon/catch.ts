import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import { TextChannel } from "discord.js";
import CatchRates from "../../types/pokemon/CatchRates";
import PokemonList from "../../types/pokemon/PokemonList";
import { pokeball } from "../../assets/image-urls.json";
import { VariationType } from "../../utils/pokemon/pokemonInfo";
import {
	DatabasePokemon,
	DatabaseUpgrades,
} from "../../types/structures/Database";

const command: Command = {
	name: "catch",
	aliases: ["c"],
	description: {
		fr: "Attrape un pokémon !",
		en: "Catch a pokémon!",
	},
	usage: "",
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],
	cooldown: 1_200,

	options: {
		fr: [],
		en: [],
	},

	runInteraction: async (interaction, translations) => {
		const SHINY_FREQUENCY = 0.004,
			ALOLAN_FREQUENCY = 0.05,
			MEGA_GEM_FREQUENCY = 0.02;

		const UPGRADES_BENEFITS = {
			catch_cooldown: (tier: number) => 0.5 * tier,
			mega_gem_probability: (tier: number) => 2 * tier,
			shiny_probability: (tier: number) => 2 * tier,
		};

		const { rows: caughtPokemonsData }: { rows: DatabasePokemon[] } =
			await Util.database.query(
				"SELECT * FROM pokemon WHERE users ? $1 AND variation = 'default'",
				[interaction.user.id],
			);

		const pokemonList = new PokemonList(
			caughtPokemonsData,
			interaction.user.id,
		);

		const {
			rows: [userUpgrades],
		}: { rows: DatabaseUpgrades[] } = await Util.database.query(
			"SELECT * FROM upgrades WHERE user_id = $1",
			[interaction.user.id],
		);

		const upgrades = userUpgrades ?? {
			user_id: interaction.user.id,
			catch_cooldown_reduction: 0,
			new_pokemon_probability: 0,
			legendary_ub_probability: 0,
			mega_gem_probability: 0,
			shiny_probability: 0,
		};

		const catchRates = new CatchRates(pokemonList, upgrades);

		let randomPokemon = catchRates.randomPokemon();

		// Pokémon hunting
		let huntFooterText: string;
		{
			const {
				rows: [userHunt],
			} = await Util.database.query(
				"SELECT * FROM pokemon_hunting WHERE user_id = $1",
				[interaction.user.id],
			);

			if (userHunt) {
				const huntedPokemon = Util.pokedex.findById(userHunt.pokemon_id);

				let probability = Math.min(
					((userHunt.hunt_count + 1) / 100) * (huntedPokemon.catchRate / 255),
					1,
				);

				if (Math.random() < probability) {
					await Util.database.query(
						"UPDATE pokemon_hunting SET hunt_count = 0 WHERE user_id = $1",
						[interaction.user.id],
					);

					randomPokemon = huntedPokemon;
				} else {
					huntFooterText = translations.strings.hunt_probability(
						/^[aeiou]/i.test(huntedPokemon.names[translations.language]),
						huntedPokemon.names[translations.language],
						(Math.round(probability * 100 * 10000) / 10000).toString(),
					);
				}
			}
		}

		let megaGem: string;
		{
			// Mega Gems
			if (
				Math.random() <
				MEGA_GEM_FREQUENCY *
					(1 +
						UPGRADES_BENEFITS.mega_gem_probability(
							upgrades.mega_gem_probability,
						) /
							100)
			) {
				const megaPokemon = Util.pokedex.megaEvolvablePokemons.random();

				megaGem =
					megaPokemon.megaEvolutions[
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
					[interaction.user.id, defaultData, megaGem],
				);
			}
		}

		const shiny =
			Math.random() <
			SHINY_FREQUENCY *
				(1 +
					UPGRADES_BENEFITS.shiny_probability(upgrades.shiny_probability) /
						100);

		const variation: VariationType =
			Util.pokedex.alolaPokemons.has(randomPokemon.nationalId) &&
			Math.random() < ALOLAN_FREQUENCY
				? "alola"
				: "default";

		const catchReward = Math.round(
			Util.config.CATCH_REWARD *
				((255 / randomPokemon.catchRate) *
					(shiny ? Util.config.SHINY_REWARD_MULTIPLIER : 1) *
					(variation === "alola" ? Util.config.ALOLAN_REWARD_MULTIPLIER : 1)),
		);

		const defaultUserData = {
			caught: 1,
			favorite: false,
			nickname: null,
		};
		const defaultData = {};
		defaultData[interaction.user.id] = defaultUserData;

		const {
			rows: [{ caught: caughtTotal }],
		} = await Util.database.query(
			`
			INSERT INTO pokemon VALUES ($1, $2, $3, $4)
			ON CONFLICT (pokedex_id, shiny, variation)
			DO UPDATE SET users =
				CASE
					WHEN pokemon.users -> $5 IS NULL THEN jsonb_set(pokemon.users, '{${interaction.user.id}}', $6)
					ELSE jsonb_set(pokemon.users, '{${interaction.user.id}, caught}', ((pokemon.users -> $5 -> 'caught')::int + 1)::text::jsonb)
				END
			WHERE pokemon.pokedex_id = EXCLUDED.pokedex_id AND pokemon.shiny = EXCLUDED.shiny AND pokemon.variation = EXCLUDED.variation
			RETURNING (users -> $5 -> 'caught')::int AS caught
			`,
			[
				randomPokemon.nationalId,
				shiny,
				variation,
				defaultData,
				interaction.user.id,
				defaultUserData,
			],
		);

		Util.database
			.query(
				"UPDATE pokemon_hunting SET hunt_count = hunt_count + 1 WHERE user_id = $1",
				[interaction.user.id],
			)
			.catch(console.error);

		Util.database
			.query(
				`
			INSERT INTO currency VALUES ($1, $2)
			ON CONFLICT (user_id)
			DO UPDATE SET money = currency.money + $2
			WHERE currency.user_id = EXCLUDED.user_id
			`,
				[interaction.user.id, catchReward],
			)
			.catch(console.error);

		const reply = (await interaction.followUp({
			embeds: [
				{
					author: {
						name:
							caughtTotal > 1
								? translations.strings.caught()
								: translations.strings.caught_new(),
						iconURL: pokeball,
					},
					image: {
						url: randomPokemon.image(shiny, variation),
					},
					color: shiny
						? 0xf3d508
						: randomPokemon.legendary || randomPokemon.ultraBeast
						? 0xce2f20
						: interaction.guild.me.displayColor,
					description:
						translations.strings.caught_title(
							interaction.user.toString(),
							!shiny &&
								(variation === "alola" ||
									/^[aeiou]/i.test(randomPokemon.names[translations.language])),
							randomPokemon.formatName(translations.language, shiny, variation),
							catchReward.toString(),
						) + (megaGem ? translations.strings.mega_gem(megaGem) : ""),
					footer: {
						text: "✨ Mayze ✨" + (huntFooterText || ""),
						iconURL: interaction.user.displayAvatarURL({
							dynamic: true,
						}),
					},
				},
			],
			fetchReply: true,
		})) as Message;

		if (Util.beta) return;

		const logChannel = interaction.client.channels.cache.get(
			"839538540206882836",
		) as TextChannel;

		logChannel.send({
			embeds: [
				{
					author: {
						name: `#${(interaction.channel as TextChannel).name} (${
							interaction.guild.name
						})`,
						url: reply.url,
						iconURL: interaction.guild.iconURL(),
					},
					thumbnail: {
						url: randomPokemon.image(shiny, variation),
					},
					color: shiny
						? 0xf3d508
						: randomPokemon.legendary || randomPokemon.ultraBeast
						? 0xce2f20
						: Util.config.MAIN_COLOR,
					description: translations.strings.caught_title_en(
						interaction.user.toString(),
						!shiny &&
							(variation === "alola" ||
								/^[aeiou]/i.test(randomPokemon.names.en)),
						randomPokemon.formatName("en", shiny, variation),
					),
					footer: {
						text: "✨ Mayze ✨",
						iconURL: interaction.user.displayAvatarURL({
							dynamic: true,
						}),
					},
				},
			],
		});
	},

	runMessage: async (message, args, translations) => {
		const SHINY_FREQUENCY = 0.004,
			ALOLAN_FREQUENCY = 0.05,
			MEGA_GEM_FREQUENCY = 0.02;

		const UPGRADES_BENEFITS = {
			catch_cooldown: (tier: number) => 0.5 * tier,
			mega_gem_probability: (tier: number) => 2 * tier,
			shiny_probability: (tier: number) => 2 * tier,
		};

		const { rows: caughtPokemonsData }: { rows: DatabasePokemon[] } =
			await Util.database.query(
				"SELECT * FROM pokemon WHERE users ? $1 AND variation = 'default'",
				[message.author.id],
			);

		const pokemonList = new PokemonList(caughtPokemonsData, message.author.id);

		const {
			rows: [userUpgrades],
		}: { rows: DatabaseUpgrades[] } = await Util.database.query(
			"SELECT * FROM upgrades WHERE user_id = $1",
			[message.author.id],
		);

		const upgrades = userUpgrades ?? {
			user_id: message.author.id,
			catch_cooldown_reduction: 0,
			new_pokemon_probability: 0,
			legendary_ub_probability: 0,
			mega_gem_probability: 0,
			shiny_probability: 0,
		};

		const catchRates = new CatchRates(pokemonList, upgrades);

		let randomPokemon = catchRates.randomPokemon();

		// Pokémon hunting
		let huntFooterText: string;
		{
			const {
				rows: [userHunt],
			} = await Util.database.query(
				"SELECT * FROM pokemon_hunting WHERE user_id = $1",
				[message.author.id],
			);

			if (userHunt) {
				const huntedPokemon = Util.pokedex.findById(userHunt.pokemon_id);

				let probability = Math.min(
					((userHunt.hunt_count + 1) / 100) * (huntedPokemon.catchRate / 255),
					1,
				);

				if (Math.random() < probability) {
					await Util.database.query(
						"UPDATE pokemon_hunting SET hunt_count = 0 WHERE user_id = $1",
						[message.author.id],
					);

					randomPokemon = huntedPokemon;
				} else {
					huntFooterText = translations.strings.hunt_probability(
						/^[aeiou]/i.test(huntedPokemon.names[translations.language]),
						huntedPokemon.names[translations.language],
						(Math.round(probability * 100 * 10000) / 10000).toString(),
					);
				}
			}
		}

		let megaGem: string;
		{
			// Mega Gems
			if (
				Math.random() <
				MEGA_GEM_FREQUENCY *
					(1 +
						UPGRADES_BENEFITS.mega_gem_probability(
							upgrades.mega_gem_probability,
						) /
							100)
			) {
				const megaPokemon = Util.pokedex.megaEvolvablePokemons.random();

				megaGem =
					megaPokemon.megaEvolutions[
						Math.floor(Math.random() * megaPokemon.megaEvolutions.length)
					].megaStone;

				const defaultData = {};
				defaultData[message.author.id] = 1;

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
					[message.author.id, defaultData, megaGem],
				);
			}
		}

		const shiny =
			Math.random() <
			SHINY_FREQUENCY *
				(1 +
					UPGRADES_BENEFITS.shiny_probability(upgrades.shiny_probability) /
						100);

		const variation: VariationType =
			Util.pokedex.alolaPokemons.has(randomPokemon.nationalId) &&
			Math.random() < ALOLAN_FREQUENCY
				? "alola"
				: "default";

		const catchReward = Math.round(
			Util.config.CATCH_REWARD *
				((255 / randomPokemon.catchRate) *
					(shiny ? Util.config.SHINY_REWARD_MULTIPLIER : 1) *
					(variation === "alola" ? Util.config.ALOLAN_REWARD_MULTIPLIER : 1)),
		);

		const defaultUserData = {
			caught: 1,
			favorite: false,
			nickname: null,
		};
		const defaultData = {};
		defaultData[message.author.id] = defaultUserData;

		const {
			rows: [{ caught: caughtTotal }],
		} = await Util.database.query(
			`
			INSERT INTO pokemon VALUES ($1, $2, $3, $4)
			ON CONFLICT (pokedex_id, shiny, variation)
			DO UPDATE SET users =
				CASE
					WHEN pokemon.users -> $5 IS NULL THEN jsonb_set(pokemon.users, '{${message.author.id}}', $6)
					ELSE jsonb_set(pokemon.users, '{${message.author.id}, caught}', ((pokemon.users -> $5 -> 'caught')::int + 1)::text::jsonb)
				END
			WHERE pokemon.pokedex_id = EXCLUDED.pokedex_id AND pokemon.shiny = EXCLUDED.shiny AND pokemon.variation = EXCLUDED.variation
			RETURNING (users -> $5 -> 'caught')::int AS caught
			`,
			[
				randomPokemon.nationalId,
				shiny,
				variation,
				defaultData,
				message.author.id,
				defaultUserData,
			],
		);

		Util.database
			.query(
				"UPDATE pokemon_hunting SET hunt_count = hunt_count + 1 WHERE user_id = $1",
				[message.author.id],
			)
			.catch(console.error);

		Util.database
			.query(
				`
			INSERT INTO currency VALUES ($1, $2)
			ON CONFLICT (user_id)
			DO UPDATE SET money = currency.money + $2
			WHERE currency.user_id = EXCLUDED.user_id
			`,
				[message.author.id, catchReward],
			)
			.catch(console.error);

		const reply = await message.reply({
			embeds: [
				{
					author: {
						name:
							caughtTotal > 1
								? translations.strings.caught()
								: translations.strings.caught_new(),
						iconURL: pokeball,
					},
					image: {
						url: randomPokemon.image(shiny, variation),
					},
					color: shiny
						? 0xf3d508
						: randomPokemon.legendary || randomPokemon.ultraBeast
						? 0xce2f20
						: message.guild.me.displayColor,
					description:
						translations.strings.caught_title(
							message.author.toString(),
							!shiny &&
								(variation === "alola" ||
									/^[aeiou]/i.test(randomPokemon.names[translations.language])),
							randomPokemon.formatName(translations.language, shiny, variation),
							catchReward.toString(),
						) + (megaGem ? translations.strings.mega_gem(megaGem) : ""),
					footer: {
						text: "✨ Mayze ✨" + (huntFooterText || ""),
						iconURL: message.author.displayAvatarURL({
							dynamic: true,
						}),
					},
				},
			],
		});

		if (Util.beta) return;

		const logChannel = message.client.channels.cache.get(
			"839538540206882836",
		) as TextChannel;

		logChannel.send({
			embeds: [
				{
					author: {
						name: `#${(message.channel as TextChannel).name} (${
							message.guild.name
						})`,
						url: reply.url,
						iconURL: message.guild.iconURL(),
					},
					thumbnail: {
						url: randomPokemon.image(shiny, variation),
					},
					color: shiny
						? 0xf3d508
						: randomPokemon.legendary || randomPokemon.ultraBeast
						? 0xce2f20
						: Util.config.MAIN_COLOR,
					description: translations.strings.caught_title_en(
						message.author.toString(),
						!shiny &&
							(variation === "alola" ||
								/^[aeiou]/i.test(randomPokemon.names.en)),
						randomPokemon.formatName("en", shiny, variation),
					),
					footer: {
						text: "✨ Mayze ✨",
						iconURL: message.author.displayAvatarURL({
							dynamic: true,
						}),
					},
				},
			],
		});
	},
};

export default command;
