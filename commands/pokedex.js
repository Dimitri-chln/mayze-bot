const { Message } = require("discord.js");

const command = {
	name: "pokedex",
	description: "Obtiens des informations sur un pokémon",
	aliases: ["dex", "pd"],
	args: 1,
	usage: "<pokémon/pokédex ID>",
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 */
	async execute(message, args) {
		const pokedex = require("oakdex-pokedex");

		const input = args.join(" ").toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase() });
		const pokemon = pokedex.findPokemon(input);

		if (!pokemon) return message.reply("ce pokémon n'existe pas").catch(console.error);

		message.channel.send({
			embed: {
				title: `${pokemon.names.fr} #${("00" + pokemon.national_id).substr(-3)}`,
				color: "#010101",
				image: {
					url: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${("00" + pokemon.national_id).substr(-3)}.png`
				},
				footer: {
					text: "✨Mayze✨"
				},
				fields: [
					{
						name: "Autres noms :",
						value: `🇬🇧 ${pokemon.names.en}\n🇩🇪 ${pokemon.names.de}`,
						inline: true
					},
					{
						name: "Taille :",
						value: pokemon.height_eu,
						inline: true
					},
					{
						name: "Poids :",
						value: pokemon.weight_eu,
						inline: true
					},
					{
						name: "Stats de base :",
						value: `**PV:** ${pokemon.base_stats.hp}\n**Attaque:** ${pokemon.base_stats.atk}\n**Défense:** ${pokemon.base_stats.def}\n**Attaque Spé:** ${pokemon.base_stats.sp_atk}\n**Défense Spé:** ${pokemon.base_stats.sp_def}\n**Vitesse:** ${pokemon.base_stats.speed}`,
						inline: true
					},
					{
						name: "Formes :",
						value: "?",
						inline: true
					},
					{
						name: "Type(s) :",
						value: pokemon.types.map(type => `• ${type}`).join("\n"),
						inline: true
					}
				]
			}
		}).catch(console.error)
	}
};

module.exports = command;