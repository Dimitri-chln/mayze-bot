const { Message } = require("discord.js");

const command = {
	name: "stats",
	description: {
		fr: "Obtenir des statistiques sur le bot",
		en: "Get statistics about the bot"
	},
	aliases: [],
	args: 0,
	usage: "[pokémon]",
	slashOptions: [
		{
			name: "pokemon",
			description: "A pokémon to get statistics from",
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

		const pokemonName = args
			? args.join(" ")
			: options ? options[0].value : null;

		message.channel.startTyping(1);
		
		if (pokemonName) {
			const pokemon = pokedex.allPokemon().find(p => Object.values(p.names).some(name => name.toLowerCase() === pokemonName.toLowerCase()));
			if (!pokemon) return message.reply(language.invalid_pokemon).catch(err => {
				message.channel.stopTyping(true);
				console.error(err)
			});

			let description = "", total = 0;

			const { "rows": normal } = (await message.client.pg.query(`SELECT SUM(caught) FROM pokemons WHERE pokedex_id = ${pokemon.national_id} AND shiny = false AND alolan = false`).catch(console.error)) || {};
			if (!normal) return message.channel.send(language.errors.database).catch(err => {
				message.channel.stopTyping(true);
				console.error(err)
			});
			description += language.get(language.normal, parseInt(normal[0].sum) || 0);
			total += parseInt(normal[0].sum) || 0;

			const { "rows": shiny } = (await message.client.pg.query(`SELECT SUM(caught) FROM pokemons WHERE pokedex_id = ${pokemon.national_id} AND shiny AND alolan = false`).catch(console.error)) || {};
			if (!shiny) return message.channel.send(language.errors.database).catch(err => {
				message.channel.stopTyping(true);
				console.error(err)
			});
			description += language.get(language.shiny, parseInt(shiny[0].sum) || 0);
			total += parseInt(shiny[0].sum) || 0;

			if (pokemon.variations.some(v => v.condition === "Alola")) {
				const { "rows": alolan } = (await message.client.pg.query(`SELECT SUM(caught) FROM pokemons WHERE pokedex_id = ${pokemon.national_id} AND shiny = false AND alolan`).catch(console.error)) || {};
				if (!alolan) return message.channel.send(language.errors.database).catch(err => {
					message.channel.stopTyping(true);
					console.error(err)
				});
				description += language.get(language.alolan, parseInt(alolan[0].sum) || 0);
				total += parseInt(alolan[0].sum) || 0;

				const { "rows": alolanShiny } = (await message.client.pg.query(`SELECT SUM(caught) FROM pokemons WHERE pokedex_id = ${pokemon.national_id} AND shiny AND alolan`).catch(console.error)) || {};
				if (!alolanShiny) return message.channel.send(language.errors.database).catch(err => {
					message.channel.stopTyping(true);
					console.error(err)
				});
				description += language.get(language.alolan_shiny, parseInt(alolanShiny[0].sum) || 0);
				total += parseInt(alolanShiny[0].sum) || 0;
			}

			description += language.get(language.total, total);

			message.channel.send({
				embed: {
					author: {
						name: language.title,
						icon_url: message.client.user.avatarURL()
					},
					title: `${pokemon.names[languageCode]}#${("00" + pokemon.national_id).substr(-3)}`,
					color: message.guild.me.displayColor,
					description,
					footer: {
						text: "✨ Mayze ✨"
					}
				}
			}).catch(console.error);
			message.channel.stopTyping(true);

		} else {
			let description = "", total = 0;

			const { "rows": normal } = (await message.client.pg.query(`SELECT SUM(caught) FROM pokemons WHERE shiny = false AND legendary = false AND ultra_beast = false`).catch(console.error)) || {};
			if (!normal) return message.channel.send(language.errors.database).catch(err => {
				message.channel.stopTyping(true);
				console.error(err)
			});
			description += language.get(language.normal, parseInt(normal[0].sum) || 0);
			total += parseInt(normal[0].sum) || 0;

			const { "rows": shiny } = (await message.client.pg.query(`SELECT SUM(caught) FROM pokemons WHERE shiny AND legendary = false AND ultra_beast = false`).catch(console.error)) || {};
			if (!shiny) return message.channel.send(language.errors.database).catch(err => {
				message.channel.stopTyping(true);
				console.error(err)
			});
			description += language.get(language.shiny, parseInt(shiny[0].sum) || 0);
			total += parseInt(shiny[0].sum) || 0;

			const { "rows": legendary } = (await message.client.pg.query(`SELECT SUM(caught) FROM pokemons WHERE shiny = false AND legendary`).catch(console.error)) || {};
			if (!legendary) return message.channel.send(language.errors.database).catch(err => {
				message.channel.stopTyping(true);
				console.error(err)
			});
			description += language.get(language.legendary, parseInt(legendary[0].sum) || 0);
			total += parseInt(legendary[0].sum) || 0;

			const { "rows": legendaryShiny } = (await message.client.pg.query(`SELECT SUM(caught) FROM pokemons WHERE shiny AND legendary`).catch(console.error)) || {};
			if (!legendaryShiny) return message.channel.send(language.errors.database).catch(err => {
				message.channel.stopTyping(true);
				console.error(err)
			});
			description += language.get(language.legendary_shiny, parseInt(legendaryShiny[0].sum) || 0);
			total += parseInt(legendaryShiny[0].sum) || 0;

			const { "rows": beast } = (await message.client.pg.query(`SELECT SUM(caught) FROM pokemons WHERE shiny = false AND ultra_beast`).catch(console.error)) || {};
			if (!beast) return message.channel.send(language.errors.database).catch(err => {
				message.channel.stopTyping(true);
				console.error(err)
			});
			description += language.get(language.beast, parseInt(beast[0].sum) || 0);
			total += parseInt(beast[0].sum) || 0;

			const { "rows": beastShiny } = (await message.client.pg.query(`SELECT SUM(caught) FROM pokemons WHERE shiny AND ultra_beast`).catch(console.error)) || {};
			if (!beastShiny) return message.channel.send(language.errors.database).catch(err => {
				message.channel.stopTyping(true);
				console.error(err)
			});
			description += language.get(language.beast_shiny, parseInt(beastShiny[0].sum) || 0);
			total += parseInt(beastShiny[0].sum) || 0;

			description += language.get(language.total, total);

			message.channel.send({
				embed: {
					author: {
						name: language.title,
						icon_url: message.client.user.avatarURL()
					},
					color: message.guild.me.displayColor,
					fields: [
						{ name: "__Pokémons__", value: description, inline: true }
					],
					footer: {
						text: "✨ Mayze ✨"
					}
				}
			}).catch(console.error);
			message.channel.stopTyping(true);
		}
	}
};

module.exports = command;