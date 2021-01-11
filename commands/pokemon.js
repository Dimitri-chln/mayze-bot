const { Message } = require("discord.js");

const command = {
	name: "pokemon",
	description: "Regarde la liste des pokémons que tu as attrapés",
	aliases: ["pokemons", "pkmn", "pkm", "poke"],
	args: 0,
	usage: "[-legendary] [-shiny] [-alolan] [-galarian] [-id <nombre>] [-name <nom>]",
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 */
	async execute(message, args) {
		const { MessageEmbed } = require("discord.js");
		const pokedex = require("oakdex-pokedex");
		const pagination = require("../modules/pagination.js");

		message.channel.startTyping();
		let { "rows": pokemons }  = await message.client.pg.query(`SELECT * FROM pokemons WHERE user_id = '${message.author.id}' ORDER BY legendary DESC, shiny DESC, caught DESC, pokedex_id ASC`).catch(console.error);
		if (!pokemons) return message.channel.send("Quelque chose s'est mal passé en accédant à la base de données").catch(console.error);

		if (args.includes("-legendary")) pokemons = pokemons.filter(p => p.legendary);
		if (args.includes("-shiny")) pokemons = pokemons.filter(p => p.shiny);
		if (args.includes("-alolan")) pokemons = pokemons.filter(p => p.pokedex_name.includes("dU+0027Alola"));
		if (args.includes("-galarian")) pokemons = pokemons.filter(p => p.pokedex_name.includes("de Galar"));
		if (args.includes("-id")) pokemons = args[args.indexOf("-id") + 1] ? pokemons.filter(p => p.pokedex_id === parseInt(args[args.indexOf("-id") + 1], 10)) : pokemons;
		if (args.includes("-name")) pokemons = pokemons.filter(p => new RegExp(args[args.indexOf("-name") + 1], "i").test(pokedex.findPokemon(p.pokedex_id).names.fr));
		
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
				.setDescription(pokemons.slice(i, i + pkmPerPage).map(p => `**${p.shiny ? "⭐ " : ""}${p.legendary ? "🎖️ " : ""}${pokedex.findPokemon(p.pokedex_id).names.fr}**${args.includes("-id") ? `#${p.pokedex_id}` : ""} - ${p.caught} attrapé${p.caught > 1 ? "s" : ""}`).join("\n"));
			pages.push(embed);
		};
		
		try { pagination(message, pages); }
		catch (err) {
			console.log(err);
			message.channel.send("Quelque chose s'est mal passé en créant le paginateur").catch(console.error);
		}
		message.channel.stopTyping();
	}
}

module.exports = command;