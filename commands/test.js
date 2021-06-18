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
		const pokemon = pokedex.findPokemon(args.join(" ").toLowerCase().replace(/^./, a => a.toUpperCase()));

		let currentEvolution = pokemon;
		while (currentEvolution.evolution_from) currentEvolution = pokedex.findPokemon(currentEvolution.evolution_from);

		message.channel.send(JSON.stringify(getEvolutions(currentEvolution), null, 2));

		// const data = [
		// 	[ currentEvolution ]
		// ];
		// let evolutionDegree = 1;

		// for (let i = 0; i < currentEvolution.evolutions.length; i++) {
		// 	const evolution = currentEvolution.evolutions[i];
		// 	if (!data[evolutionDegree]) data[evolutionDegree] = [];
		// 	data[evolutionDegree][i] = evolution;
		// }


		function getEvolutions(pokemon) {
			if (!pokemon.evolutions.length) return null;

			const evolutionData = [
				[]
			];
			for (const evolution of pokemon.evolutions) {
				evolutionData[0].push(getEvolutions(pokedex.findPokemon(evolution.to)));
			}
			
			return evolutionData;
		}
	}
};

module.exports = command;