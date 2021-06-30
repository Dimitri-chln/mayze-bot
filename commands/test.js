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
		return;
		
		const download = require("../utils/download");
		const pokedex = require("oakdex-pokedex");

		const filter = m => m.author.id === message.author.id && /^skip$|^(?:alolan|galarian|mega|gigantamax)\/.*\d+$/.test(m.content);

		for (let i = 10186; i < 10221; i++) {
			const url = `https://assets.poketwo.net/images/${i}.png?v=26`;
			message.channel.send(url);
			await message.channel.awaitMessages(filter, { max: 1 }).then(async collected => {
				const msg = collected.first();
				if (msg.content.toLowerCase() === "skip") return;
				await download(url, `assets/pokemons/${msg.content}.png`);
				await download(url.replace("images", "shiny"), `assets/pokemons/${msg.content.replace(/\/(\d+)/, "/shiny/$1")}.png`)
			});
		}

		// const path = args[0];
		// const url = args[1];
		// await download(url, "assets/pokemons/" + path);
		// message.channel.send("Image downloaded");
	}
};

module.exports = command;