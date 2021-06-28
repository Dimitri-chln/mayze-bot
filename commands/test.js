const { Message } = require("discord.js");

const command = {
	name: "test",
	description: "testest",
	aliases: [],
	args: 0,
	usage: "",
	ownerOnly: true,
	/**
	 * 
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		return;
		
		const Fs = require("fs");

		const data = JSON.parse(Fs.readFileSync("backups/database_pokemons.json"));

		const pokemons = [];

		for (const pokemon of data) {
			let pkm = pokemons.find(p => p.pokedex_id === pokemon.pokedex_id && p.shiny === pokemon.shiny && p.alolan === pokemon.alolan);
			
			if (!pkm) {
				pkm = {
					pokedex_id: pokemon.pokedex_id,
					pokedex_name: pokemon.pokedex_name,
					shiny: pokemon.shiny,
					legendary: pokemon.legendary,
					ultra_beast: pokemon.ultra_beast,
					alolan: pokemon.alolan,
					users: {}
				};

				pokemons.push(pkm);
			}
			
			pokemons[pokemons.indexOf(pkm)].users[pokemon.user_id] = {
				caught: pokemon.caught,
				favorite: pokemon.favorite,
				nickname: pokemon.nickname
			};
		}

		console.log(pokemons);

		for (const pokemon of pokemons) {
			message.client.pg.query(
				"INSERT INTO pokemons VALUES ($1, $2, $3, $4, $5, $6, $7)",
				Object.values(pokemon)
			).catch(console.error);
		}
	}
};

module.exports = command;