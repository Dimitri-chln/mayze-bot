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
		return message.reply("Maintenance!").catch(console.error);
		
		const pokedex = require("oakdex-pokedex");
		const legendaries = require("../assets/legendaries.json");
		const beasts = require("../assets/ultra-beasts.json");
		const { pokeball } = require("../assets/misc.json");

		const shinyFrequency = 0.004, alolanFrequency = 0.05;
		const { catchRates } = message.client;

		{
			// Don't allow new users to create new entries in the database
			const res = await message.client.pg.query(`SELECT COUNT(id) FROM pokemons WHERE user_id = '${message.author.id}'`).catch(console.error);
			if (!res || res.rows[0].count == "0")
				return message.reply(language.new_user).catch(console.error);
		}

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
		
		let img = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${(`00${pokemon.national_id}`).substr(-3)}.png`;

		let randomShiny = Math.random(), shiny = false;
		if (randomShiny < shinyFrequency) {
			shiny = true;
			img = `https://img.pokemondb.net/sprites/home/shiny/${pokemon.names.en.toLowerCase().replace(/\u2642/, "-m").replace(/\u2640/, "-f")}.png`;
		}
		
		let randomAlolan = Math.random(), alolan = false;
		if (randomAlolan < alolanFrequency && pokemon.variations.some(v => v.condition === "Alola")) {
			alolan = true;
			img = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${(`00${pokemon.national_id}`).substr(-3)}_f2.png`;
		}

		const legendary = legendaries.includes(pokemon.names.en);
		const beast = beasts.includes(pokemon.names.en);

		const { rows } = (await message.client.pg.query(`SELECT * FROM pokemons WHERE user_id = '${message.author.id}' AND pokedex_name = '${pokemon.names.en.replace(/'/g, "''")}' AND shiny = ${shiny} AND alolan = ${alolan}`).catch(console.error)) || {};
		if (!rows) return message.channel.send(language.errors.database).catch(console.error);
		
		if (rows.length) {
			message.client.pg.query(`UPDATE pokemons SET caught = ${rows[0].caught + 1} WHERE user_id = '${message.author.id}' AND pokedex_name = '${pokemon.names.en.replace(/'/g, "''")}' AND shiny = ${shiny} AND alolan = ${alolan}`).catch(console.error);
		} else {
			message.client.pg.query(`INSERT INTO pokemons (user_id, pokedex_id, pokedex_name, shiny, legendary, alolan, ultra_beast) VALUES ('${message.author.id}', ${pokemon.national_id}, '${pokemon.names.en.replace(/'/g, "''")}', ${shiny}, ${legendary}, ${alolan}, ${beast})`).catch(console.error);
		}

		message.client.pg.query(`UPDATE pokemon_hunting SET hunt_count = hunt_count + 1 WHERE user_id = '${message.author.id}'`).catch(console.error);

		const msg = await message.channel.send({
			embed: {
				author: {
					name: rows.length ? language.caught : language.caught_new,
					icon_url: pokeball
				},
				image: {
					url: img
				},
				color: shiny ? 14531360 : (legendary || beast ? 13512480 : message.guild.me.displayColor),
				description: language.get(language.caught_title, message.author.toString(), (legendary ? "🎖️ " : "") + (beast ? "🎗️ " : "") + (shiny ? "⭐ " : "") + (alolan ? "Alolan " : "") + (pokemon.names[languageCode] || pokemon.names.en), !shiny && (alolan || /^[aeiou]/i.test(pokemon.names[languageCode] || pokemon.names.en))),
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
					url: img
				},
				color: shiny ? 14531360 : (legendary || beast ? 13512480 : "#010101"),
				description: language.get(language.caught_title_en, message.author.toString(), (legendary ? "🎖️ " : "") + (beast ? "🎗️ " : "") + (shiny ? "⭐ " : "") + (alolan ? "Alolan " : "") + pokemon.names.en, !shiny && (alolan || /^[aeiou]/i.test(pokemon.names[languageCode] || pokemon.names.en))),
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