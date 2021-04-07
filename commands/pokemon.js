const { Message } = require("discord.js");

const command = {
	name: "pokemon",
	description: {
		fr: "Obtenir la liste des pokémons que tu as attrapés",
		en: "Get the list of all the pokémons you caught"
	},
	aliases: ["pokemons", "pkmn", "pkm", "poke"],
	args: 0,
	usage: "[<user>] [-legendary] [-shiny] [-id [<number>]] [-name <name>]",
	slashOptions: [
		{
			name: "user",
			description: "The user to check",
			type: 6,
			required: false
		},
		{
			name: "options",
			description: "Search options",
			type: 3,
			required: false
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		const { MessageEmbed } = require("discord.js");
		const pokedex = require("oakdex-pokedex");
		const starters = require("../assets/starters.json");
		const pagination = require("../utils/pagination");

		const user = args
			? message.mentions.users.first() || message.author
			: options.some(o => o.name === "user") ? message.guild.members.cache.get(options.find(o => o.name === "user").value).user : message.author;

		let { "rows": pokemons }  = (await message.client.pg.query(`SELECT * FROM pokemons WHERE user_id = '${user.id}' ORDER BY legendary DESC, shiny DESC, favorite DESC, caught DESC, pokedex_id ASC`).catch(console.error)) || {};
		if (!pokemons) return message.channel.send(language.errors.database).catch(console.error);

		const params = args
			? args
			: options.some(o => o.name === "options") ? options.find(o => o.name === "options").value.split(/ +/) : [];

		if (params.includes("-favorite") || params.includes("-fav")) pokemons = pokemons.filter(p => p.favorite);
		if (params.includes("-starter")) pokemons = pokemons.filter(p => starters.includes(p.pokedex_name));
		if (params.includes("-legendary") || params.includes("-leg")) pokemons = pokemons.filter(p => p.legendary);
		if (params.includes("-shiny")) pokemons = pokemons.filter(p => p.shiny);
		if (params.includes("-id")) pokemons = params[params.indexOf("-id") + 1] ? pokemons.filter(p => p.pokedex_id === parseInt(params[params.indexOf("-id") + 1])) : pokemons;
		if (params.includes("-name")) pokemons = pokemons.filter(p => new RegExp(params[params.indexOf("-name") + 1], "i").test(pokedex.findPokemon(p.pokedex_id).names[languageCode]));
		
		const pkmPerPage = 15;
		let pages = [];
		let embed = new MessageEmbed()
			.setAuthor(language.get(language.title, user.tag), user.avatarURL({ dynamic: true }))
			.setColor(message.guild.me.displayHexColor)
			.setDescription(language.no_pokemon);
		if (pokemons.length === 1) embed.setImage(pokemons[0].shiny ? `https://img.pokemondb.net/sprites/home/shiny/${pokemons[0].pokedex_name.toLowerCase()}.png` : `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${(`00${pokemons[0].pokedex_id}`).substr(-3)}.png`);
		if (!pokemons.length) pages.push(embed);

		for (i = 0; i < pokemons.length; i += pkmPerPage) {
			embed = new MessageEmbed()
				.setAuthor(language.get(language.title, user.tag), user.avatarURL({ dynamic: true }))
				.setColor(message.guild.me.displayHexColor)
				.setDescription(pokemons.slice(i, i + pkmPerPage).map(p => language.get(language.description, p.legendary, p.shiny, pokedex.findPokemon(p.pokedex_id).names[languageCode], params.includes("-id") ? `#${p.pokedex_id}` : "", p.caught, p.caught > 1 ? "s" : "", p.favorite)).join("\n"));
				if (pokemons.length === 1) embed.setImage(pokemons[0].shiny ? `https://img.pokemondb.net/sprites/home/shiny/${pokemons[0].pokedex_name.toLowerCase()}.png` : `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${(`00${pokemons[0].pokedex_id}`).substr(-3)}.png`);
			pages.push(embed);
		};
		
		try {
			pagination(message, pages);
		} catch (err) {
			console.error(err);
			message.channel.send(language.errors.paginator).catch(console.error);
		}
	}
}

module.exports = command;