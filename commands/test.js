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
		const Axios = require("axios").default;

		Axios.get("https://assets.pokemon.com/assets/cms2/img/pokedex/full/752.png")
			.then(res => console.log(res))
			.catch(console.error);
	}
};

module.exports = command;