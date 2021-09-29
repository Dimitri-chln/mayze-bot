const { Message } = require("discord.js");

const command = {
	name: "test",
	description: "testest",
	aliases: [],
	args: 0,
	usage: "",
	ownerOnly: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		const pokedex = require("oakdex-pokedex");
		const { CATCH_REWARD, SHINY_MULTIPLIER, ALOLAN_MULTIPLIER } = require("../config.json");

		const { "rows": pokemons }  = (await message.client.pg.query(
			"SELECT * FROM pokemons WHERE users ? $1 ORDER BY legendary DESC, ultra_beast DESC, shiny DESC, (users -> $1 -> 'caught')::int DESC, pokedex_id ASC",
			[ message.author.id ]
		).catch(console.error)) || {};
		if (!pokemons) return message.channel.send(language.errors.database).catch(console.error);

		let money = 0;

		for (const pokemon of pokemons) {
			money += Math.round(CATCH_REWARD * (
				255 / (
					pokemon.legendary || pokemon.ultra_beast ? 3 : (pokedex.findPokemon(pokemon.pokedex_id) ?? pokedex.findPokemon("Snover")).catch_rate
				) * (pokemon.shiny ? SHINY_MULTIPLIER : 1) * (pokemon.variation === "alolan" ? ALOLAN_MULTIPLIER : 1)
			));
		}

		message.channel.send(`**✨${money}**`).catch(console.error);
	}
};

module.exports = command;