const { Message } = require("discord.js");

const command = {
	name: "pokemon",
	description: "Regarde la liste des pokémons que tu as attrapés",
	aliases: ["pokemons", "pkmn", "pkm", "poke"],
	args: 0,
	usage: "[-legendary] [-shiny] [-alolan] [-galarian]",
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 */
	async execute(message, args) {
		const { MessageEmbed } = require("discord.js");
		const pokedex = require("oakdex-pokedex");
		const pagination = require("../modules/pagination.js");

		const { "rows": pokemons }  = await message.client.pg.query(`SELECT * FROM pokemons WHERE user_id = '${message.author.id}' ORDER BY caught DESC`).catch(console.error);
		if (!pokemons) return message.channel.send("Quelque chose s'est mal passé en accédant à la base de données").catch(console.error);

		if (args.includes("-legendary")) pokemons = pokemons.filter(p => p.legendary);
		if (args.includes("-shiny")) pokemons = pokemons.filter(p => p.shiny);
		if (args.includes("-alolan")) pokemons = pokemons.filter(p => p.pokedex_name.includes("dU+0027Alola"));
		if (args.includes("-galarian")) pokemons = pokemons.filter(p => p.pokedex_name.includes("de Galar"));
		
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
				.setDescription(pokemons.slice(i, i + pkmPerPage).map(p => `**${pokedex.findPokemon(p.pokedex_id).names.fr}** - ${p.caught} attrapé${p.caught > 1 ? "s" : ""}`).join("\n"));
			pages.push(embed);
		};
		
		try { pagination(message, pages); }
		catch (err) {
			console.log(err);
			message.channel.send("Quelque chose s'est mal passé en créant le paginateur").catch(console.error);
		}
	}
}

module.exports = command;