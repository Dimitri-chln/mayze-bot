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
		const pokedex = require("oakdex-pokedex");
		const download = require("../utils/download");

		let downloaded = 0;

		for (const pokemon of pokedex.allPokemon()) {
			const url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${(`00${pokemon.national_id}`).substr(-3)}.png`;
			await download(url, `assets/pokemons/${pokemon.national_id}.png`);
			downloaded++;
			console.log(`${downloaded}/809 downloaded`);
		}
	}
};

module.exports = command;