const { Message } = require("discord.js");

const command = {
	name: "pokedex",
	description: {
		fr: "Obtenir des informations sur un pokémon",
		en: "Get information about a pokémon"
	},
	aliases: ["dex", "pd"],
	args: 0,
	usage: "[<pokémon/pokédex ID>] [-caught] [-uncaught] [-shiny] [-legendary]",
	slashOptions: [
		{
			name: "pokémon",
			description: "The name or the ID of the pokémon",
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
		const pokedex = require("oakdex-pokedex");
		const legendaries = require("../assets/legendaries.json");
		const pagination = require("../utils/pagination");
		const { MessageEmbed } = require("discord.js");

		const input = args
			? args.join(" ").toLowerCase().replace(/shiny|alolan|-caught|-uncaught|-shiny|-leg(?:endary)?|-alolan/g, "").trim()
			: options[0].value.toLowerCase().replace(/shiny|alolan|-caught|-uncaught|-shiny|-leg(?:endary)?|-alolan/g, "").trim();
		
		if (input) {
			let pokemon = pokedex.findPokemon(input) || pokedex.allPokemon().find(pkm => Object.values(pkm.names).some(name => input === name.toLowerCase().replace("♂", "m").replace("♀️", "f")));
			if (!pokemon) return message.reply(language.invalid_pokemon).catch(console.error);
			if (args.includes("alolan")) pokemon = {
				base_stats: pokemon.base_stats,
				national_id: pokemon.national_id,
				height_eu: pokemon.height_eu,
				weight_eu: pokemon.weight_eu,
				...pokemon.variations.find(v => v.condition === "Alola")
			};
			if (!pokemon) return message.reply(language.invalid_pokemon).catch(console.error);

			const shiny = args
				? args.includes("shiny")
				: options[0].value.toLowerCase().includes("shiny");
			const url = shiny
				? `https://img.pokemondb.net/sprites/home/shiny/${pokemon.names.en.toLowerCase()}.png`
				: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${(`00${pokemon.national_id}`).substr(-3)}${pokemon.condition === "Alola" ? "_f2" : ""}.png`

			const flags = { en: "🇬🇧", fr: "🇫🇷", de: "🇩🇪", cz: "🇨🇿", es: "🇪🇸", it: "🇮🇹", jp: "🇯🇵", tr: "🇹🇷", dk: "🇩🇰", gr: "🇬🇷", pl: "🇵🇱" };

			message.channel.send({
				embed: {
					title: `${pokemon.names[languageCode] || pokemon.names.en} #${(`00${pokemon.national_id}`).substr(-3)}`,
					color: message.guild.me.displayHexColor,
					image: { url },
					footer: {
						text: "✨ Mayze ✨"
					},
					fields: [
						{
							name: language.fields[0],
							value: Object.keys(pokemon.names).filter(l => l !== languageCode).map(l => `${flags[l]} ${pokemon.names[l]}`).join("\n"),
							inline: true
						},
						{
							name: language.fields[1],
							value: pokemon.height_eu,
							inline: true
						},
						{
							name: language.fields[2],
							value: pokemon.weight_eu,
							inline: true
						},
						{
							name: language.fields[3],
							value: language.get(language.stats, pokemon.base_stats.hp, pokemon.base_stats.atk, pokemon.base_stats.def, pokemon.base_stats.sp_atk, pokemon.base_stats.sp_def, pokemon.base_stats.speed),
							inline: true
						},
						{
							name: language.fields[4],
							value: "?",
							inline: true
						},
						{
							name: language.fields[5],
							value: pokemon.types.map(type => `• ${type}`).join("\n"),
							inline: true
						}
					]
				}
			}).catch(console.error);
		
		} else {
			const params = args
				? args
				: options[0].value.split(" ");
			const shiny = params.includes("-shiny");
			const legendary = params.includes("-legendary") || params.includes("-leg");
			const alolan = params.includes("-alolan");

			const { "rows": pokemons } = (await message.client.pg.query(`SELECT * FROM pokemons WHERE user_id = '${message.author.id}' AND shiny = ${shiny} AND alolan = ${alolan}`).catch(console.error)) || {};
			if (!pokemons) return message.reply(language.errors.database).catch(console.error);
			
			let dex = pokedex.allPokemon().sort((a, b) => a.national_id - b.national_id);
			if (params.includes("-caught")) dex = dex.filter(pkm => pokemons.some(p => p.pokedex_id === pkm.national_id));
			if (params.includes("-uncaught")) dex = dex.filter(pkm => !pokemons.some(p => p.pokedex_id === pkm.national_id));
			if (legendary) dex = dex.filter(pkm => legendaries.includes(pkm.names.en));
			if (alolan) dex = dex.filter(p => p.variations.some(v => v.condition === "Alola"));

			const pkmPerPage = 15;
			let pages = [];
			let embed = new MessageEmbed()
				.setAuthor(language.get(language.title, message.author.tag), message.author.avatarURL({ dynamic: true }))
				.setColor(message.guild.me.displayHexColor)
				.setDescription(language.no_pokemon);
			if (!dex.length) pages.push(embed);

			for (i = 0; i < dex.length; i += pkmPerPage) {
				let embed = new MessageEmbed()
					.setAuthor(language.get(language.title, message.author.tag), message.author.avatarURL({ dynamic: true }))
					.setColor(message.guild.me.displayHexColor)
					.setDescription(dex.slice(i, i + pkmPerPage).map(p => language.get(language.description, pokemons.some(pkm => pkm.pokedex_id === p.national_id), p.names[languageCode], ("00" + p.national_id).substr(-3), legendary, shiny)).join("\n"));
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
};

module.exports = command;