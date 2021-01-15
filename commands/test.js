const { Message } = require("discord.js");

const command = {
	name: "test",
	description: "testest",
	aliases: [],
	args: 0,
	usage: "",
	ownerOnly: true,
	/**
	 * 
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	async execute(message, args, options) {
		const pokedex = require("oakdex-pokedex");
		const legendaries = ["Artikodin", "Électhor", "Sulfura", "Mewtwo", "Mew", "Raikou", "Entei", "Suicune", "Lugia", "Ho-Oh", "Celebi", "Regirock", "Regice", "Registeel", "Latias", "Latios", "Kyogre", "Groudon", "Rayquaza", "Jirachi", "Deoxys", "Créhelf", "Créfollet", "Créfadet", "Dialga", "Palkia", "Heatran", "Regigigas", "Giratina", "Cresselia", "Phione", "Manaphy", "Darkrai", "Shaymin", "Arceus", "Victini", "Cobaltium", "Terrakium", "Viridium", "Boréas", "Fulguris", "Reshiram", "Zekrom", "Démétéros", "Kyurem", "Keldeo", "Meloetta", "Genesect", "Xerneas", "Yveltal", "Zygarde", "Diancie", "Hoopa", "Volcanion", "Type:0", "Silvallié", "Tokorico", "Tokopiyon", "Tokotoro", "Tokopisco", "Cosmog", "Cosmovum", "Solgaleo", "Lunala", "Zéroïd", "Mouscoto", "Cancrelove", "Cäblifère", "Bamboiselle", "Katagami", "Engloutyran", "Necrozma", "Magearna", "Marshadow", "Vémini", "Mandrillon", "Ama-Ama", "Pierroteknik", "Zeraora", "Meltan", "Melmetal"];
		
		pokedex.allPokemon().sort((a, b) => a.catch_rate - b.catch_rate).forEach(p => {
			//console.log(`${(`00${p.national_id}`).substr(-3)}. ${p.names.fr} => ${p.catch_rate}`);
			if (legendaries.includes(p.names.fr)) console.log(`${p.national_id}. ${p.names.fr} => ${p.catch_rate}`);
		});
		
		/*
		const backup = require("../backups/database_pokemons.json");
		getPokemons(backup);

		async function getPokemons(data) {
			if (!data.length) return console.log("Transfer complete");
			const pkm = data[0];
			const legendaries = ["Artikodin", "Électhor", "Sulfura", "Mewtwo", "Mew", "Raikou", "Entei", "Suicune", "Lugia", "Ho-Oh", "Celebi", "Regirock", "Regice", "Registeel", "Latias", "Latios", "Kyogre", "Groudon", "Rayquaza", "Jirachi", "Deoxys", "Créhelf", "Créfollet", "Créfadet", "Dialga", "Palkia", "Heatran", "Regigigas", "Giratina", "Cresselia", "Phione", "Manaphy", "Darkrai", "Shaymin", "Arceus", "Victini", "Cobaltium", "Terrakium", "Viridium", "Boréas", "Fulguris", "Reshiram", "Zekrom", "Démétéros", "Kyurem", "Keldeo", "Meloetta", "Genesect", "Xerneas", "Yveltal", "Zygarde", "Diancie", "Hoopa", "Volcanion", "Type:0", "Silvallié", "Tokorico", "Tokopiyon", "Tokotoro", "Tokopisco", "Cosmog", "Cosmovum", "Solgaleo", "Lunala", "Zéroïd", "Mouscoto", "Cancrelove", "Cäblifère", "Bamboiselle", "Katagami", "Engloutyran", "Necrozma", "Magearna", "Marshadow", "Vémini", "Mandrillon", "Ama-Ama", "Pierroteknik", "Zeraora", "Meltan", "Melmetal"];
			const is_legendary = legendaries.includes(pkm.pokedex_name) ? true : false;
			const count = backup.filter(p => p.caught_by === pkm.caught_by && p.pokedex_id === pkm.pokedex_id && p.is_shiny === pkm.is_shiny).length;
			const newData = data.filter(p => p.caught_by !== pkm.caught_by || p.pokedex_id !== pkm.pokedex_id || p.is_shiny !== pkm.is_shiny);
			await message.client.pg.query(`INSERT INTO pokemons (user_id, pokedex_id, pokedex_name, caught, shiny, legendary) VALUES ('${pkm.caught_by}', ${pkm.pokedex_id}, '${pokedex.findPokemon(pkm.pokedex_id).names.en.replace(/'/g, "U+0027")}', ${count}, ${pkm.is_shiny}, ${is_legendary})`).catch(console.error);
			getPokemons(newData);
		}
		*/
	}
};

module.exports = command;