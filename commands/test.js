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
	 * @param {string[]} _args 
	 */
	async execute(message, _args) {
		const dex = require("oakdex-pokedex");
		const values = dex.allPokemon().sort((a, b) => a.national_id - b.national_id).map(p => p.catch_rate);
		const catchRates = values.map((v, i, a) => a.slice(0, i).reduce((partialSum, a) => partialSum + a, 0));
		console.log(catchRates.join(", "));
	}
};

module.exports = command;