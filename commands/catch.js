const command = {
	name: "catch",
	description: "Attrape un pokémon !",
	aliases: ["c"],
	cooldown: 3600,
	args: 0,
	usage: "",
	async execute(message, args) {
		const databaseSQL = require("../modules/databaseSQL.js");
		const pokedex = require("../assets/pokedex.json");

		const shinyFrequency = 0.004, alolanFrequency = 0.1, galarianFrequency = 0.1;

		const random = Math.random() * (pokedex.slice(-1)[0].dropSum + pokedex.slice(-1)[0].drop);
		const pokemon = pokedex.find(pkm => random >= pkm.dropSum && random < pkm.drop + pkm.dropSum);
		
		var img = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemon.img}.png`;

		var randomAlolan = Math.random(), alolanText = "";
		if (randomAlolan < alolanFrequency && pokemon.alolan) {
			alolanText = " d'Alola";
			img = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemon.alolan}.png`;
		}
		var randomGalarian = Math.random(), galarianText = "";
		if (randomGalarian < galarianFrequency && pokemon.galarian && alolanText === "") {
			galarianText = " de Galar";
			img = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemon.galarian}.png`;
		}
		var randomShiny = Math.random(), shinyText = "", is_shiny = false, embedColor = "#010101";
		if (randomShiny < shinyFrequency) {
			shinyText = "⭐ ";
			is_shiny = true;
			embedColor = "#ddbb20";
			img = `https://img.pokemondb.net/sprites/home/shiny/${pokemon.en.toLowerCase()}.png`;
		}
		const pokemonName = pokemon.fr + alolanText + galarianText;
		
		try {
			await databaseSQL(`INSERT INTO pokemons (caught_by, pokedex_id, pokedex_name, is_shiny) VALUES ('${message.author.id}', ${pokemon.img.match(/\d{3}/)[0]}, '${pokemonName}', ${is_shiny})`);
		} catch (err) {
			console.log(err);
			return message.channel.send("Quelque chose s'est mal passé en joignant la base de données :/").catch(console.error);
		}
		
		var author = "Pokémon capturé!";
		try {
			const { rows } = await databaseSQL(`SELECT * FROM pokemons WHERE caught_by='${message.author.id}' AND pokedex_name='${pokemonName}'`);
			if (rows.length === 1) {
				author = "Nouveau pokémon! 🎗️";
			}
		} catch (err) { console.log(err); }

		try {
			message.channel.send({
				embed: {
					author: {
						name: author,
						icon_url: "https://i.imgur.com/uJlfMAd.png"
					},
					image: {
						url: img
					},
					color: embedColor,
					description: `${message.author} a attrapé un ${shinyText}${pokemonName} !`,
					footer: {
						text: "✨Mayze✨",
						icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
					}
				}
			});
		} catch (err) { console.log(err); }
	}
};

module.exports = command;