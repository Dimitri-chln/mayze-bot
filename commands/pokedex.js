const { Message } = require("discord.js");

const command = {
	name: "pokedex",
	description: {
		fr: "Obtenir des informations sur un pokémon",
		en: "Get information about a pokémon"
	},
	aliases: ["dex", "pd"],
	args: 1,
	usage: "<pokémon/pokédex ID>",
	slashOptions: [
		{
			name: "pokémon",
			description: "The name or the ID of the pokémon",
			type: 3,
			required: true
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		const pokedex = require("oakdex-pokedex");

		const input = args
			? args.join(" ").toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase())
			: options[0].value.toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase());
		const pokemon = pokedex.allPokemon().find(pkm => Object.values(pkm.names).includes(input));

		if (!pokemon) return message.reply(language.invalid_pokemon).catch(console.error);

		const flags = { en: "🇬🇧", fr: "🇫🇷", de: "🇩🇪", cz: "🇨🇿", es: "🇪🇸", it: "🇮🇹", jp: "🇯🇵", tr: "🇹🇷", dk: "🇩🇰", gr: "🇬🇷", pl: "🇵🇱" };

		message.channel.send({
			embed: {
				title: `${pokemon.names[languageCode] || pokemon.names.en} #${(`00${pokemon.national_id}`).substr(-3)}`,
				color: message.guild.me.displayHexColor,
				image: {
					url: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${(`00${pokemon.national_id}`).substr(-3)}.png`
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
		}).catch(console.error)
	}
};

module.exports = command;