const command = {
	name: "test",
	description: "testest",
	aliases: [],
	args: 0,
	usage: "",
	ownerOnly: true,
	async execute(message, args) {
		return;
		const pokemons = require("../database/pokemonDatabase.json");
		const pokedex = require("../assets/pokedex.json");
		await Object.entries(pokemons).forEach(user => {
			user[1].forEach(p => {
				for (i = 0; i < p.caught; i++) {
					let shiny = false;
					if (p.name.includes("⭐")) {
						shiny = true;
					}
					let dexid = pokedex.find(pk => p.name.toLowerCase().includes(pk.fr.toLowerCase())).img.match(/\d{3}/)[0];
					message.client.pgClient.query(`INSERT INTO pokemons (caught_by, pokedex_id, pokedex_name, is_shiny) VALUES ('${user[0]}', ${dexid}, '${p.name.replace(/'/g, "U+0027").replace(/⭐ /g, "")}', ${shiny})`).catch(console.error);
				}
			});
		});
		message.react("⭐").catch(console.error);
	}
};

module.exports = command;