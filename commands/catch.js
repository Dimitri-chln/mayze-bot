const { Message } = require("discord.js");

const command = {
	name: "catch",
	description: {
		fr: "Attrape un pokémon !",
		en: "Catch a pokémon!"
	},
	aliases: ["c"],
	cooldown: 1200,
	args: 0,
	usage: "",
	botPerms: ["EMBED_LINKS"],
	category: "pokémon",
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		const pokedex = require("oakdex-pokedex");
		const legendaries = require("../assets/legendaries.json");
		const beasts = require("../assets/ultra-beasts.json");
		const alolans = require("../assets/alolans.json");
		const megas = require("../assets/mega.json");
		const { getPokemonImage, getPokemonName } = require("../utils/pokemonInfo");
		const { pokeball } = require("../assets/misc.json");

		const shinyFrequency = 0.004, alolanFrequency = 0.05, megaGemFrequency = 0.02;
		const { catchRates } = message.client;

		const random = Math.random() * catchRates.slice(-1)[0];
		let pokemon = findDrop(random);

		let huntFooterText;
		{
			// Pokémon hunting
			const { rows } = (await message.client.pg.query(`SELECT * FROM pokemon_hunting WHERE user_id = '${message.author.id}'`).catch(console.error)) || {};
			if (!rows) return message.channel.send(language.errors.database).catch(console.error);

			if (rows.length) {
				const huntedPokemon = pokedex.findPokemon(rows[0].pokemon_id) || pokedex.findPokemon("Snover");

				let probability = (
                    (rows[0].hunt_count + 1)
                    / 100
                ) * (
                    (legendaries.includes(huntedPokemon.names.en) || beasts.includes(huntedPokemon.names.en)
                        ? 3
                        : huntedPokemon.catch_rate
                    ) / 255
                );
				if (probability > 1) probability = 1;
				
				let r = Math.random();
				if (r < probability) {
					await message.client.pg.query(`UPDATE pokemon_hunting SET hunt_count = 0 WHERE user_id = '${message.author.id}'`);
					pokemon = huntedPokemon;
				} else {
					huntFooterText = language.get(language.hunt_probability, /^[aeiou]/i.test(huntedPokemon.names[languageCode] || huntedPokemon.names.en), huntedPokemon.names[languageCode] || huntedPokemon.names.en, Math.round(probability * 100 * 10000) / 10000);
				}
			}
		}

		let megaGem;
		{
			// Mega Gems
			if (Math.random() < megaGemFrequency) {
				const megaGemPokemon = Object.values(megas)[Math.floor(Math.random() * Object.values(megas).length)];
				megaGem = 
					megaGemPokemon.types?.mega ||
					megaGemPokemon.types?.megax ||
					megaGemPokemon.types?.megay ||
					megaGemPokemon.types?.primal ||
					megaGemPokemon.types?.other;

				const defaultData = {};
				defaultData[megaGem.en] = 1;

				message.client.pg.query(
					`
					INSERT INTO mega_gems VALUES ($1, $2)
					ON CONFLICT (user_id)
					DO UPDATE SET gems = 
						CASE
							WHEN mega_gems.gems -> $3 IS NULL THEN mega_gems.gems || $2
							ELSE jsonb_set(mega_gems.gems, '{${megaGem.en}}', ((mega_gems.gems -> $3)::int + 1)::text::jsonb)
						END
					WHERE mega_gems.user_id = EXCLUDED.user_id
					`,
					[ message.author.id, defaultData, megaGem.en ]
				).catch(console.error);
			}
		}
		
		const shiny = Math.random() < shinyFrequency;
		const legendary = legendaries.includes(pokemon.names.en);
		const beast = beasts.includes(pokemon.names.en);
		const variation = alolans.includes(pokemon.names.en) && Math.random() < alolanFrequency ? "alolan" : "default";
		
		const defaultData = {};
		defaultData[message.author.id] = { caught: 1, favorite: false, nickname: null };
		const defaultUserData = { caught: 1, favorite: false, nickname: null };

		const res = await message.client.pg.query(
			`
			INSERT INTO pokemons VALUES ($1, $2, $3, $4, $5, $6, $7)
			ON CONFLICT (pokedex_id, shiny, variation)
			DO UPDATE SET users =
				CASE
					WHEN pokemons.users -> $8 IS NULL THEN jsonb_set(pokemons.users, '{${message.author.id}}', $9)
					ELSE jsonb_set(pokemons.users, '{${message.author.id}, caught}', ((pokemons.users -> $8 -> 'caught')::int + 1)::text::jsonb)
				END
			WHERE pokemons.pokedex_id = EXCLUDED.pokedex_id AND pokemons.shiny = EXCLUDED.shiny AND pokemons.variation = EXCLUDED.variation
			RETURNING (users -> $8 -> 'caught')::int AS caught
			`,
			[
				pokemon.national_id,
				pokemon.names.en,
				shiny,
				legendary,
				beast,
				variation,
				defaultData,
				message.author.id,
				defaultUserData
			]
		).catch(console.error);

		message.client.pg.query(`UPDATE pokemon_hunting SET hunt_count = hunt_count + 1 WHERE user_id = '${message.author.id}'`).catch(console.error);

		const msg = await message.channel.send({
			embed: {
				author: {
					name: res && res.rows[0].caught > 1 ? language.caught : language.caught_new,
					icon_url: pokeball
				},
				image: {
					url: getPokemonImage(pokemon, shiny, variation)
				},
				color: shiny
					? 15979784
					: legendary || beast 
						? 13512480
						: message.guild.me.displayColor,
				description: language.get(language.caught_title, message.author.toString(), !shiny && (variation === "alolan" || /^[aeiou]/i.test(pokemon.names[languageCode] || pokemon.names.en)), getPokemonName(pokemon, shiny, variation, languageCode))
					+ (megaGem ? language.get(language.mega_gem, megaGem[languageCode]) : ""),
				footer: {
					text: "✨ Mayze ✨" + (huntFooterText || ""),
					icon_url: message.author.avatarURL({ dynamic: true })
				}
			}
		}).catch(console.error);

		const logChannel = message.client.channels.cache.get('839538540206882836');
		logChannel.send({
			embed: {
				author: {
					name: `#${message.channel.name} (${message.guild.name})`,
					url: msg.url,
					icon_url: message.guild.iconURL()
				},
				thumbnail: {
					url: getPokemonImage(pokemon, shiny, variation)
				},
				color: shiny
					? 15979784
					: legendary || beast 
						? 13512480
						: "#010101",
				description: language.get(language.caught_title, message.author.toString(), !shiny && (variation === "alolan" || /^[aeiou]/i.test(pokemon.names.en)), getPokemonName(pokemon, shiny, variation, languageCode)),
				footer: {
					text: "✨ Mayze ✨",
					icon_url: message.author.avatarURL({ dynamic: true })
				}
			}
		}).catch(console.error);

		function findDrop(random) {
			for (let i = 0; i < catchRates.length; i++)
				if (random < catchRates[i]) return pokedex.findPokemon(i + 1) || pokedex.findPokemon("Snover");
		}
	}
};

module.exports = command;