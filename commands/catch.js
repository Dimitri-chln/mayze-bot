const { Message } = require("discord.js");

const command = {
	name: "catch",
	description: "Attrape un pokémon !",
	aliases: ["c"],
	cooldown: 1200,
	args: 0,
	usage: "",
	/**
	 * @param {Message} message 
	 * @param {string[]} _args 
	 */
	async execute(message, _args) {
		// return message.reply("cette commande est désactivée pour le moment").catch(console.error);

		const pokedex = require("oakdex-pokedex");
		const { pokeball } = require("../assets/misc.json");

		const shinyFrequency = 0.004, alolanFrequency = 0.1, galarianFrequency = 0.1;
		const { catchRates } = message.client;

		const random = Math.random() * (catchRates.slice(-1)[0] + pokedex.findPokemon(catchRates.length).catch_rate);
		const pokemon = findDrop(random);
		
		let img = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${(`00${pokemon.national_id}`).substr(-3)}.png`;

		/*
		var randomAlolan = Math.random(), alolanText = "";
		if (randomAlolan < alolanFrequency && pokemon.alolan) {
			alolanText = " d'Alola";
			img = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemon.alolan}.png`;
		}
		var randomGalarian = Math.random(), galarianText = "";
		if (randomGalarian < galarianFrequency && pokemon.galarian && alolanText === "") {
			galarianText = " de Galar";
			img = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemon.galarian}.png`;
		} */

		let randomShiny = Math.random(), shiny = false;
		if (randomShiny < shinyFrequency) {
			shiny = true;
			img = `https://img.pokemondb.net/sprites/home/shiny/${pokemon.names.en.toLowerCase()}.png`;
		}

		const legendaries = ["Artikodin", "Électhor", "Sulfura", "Mewtwo", "Mew", "Raikou", "Entei", "Suicune", "Lugia", "Ho-Oh", "Celebi", "Regirock", "Regice", "Registeel", "Latias", "Latios", "Kyogre", "Groudon", "Rayquaza", "Jirachi", "Deoxys", "Créhelf", "Créfollet", "Créfadet", "Dialga", "Palkia", "Heatran", "Regigigas", "Giratina", "Cresselia", "Phione", "Manaphy", "Darkrai", "Shaymin", "Arceus", "Victini", "Cobaltium", "Terrakium", "Viridium", "Boréas", "Fulguris", "Reshiram", "Zekrom", "Démétéros", "Kyurem", "Keldeo", "Meloetta", "Genesect", "Xerneas", "Yveltal", "Zygarde", "Diancie", "Hoopa", "Volcanion", "Type:0", "Silvallié", "Tokorico", "Tokopiyon", "Tokotoro", "Tokopisco", "Cosmog", "Cosmovum", "Solgaleo", "Lunala", "Zéroïd", "Mouscoto", "Cancrelove", "Cäblifère", "Bamboiselle", "Katagami", "Engloutyran", "Necrozma", "Magearna", "Marshadow", "Vémini", "Mandrillon", "Ama-Ama", "Pierroteknik", "Zeraora", "Meltan", "Melmetal"];
		const legendary = legendaries.includes(pokemon.names.fr) ? true : false;

		const { rows } = await message.client.pg.query(`SELECT * FROM pokemons WHERE user_id = '${message.author.id}' AND pokedex_name = '${pokemon.names.en}' AND shiny = ${shiny}`).catch(console.error);
		if (rows.length) {
			message.client.pg.query(`UPDATE pokemons SET caught = ${rows[0].caught + 1} WHERE user_id = '${message.author.id}' AND pokedex_name = '${pokemon.names.en}' AND shiny = ${shiny}`).catch(console.error);
		} else {
			message.client.pg.query(`INSERT INTO pokemons (user_id, pokedex_id, pokedex_name, shiny, legendary) VALUES ('${message.author.id}', ${pokemon.national_id}, '${pokemon.names.en}', ${shiny}, ${legendary})`).catch(console.error);
		}

		message.channel.send({
			embed: {
				author: {
					name: rows.length ? "Pokémon capturé !" : "Nouveau pokémon ! 🎗️",
					icon_url: pokeball
				},
				image: {
					url: img
				},
				color: shiny ? "#ddbb20" : (legendary ? "#ce2f20" : "#010101"),
				description: `${message.author} a attrapé un ${shiny ? "⭐ " : ""}${pokemon.names.fr} !`,
				footer: {
					text: "✨Mayze✨",
					icon_url: message.author.avatarURL({ dynamic: true })
				}
			}
		}).catch(console.error);

		/**
		 * @param {number} random A random number
		 */
		function findDrop(random) {
			for (i = 0; i < catchRates.length; i ++)
				if (random < catchRates[i]) return pokedex.findPokemon(i);
			return pokedex.findPokemon(catchRates.length);
		}
	}
};

module.exports = command;