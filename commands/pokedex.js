const { Message } = require("discord.js");

const command = {
	name: "pokedex",
	description: {
		fr: "Obtenir des informations sur un pokémon",
		en: "Get information about a pokémon"
	},
	aliases: ["dex", "pd"],
	args: 0,
	usage: "[<pokémon/pokédex ID>] [-caught] [-uncaught] [-shiny] [-legendary] [-beast] [-mega]",
	botPerms: ["EMBED_LINKS", "ADD_REACTIONS", "USE_EXTERNAL_EMOJIS", "MANAGE_MESSAGES"],
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
		const beasts = require("../assets/ultra-beasts.json");
		const alolans = require("../assets/alolans.json");
		const megas = require("../assets/mega.json");
		const { getPokemonImage, getPokemonName, getPokemonVariation, getCleanName } = require("../utils/pokemonInfo");
		const pagination = require("../utils/pagination");
		const { MessageEmbed } = require("discord.js");

		const input = args
			? getCleanName(args.join(" ")).replace(/-\w+/g, "").trim()
			: options ? getCleanName(options[0].value).replace(/-\w+/g, "").trim() : "";
		
		if (input) {
			let pokemon = pokedex.findPokemon(input) || pokedex.allPokemon().find(pkm => Object.values(pkm.names).some(n => n.toLowerCase().replace(/\u2642/, "m").replace(/\u2640/, "f") === input));
			if (!pokemon) return message.reply(language.invalid_pokemon).catch(console.error);

			const shiny = args
				? args.includes("shiny")
				: options[0].value.toLowerCase().includes("shiny");
			const variation = args
				? getPokemonVariation(args.join(" "))
				: getPokemonVariation(options[0].value);

				console.log(input)
				console.log(variation)
			
			const flags = { en: "🇬🇧", fr: "🇫🇷", de: "🇩🇪", cz: "🇨🇿", es: "🇪🇸", it: "🇮🇹", jp: "🇯🇵", tr: "🇹🇷", dk: "🇩🇰", gr: "🇬🇷", pl: "🇵🇱" };

			message.channel.send({
				embed: {
					title: `${getPokemonName(pokemon, shiny, variation, languageCode)} #${(`00${pokemon.national_id}`).substr(-3)}`,
					color: message.guild.me.displayColor,
					image: {
						url: getPokemonImage(pokemon, shiny, variation)
					},
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
			const beast = params.includes("-beast") || params.includes("-ub");
			const variation = 
				  params.includes("-alolan") ? "alolan"
				: params.includes("-mega") ? "mega"
				: "default";

			const { "rows": pokemons } = (await message.client.pg.query(
				variation === "mega"
					? "SELECT * FROM pokemons WHERE users ? $1 AND shiny = $2 AND variation = ANY('{ \"mega\", \"megax\", \"megay\", \"primal\" }')"
					: "SELECT * FROM pokemons WHERE users ? $1 AND shiny = $2 AND variation = $3",
				variation === "mega"
					? [ message.author.id, shiny ]
					: [ message.author.id, shiny, variation ]
			).catch(console.error)) || {};
			if (!pokemons) return message.reply(language.errors.database).catch(console.error);
			
			let dex = pokedex.allPokemon().sort((a, b) => a.national_id - b.national_id);
			if (params.includes("-caught")) dex = dex.filter(pkm => pokemons.some(p => p.pokedex_id === pkm.national_id));
			if (params.includes("-uncaught")) dex = dex.filter(pkm => !pokemons.some(p => p.pokedex_id === pkm.national_id));
			if (legendary) dex = dex.filter(pkm => legendaries.includes(pkm.names.en));
			if (beast) dex = dex.filter(pkm => beasts.includes(pkm.names.en));
			if (variation === "alolan") dex = dex.filter(p => alolans.includes(p.names.en));
			if (variation === "mega") dex = dex.filter(p => Object.keys(megas).includes(p.names.en));

			const pkmPerPage = 15;
			let pages = [];
			let embed = new MessageEmbed()
				.setAuthor(language.get(language.title, message.author.tag), message.author.avatarURL({ dynamic: true }))
				.setColor(message.guild.me.displayColor)
				.setDescription(language.no_pokemon);
			if (!dex.length) pages.push(embed);

			for (i = 0; i < dex.length; i += pkmPerPage) {
				let embed = new MessageEmbed()
					.setAuthor(language.get(language.title, message.author.tag), message.author.avatarURL({ dynamic: true }))
					.setColor(message.guild.me.displayColor)
					.setDescription(dex.slice(i, i + pkmPerPage).map(p => language.get(language.description, pokemons.some(pkm => pkm.pokedex_id === p.national_id), getPokemonName(p, shiny, variation, languageCode), ("00" + p.national_id).substr(-3))).join("\n"));
				pages.push(embed);
			};
			
			pagination(message, pages).catch(err => {
				console.error(err);
				message.channel.send(language.errors.paginator).catch(console.error);
			});
		}
	}
};

module.exports = command;