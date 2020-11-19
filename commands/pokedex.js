const command = {
	name: "pokedex",
	description: "Obtiens des informations sur un pokémon",
	aliases: ["dex", "pd"],
	args: 1,
	usage: "<pokémon>",
	async execute(message, args) {
		const pokedexBot = require("../assets/pokedex.json");
		const PokedexClient = require("pokedex-promise-v2");
		const Pokedex = new PokedexClient();

		const pokemonName = args.join(" ").toLowerCase().replace(/♂/, "m").replace(/♀/, "f");
		const pokemonBot = pokedexBot.find(p => (p.en || "").toLowerCase() === pokemonName || (p.fr || "").toLowerCase() === pokemonName) || {};
		var pokemon; 

		try { pokemon = await Pokedex.getPokemonByName((pokemonBot.en || pokemonName).toLowerCase()); }
		catch (err) {
			console.log(err);
			try { message.reply("ce pokémon n'existe pas"); }
			catch (err) { console.log("\n\n" , err); }
			return;
		}
		if (!pokemon) {
			try { message.reply("ce pokémon n'existe pas"); }
			catch (err) { console.log("\n\n" , err); }
			return;
		}

		var altNames = [], forms = [];
		if (pokemonBot.fr)
			altNames.push("🇫🇷 " + pokemonBot.fr);
		if (pokemonBot.mega)
			forms.push("• Mega");
		if (pokemonBot.megax && pokemonBot.megay)
			forms.push("• Méga X/Y");
		if (pokemonBot.giga)
			forms.push("• Gigamax");
		if (pokemonBot.alolan)
			forms.push("• Alolan");
		if (pokemonBot.galarian)
			forms.push("• Galarian");

		try {
			message.channel.send({
				embed: {
					title: `${pokemon.name.substr(0, 1).toUpperCase() + pokemon.name.substr(1)} #${("00" + pokemon.id).substr(-3)}`,
					color: "#010101",
					//description: pokemon.description,
					fields: [
						{
							name: "Autres noms :",
							value: altNames.join("\n") || "?",
							inline: true
						},{
							name: "Formes :",
							value: forms.join("\n") || "?",
							inline: true
						},{
							name: "Type(s) :",
							value: pokemon.types.map(t => t.type.name.substr(0, 1).toUpperCase() + t.type.name.substr(1)).join(" - ") || "?",
							inline: true
						},{
							name: "Stats de base :",
							value: `**PV :** ${pokemon.stats[0].base_stat || "?"}\n**Attaque :** ${pokemon.stats[1].base_stat || "?"}\n**Défense :** ${pokemon.stats[2].base_stat || "?"}\n**Attaque spé. :** ${pokemon.stats[3].base_stat || "?"}\n**Defense spé.:** ${pokemon.stats[4].base_stat || "?"}\n**Vitesse :** ${pokemon.stats[5].base_stat || "?"}\n`,
							inline: true
						},{
							name: "Height:",
							value: `${pokemon.height / 10 || "?"}m`,
							inline: true
						},{
							name: "Weight:",
							value: `${pokemon.weight / 10 || "?"}kg`,
							inline: true
						}
					],
					image: {
						url: pokemon.sprites.other["official-artwork"].front_default || `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${("00" + pokemon.id).substr(-3)}.png`
					},
					footer: {
						text: "✨Mayze✨"
					}
				}
			});
		} catch (err) { console.log(err); }
	}
};

module.exports = command;