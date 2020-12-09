const { Message } = require("discord.js");

const command = {
	name: "catch",
	description: "Attrape un pokémon !",
	aliases: ["c"],
	cooldown: 3600,
	args: 0,
	usage: "",
	xp: 100,
	/**
	 * @param {Message} message 
	 * @param {string[]} _args 
	 */
	async execute(message, _args) {
		const pokedex = require("oakdex-pokedex");

		const shinyFrequency = 0.004, alolanFrequency = 0.1, galarianFrequency = 0.1;
		const { catchRates } = message.client;

		const random = Math.random() * (catchRates.slice(-1)[0] + pokedex.findPokemon(catchRates.length).catch_rate);
		const pokemon = findDrop(random);
		
		var img = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${(`00${pokemon.national_id}`).substr(-3)}.png`;

		/*
		var randomAlolan = Math.random(), alolanText = "";
		if (randomAlolan < alolanFrequency && pokemon.alolan) {
			alolanText = " d'Alola";
			img = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemon.alolan}.png`;
		}
		var randomGalarian = Math.random(), galarianText = "";
		if (randomGalarian < galarianFrequency && pokemon.galarian && alolanText === "") {
			galarianText = " de Galar";
			img = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemon.galarian}.png`;
		}
		*/
		var randomShiny = Math.random(), shinyText = "", is_shiny = false, embedColor = "#010101";
		if (randomShiny < shinyFrequency) {
			shinyText = "⭐ ";
			is_shiny = true;
			embedColor = "#ddbb20";
			img = `https://img.pokemondb.net/sprites/home/shiny/${pokemon.names.en.toLowerCase()}.png`;
		}

		const pokemonName = pokemon.names.fr;
		
		try {
			await message.client.pg.query(`INSERT INTO pokemons (caught_by, pokedex_id, pokedex_name, is_shiny) VALUES ('${message.author.id}', ${pokemon.national_id}, '${pokemonName}', ${is_shiny})`);
		} catch (err) {
			console.log(err);
			return message.channel.send("Quelque chose s'est mal passé en joignant la base de données :/").catch(console.error);
		}
		
		var author = "Pokémon capturé!";
		try {
			const { rows } = await message.client.pg.query(`SELECT * FROM pokemons WHERE caught_by='${message.author.id}' AND pokedex_name='${pokemonName}'`);
			if (rows.length === 1) {
				author = "Nouveau pokémon! 🎗️";
			}
		} catch (err) { console.log(err); }

		message.channel.send({
			embed: {
				author: {
					name: author,
					icon_url: "https://i.imgur.com/uJlfMAd.png"
				},
				image: {
					url: img
				},
				color: embedColor,
				description: `${message.author} a attrapé un ${shinyText}${pokemonName} !`,
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
			for (i = 0; i < catchRates.length; i ++) {
				if (random < catchRates[i]) return pokedex.findPokemon(i);
			}
			return pokedex.findPokemon(catchRates.length);
		}
	}
};

module.exports = command;