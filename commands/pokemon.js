const { Message } = require("discord.js");

const command = {
	name: "pokemon",
	description: "Obtenir la liste des pokémons que tu as attrapés",
	aliases: ["pokemons", "pkmn", "pkm", "poke"],
	args: 0,
	usage: "[-legendary] [-shiny] [-alolan] [-galarian] [-id [nombre]] [-name <nom>]",
	slashOptions: [
		{
			name: "options",
			description: "Des options de recherche",
			type: 3,
			required: false
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options) => {
		const { MessageEmbed } = require("discord.js");
		const pokedex = require("oakdex-pokedex");
		const pagination = require("../util/pagination.js");

		let { "rows": pokemons }  = await message.client.pg.query(`SELECT * FROM pokemons WHERE user_id = '${message.author.id}' ORDER BY legendary DESC, shiny DESC, caught DESC, pokedex_id ASC`).catch(console.error);
		if (!pokemons) return message.channel.send("Quelque chose s'est mal passé en accédant à la base de données").catch(console.error);

		const params = args
			? args
			: (options ? options[0] : { value: "" }).value.split(" ");

		if (params.includes("-legendary")) pokemons = pokemons.filter(p => p.legendary);
		if (params.includes("-shiny")) pokemons = pokemons.filter(p => p.shiny);
		if (params.includes("-alolan")) pokemons = pokemons.filter(p => p.pokedex_name.includes("dU+0027Alola"));
		if (params.includes("-galarian")) pokemons = pokemons.filter(p => p.pokedex_name.includes("de Galar"));
		if (params.includes("-id")) pokemons = params[params.indexOf("-id") + 1] ? pokemons.filter(p => p.pokedex_id === parseInt(params[params.indexOf("-id") + 1], 10)) : pokemons;
		if (params.includes("-name")) pokemons = pokemons.filter(p => new RegExp(params[params.indexOf("-name") + 1], "i").test(pokedex.findPokemon(p.pokedex_id).names.fr));
		
		const pkmPerPage = 15;
		let pages = [];
		let embed = new MessageEmbed()
			.setAuthor(`Pokémons de ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
			.setColor("#010101")
			.setDescription("*Aucun pokémon ne correspond à la recherche*");
		if (!pokemons.length) pages.push(embed);

		for (i = 0; i < pokemons.length; i += pkmPerPage) {
			embed = new MessageEmbed()
				.setAuthor(`Pokémons de ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
				.setColor("#010101")
				.setDescription(pokemons.slice(i, i + pkmPerPage).map(p => `**${p.shiny ? "⭐ " : ""}${p.legendary ? "🎖️ " : ""}${pokedex.findPokemon(p.pokedex_id).names.fr}**${params.includes("-id") ? `#${p.pokedex_id}` : ""} - ${p.caught} attrapé${p.caught > 1 ? "s" : ""}`).join("\n"));
			pages.push(embed);
		};
		
		try {
			pagination(message, pages);
		} catch (err) {
			console.error(err);
			message.channel.send("Quelque chose s'est mal passé en créant le paginateur :/").catch(console.error);
		}
	}
}

module.exports = command;