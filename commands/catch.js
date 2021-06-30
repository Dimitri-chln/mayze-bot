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
		const getPokemonImage = require("../utils/pokemonImage");
		const { pokeball } = require("../assets/misc.json");

		const shinyFrequency = 0.004, alolanFrequency = 0.05;
		const { catchRates } = message.client;

		const random = Math.random() * catchRates.slice(-1)[0];
		let pokemon = findDrop(random);

		let huntFooterText;
		{
			// Pokémon hunting
			const { HUNT_TO_DOUBLE_CHANCE } = require("../config.json");

			const { rows } = (await message.client.pg.query(`SELECT * FROM pokemon_hunting WHERE user_id = '${message.author.id}'`).catch(console.error)) || {};
			if (!rows) return message.channel.send(language.errors.database).catch(console.error);

			if (rows.length) {
				const huntedPokemon = pokedex.findPokemon(rows[0].pokemon_id);
				const probability = (
					(rows[0].hunt_count + 1) // Count the newly caught pokémon in the probability
					/ HUNT_TO_DOUBLE_CHANCE
				) * (
					(legendaries.includes(huntedPokemon.names.en) || beasts.includes(huntedPokemon.names.en)
						? 3
						: huntedPokemon.catch_rate
					) / catchRates.slice(-1)[0]
				);

				if (Math.random() * catchRates.slice(-1)[0] < probability) {
					await message.client.pg.query(`UPDATE pokemon_hunting SET hunt_count = 0 WHERE user_id = '${message.author.id}'`);
					pokemon = huntedPokemon;
				
				} else {
					huntFooterText = language.get(language.hunt_probability, huntedPokemon.names[languageCode] || huntedPokemon.names.en, Math.round(probability * 100 * 10000) / 10000);
				}
			}
		}
		
		const shiny = Math.random() < shinyFrequency;
		const legendary = legendaries.includes(pokemon.names.en);
		const beast = beasts.includes(pokemon.names.en);
		const variation = alolans.includes(pokemon.names.en) && Math.random() < alolanFrequency
			? "alolan"
			: null;
		
		const defaultData = {};
		defaultData[message.author.id] = { caught: 1, favorite: false, nickname: null };
		const defaultUserData = { caught: 1, favorite: false, nickname: null };

		const res = await message.client.pg.query(
			`
			INSERT INTO pokemons VALUES ($1, $2, $3, $4, $5, $6, $7)
			ON CONFLICT (pokedex_id, shiny, alolan)
			DO UPDATE SET users =
				CASE
					WHEN pokemons.users -> $8 IS NULL THEN jsonb_set(pokemons.users, '{${message.author.id}}', $9)
					ELSE jsonb_set(pokemons.users, '{${message.author.id}, caught}', ((pokemons.users -> $8 -> 'caught')::int + 1)::text::jsonb)
				END
			WHERE pokemons.pokedex_id = EXCLUDED.pokedex_id AND pokemons.shiny = EXCLUDED.shiny AND pokemons.alolan = EXCLUDED.alolan
			RETURNING (users -> $8 -> 'caught')::int AS caught
			`,
			[
				pokemon.national_id,
				pokemon.names.en,
				shiny,
				legendary,
				beast,
				variation === "alolan",
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
				description: language.get(language.caught_title, message.author.toString(), (legendary ? "🎖️ " : "") + (beast ? "🎗️ " : "") + (shiny ? "⭐ " : "") + (variation ? variation.replace(/^./, a => a.toUpperCase()) + " " : "") + (pokemon.names[languageCode] || pokemon.names.en), !shiny && (variation === "alolan" || /^[aeiou]/i.test(pokemon.names[languageCode] || pokemon.names.en))),
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
					name: `#${message.channel.name}`,
					url: msg.url,
					icon_url: message.guild.iconURL()
				},
				thumbnail: {
					url: getPokemonImage(pokemon, shiny, variation)
				},
				color: shiny ? 14531360 : (legendary || beast ? 13512480 : "#010101"),
				description: language.get(language.caught_title_en, message.author.toString(), (legendary ? "🎖️ " : "") + (beast ? "🎗️ " : "") + (shiny ? "⭐ " : "") + (variation ? variation.replace(/^./, a => a.toUpperCase()) + " " : "") + pokemon.names.en, !shiny && (variation === "alolan" || /^[aeiou]/i.test(pokemon.names[languageCode] || pokemon.names.en))),
				footer: {
					text: "✨ Mayze ✨",
					icon_url: message.author.avatarURL({ dynamic: true })
				}
			}
		}).catch(console.error);

		function findDrop(random) {
			for (let i = 0; i < catchRates.length; i++)
				if (random < catchRates[i]) return pokedex.findPokemon(i + 1);
		}
	}
};

module.exports = command;