const command = {
	name: "pokemon",
	description: "Regarde la liste des pokémons que tu as attrapés",
	aliases: ["pokemons", "pkmn", "pkm", "poke"],
	args: 0,
	usage: "[-legendary] [-shiny] [-alolan] [-galarian]",
	async execute(message, args) {
		const Discord = require("discord.js");
		const paginationEmbed = require("discord.js-pagination");
		const databaseSQL = require("../modules/databaseSQL.js");
		var pokemons;
		try {
			const { rows }  = await databaseSQL(`SELECT * FROM pokemons WHERE caught_by='${message.author.id}' ORDER BY id`);
			pokemons = rows;
		} catch (err) {
			console.log(err);
			return message.channel.send("Quelque chose s'est mal passé en joignant la base de données").catch(console.error);
		}

		if (args.includes("-legendary")) {
			const legendaries =  ["Artikodin", "Électhor", "Sulfura", "Mewtwo", "Mew", "Raikou", "Entei", "Suicune", "Lugia", "Ho-Oh", "Celebi"];
			pokemons = pokemons.filter(p => legendaries.includes(p.name));
		}
		if (args.includes("-shiny")) {
			pokemons = pokemons.filter(p => p.is_shiny);
		};
		if (args.includes("-alolan")) {
			pokemons = pokemons.filter(p => p.pokedex_name.includes("d'Alola"));
		};
		if (args.includes("-galarian")) {
			pokemons = pokemons.filter(p => p.pokedex_name.includes("de Galar"));
		};
		
		const pkmPerPage = 15;
		var pages = [];
		var embed = new Discord.MessageEmbed()
			.setAuthor(`Pokémons de ${message.author.username}`, `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`)
			.setColor("#010101")
			.setDescription("*Aucun pokémon ne correspond à la recherche*");
		if (!pokemons.length) {
			pages.push(embed);
		};
		for (i = 0; i < pokemons.length; i += pkmPerPage) {
			embed = new Discord.MessageEmbed()
				.setAuthor(`Pokémons de ${message.author.username}`, `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`)
				.setColor("#010101")
				.setDescription(pokemons.slice(i, i + pkmPerPage).map(p => { if (p.is_shiny) return `⭐ **${p.pokedex_name}** | ID: ${p.id}`; return `**${p.pokedex_name}** | ID: ${p.id}` }).join("\n"));
			pages.push(embed);
		};
		
		try { paginationEmbed(message, pages, ["⏪", "⏩"], 180000); }
		catch (err) {
			console.log(err);
			message.channel.send("Quelque chose s'est mal passé en créant le paginateur").catch(console.error);
		}
	}
}

module.exports = command;