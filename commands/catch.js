const { Message } = require("discord.js");

const command = {
	name: "catch",
	description: {
		fr: "Attrape un pokémon !",
		en: "Catch a pokémon !"
	},
	aliases: ["c"],
	cooldown: 1200,
	args: 0,
	usage: "",
	slashOptions: null,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language) => {
		const pokedex = require("oakdex-pokedex");
		const { pokeball } = require("../assets/misc.json");

		const shinyFrequency = 0.004;
		const { catchRates } = message.client;

		const random = Math.random() * (catchRates.slice(-1)[0] + pokedex.findPokemon(catchRates.length).catch_rate);
		const pokemon = findDrop(random);
		
		let img = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${(`00${pokemon.national_id}`).substr(-3)}.png`;

		let randomShiny = Math.random(), shiny = false;
		if (randomShiny < shinyFrequency) {
			shiny = true;
			img = `https://img.pokemondb.net/sprites/home/shiny/${pokemon.names.en.toLowerCase()}.png`;
		}

		const legendaries = require("../assets/legendaries.json");
		const legendary = legendaries.includes(pokemon.names.fr) ? true : false;

		const { rows } = await message.client.pg.query(`SELECT * FROM pokemons WHERE user_id = '${message.author.id}' AND pokedex_name = '${pokemon.names.en.replace(/'/, "U+0027")}' AND shiny = ${shiny}`).catch(console.error);
		if (rows.length) {
			message.client.pg.query(`UPDATE pokemons SET caught = ${rows[0].caught + 1} WHERE user_id = '${message.author.id}' AND pokedex_name = '${pokemon.names.en.replace(/'/, "U+0027")}' AND shiny = ${shiny}`).catch(console.error);
		} else {
			message.client.pg.query(`INSERT INTO pokemons (user_id, pokedex_id, pokedex_name, shiny, legendary) VALUES ('${message.author.id}', ${pokemon.national_id}, '${pokemon.names.en.replace(/'/, "U+0027")}', ${shiny}, ${legendary})`).catch(console.error);
		}

		message.channel.send({
			embed: {
				author: {
					name: rows.length ? language.caught :  language.caught_new,
					icon_url: pokeball
				},
				image: {
					url: img
				},
				color: shiny ? "#ddbb20" : (legendary ? "#ce2f20" : "#010101"),
				description: language.get(language.caught_title, message.author.toString(), (legendary ? "🎖️ " : "") + (shiny ? "⭐ " : "") + (pokemon.names[language] || pokemon.names.en)),
				footer: {
					text: "✨Mayze✨",
					icon_url: message.author.avatarURL({ dynamic: true })
				}
			}
		}).catch(console.error);

		/**
		 * @param {number} random A random number
		 */
		function findDrop(random) {
			for (i = 0; i < catchRates.length; i ++)
				if (random < catchRates[i]) return pokedex.findPokemon(i);
			return pokedex.findPokemon(catchRates.length);
		}
	}
};

module.exports = command;