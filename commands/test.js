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
		console.log(JSON.parse('{"type":4,"data":{"embeds":[{"author":{"name":"Pokémon capturé !","icon_url":"https://i.imgur.com/Asfk9R0.png"},"image":{"url":"https://assets.pokemon.com/assets/cms2/img/pokedex/full/399.png"},"color":"#242425","description":"<@307815349699608577> a attrapé un Keunottor !","footer":{"text":"✨ Mayze ✨","icon_url":"https://cdn.discordapp.com/avatars/307815349699608577/a_1443bae4b109fca66d0fc0e084c3a028.gif"}}]}}'));
	}
};

module.exports = command;