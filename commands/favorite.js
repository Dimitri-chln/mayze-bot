const { Message } = require("discord.js");

const command = {
	name: "favorite",
	description: {
		fr: "Ajouter ou retirer des pokémons à tes favoris",
		en: "Add or remove pokémons from your favorites"
	},
	aliases: ["fav"],
	args: 2,
	usage: "add <pokémon> | remove <pokémon>",
	slashOptions: [
		{
			name: "add",
			description: "Add apokémon to your favorites",
			type: 1,
			options: [
				{
					name: "pokemon",
					description: "The pokémon to add",
					type: 3,
					required: true
				}
			]
		},
		{
			name: "remove",
			description: "Remove a pokémon from your favorites",
			type: 1,
			options: [
				{
					name: "pokemon",
					description: "The pokémon to remove",
					type: 3,
					required: true
				}
			]
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		const pokedex = require("oakdex-pokedex");

		const subCommand = args
			? args[0].toLowerCase()
			: options[0].name;
		const pokemonName = args
			? args.slice(1).join(" ").toLowerCase().replace("shiny", "").trim()
			: options[0].options[0].value.toLowerCase().replace("shiny", "").trim();
		const shiny = args
			? args.includes("shiny")
			: options[0].options[0].value.includes("shiny");
		
		const pokemon = pokedex.allPokemon().find(pkm => Object.values(pkm.names).some(name => name.toLowerCase() === pokemonName));
		if (!pokemon) return message.reply(language.invalid_pokemon).catch(console.error);

		const { "rows": pokemons } = (await message.client.pg.query(`SELECT * FROM pokemons WHERE user_id = '${message.author.id}' AND pokedex_name = '${pokemon.names.en}' AND shiny = ${shiny}`).catch(console.error)) || {};
		if (!pokemons || !pokemons.length) return message.reply(language.no_pokemon).catch(console.error);
		
		switch (subCommand) {
			case "add": {
				const res = await message.client.pg.query(`UPDATE pokemons SET favorite = true WHERE id = ${pokemons[0].id}`).catch(console.error);
				if (!res) return message.channel.send(language.errors.database).catch(console.error);
				if (message.deletable) message.react("✅").catch(console.error);
				else message.reply(language.favorite_added).catch(console.error);
				break;
			}
			case "remove": {
				const res = await message.client.pg.query(`UPDATE pokemons SET favorite = false WHERE id = ${pokemons[0].id}`).catch(console.error);
				if (!res) return message.channel.send(language.errors.database).catch(console.error);
				if (message.deletable) message.react("❌").catch(console.error);
				else message.reply(language.favorite_removed).catch(console.error);
				break;
			}
			default:
				return message.reply(language.errors.invalid_args).catch(console.error);
		}
	}
};

module.exports = command;