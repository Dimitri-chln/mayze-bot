const { Message } = require("discord.js");

const command = {
	name: "stats",
	description: {
		fr: "Obtenir des statistiques sur le bot",
		en: "Get statistics about the bot"
	},
	aliases: [],
	args: 0,
	usage: "[pokémon] | caught [-shiny] [-legendary] [-beast] [-alolan]",
	botPerms: ["EMBED_LINKS"],
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
		const legendaries = require("../assets/legendaries.json");
		const beasts = require("../assets/ultra-beasts.json");
		const alolans = require("../assets/alolans.json");
		const pagination = require("../utils/pagination");
		const { getPokemonName } = require("../utils/pokemonInfo");
		const { MessageEmbed } = require("discord.js");

		const pokemonName = args
			? args.join(" ")
			: options ? options[0].value : null;
		
		if (pokemonName) {
			if (args[0].toLowerCase() === "caught") {
				let { "rows": pokemons } = (await message.client.pg.query(
					`
					SELECT pokedex_id, shiny, legendary, ultra_beast, variation, SUM((value -> 'caught')::int) AS total
					FROM pokemons, jsonb_each(users)
					GROUP BY pokedex_id, shiny, legendary, ultra_beast, variation
					ORDER BY total DESC
					`
				).catch(console.error)) || {};
				if (!pokemons) return message.reply(language.errors.database).catch(console.error);

				for (const pokemon of pokedex.allPokemon()) {
					if (!pokemons.some(p => p.pokedex_id === pokemon.national_id)) pokemons.push({
						pokedex_id: pokemon.national_id,
						total: 0,
						legendary: legendaries.includes(pokemon.names.en),
						ultra_beast: beasts.includes(pokemon.names.en)
					});
				}

				const shiny = args
					? args.includes("-shiny")
					: false;
				const legendary = args
					? args.includes("-legendary") || args.includes("-leg")
					: false;
				const beast = args
					? args.includes("-beast") || args.includes("-ub")
					: false;
				const variation = args
					? args.includes("-alolan") ? "alolan" : "default"
					: "default";

				pokemons = pokemons.filter(p => p.shiny === shiny);
				pokemons = pokemons.filter(p => p.variation === variation);
				if (legendary) pokemons = pokemons.filter(p => p.legendary);
				if (beast) pokemons = pokemons.filter(p => p.ultra_beast);

				const pkmPerPage = 15;
				let pages = [];
				let embed = new MessageEmbed()
					.setAuthor(language.get(language.title), message.client.user.avatarURL())
					.setColor(message.guild.me.displayColor)
					.setDescription(language.no_pokemon);
				if (!pokemons.length) pages.push(embed);

				for (i = 0; i < pokemons.length; i += pkmPerPage) {
					embed = new MessageEmbed()
						.setAuthor(language.get(language.title), message.client.user.avatarURL())
						.setColor(message.guild.me.displayColor)
						.addField(language.most_caught_title, pokemons.slice(i, i + pkmPerPage).map((pkm, j) => {
							// pokedex.findPokemon(459): null
							const pokemon = pokedex.findPokemon(pkm.pokedex_id) || pokedex.findPokemon("Snover");
							return language.get(language.most_caught, i + j + 1, getPokemonName(pokemon, shiny, variation, languageCode), pkm.total);
						}).join("\n"));
					pages.push(embed);
				};
				
				pagination(message, pages).catch(err => {
					console.error(err);
					message.channel.send(language.errors.paginator).catch(console.error);
				});

			} else {
				const pokemon = pokedex.allPokemon().find(p => Object.values(p.names).some(name => name.toLowerCase() === pokemonName.toLowerCase()));
				if (!pokemon) return message.reply(language.invalid_pokemon).catch(console.error);

				let description = "", total = 0;

				const { "rows": normal } = (await message.client.pg.query(
					`
					SELECT SUM((value -> 'caught')::int) AS total
					FROM pokemons, jsonb_each(users)
					WHERE pokedex_id = $1 AND shiny = false AND variation = 'default'
					`,
					[ pokemon.national_id ]
				).catch(console.error)) || {};
				if (!normal) return message.channel.send(language.errors.database).catch(err => {
					console.error(err);
				});
				description += language.get(language.normal, parseInt(normal[0].total) || 0);
				total += parseInt(normal[0].total) || 0;

				const { "rows": shiny } = (await message.client.pg.query(
					`
					SELECT SUM((value -> 'caught')::int) AS total
					FROM pokemons, jsonb_each(users)
					WHERE pokedex_id = $1 AND shiny AND variation = 'default'
					`,
					[ pokemon.national_id ]
				).catch(console.error)) || {};
				if (!shiny) return message.channel.send(language.errors.database).catch(err => {
					console.error(err);
				});
				description += language.get(language.shiny, parseInt(shiny[0].total) || 0);
				total += parseInt(shiny[0].total) || 0;

				if (alolans.includes(pokemon.names.en)) {
					const { "rows": alolan } = (await message.client.pg.query(
						`
						SELECT SUM((value -> 'caught')::int) AS total
						FROM pokemons, jsonb_each(users)
						WHERE pokedex_id = $1 AND shiny = false AND variation = 'alolan'
						`,
						[ pokemon.national_id ]
					).catch(console.error)) || {};
					if (!alolan) return message.channel.send(language.errors.database).catch(err => {
						console.error(err);
					});
					description += language.get(language.alolan, parseInt(alolan[0].total) || 0);
					total += parseInt(alolan[0].total) || 0;

					const { "rows": alolanShiny } = (await message.client.pg.query(
						`
						SELECT SUM((value -> 'caught')::int) AS total
						FROM pokemons, jsonb_each(users)
						WHERE pokedex_id = $1 AND shiny AND variation = 'alolan'
						`,
						[ pokemon.national_id ]
					).catch(console.error)) || {};
					if (!alolanShiny) return message.channel.send(language.errors.database).catch(err => {
						console.error(err);
					});
					description += language.get(language.alolan_shiny, parseInt(alolanShiny[0].total) || 0);
					total += parseInt(alolanShiny[0].total) || 0;
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
			}

		} else {
			let description = "", total = 0;

			const { "rows": normal } = (await message.client.pg.query(
				`
				SELECT SUM((value -> 'caught')::int) AS total
				FROM pokemons, jsonb_each(users)
				WHERE shiny = false AND legendary = false AND ultra_beast = false AND variation = 'default'
				`
				).catch(console.error)) || {};
			if (!normal) return message.channel.send(language.errors.database).catch(err => {
				console.error(err);
			});
			description += language.get(language.normal, parseInt(normal[0].total) || 0);
			total += parseInt(normal[0].total) || 0;

			const { "rows": shiny } = (await message.client.pg.query(
				`
				SELECT SUM((value -> 'caught')::int) AS total
				FROM pokemons, jsonb_each(users)
				WHERE shiny AND legendary = false AND ultra_beast = false AND variation = 'default'
				`
				).catch(console.error)) || {};
			if (!shiny) return message.channel.send(language.errors.database).catch(err => {
				console.error(err);
			});
			description += language.get(language.shiny, parseInt(shiny[0].total) || 0);
			total += parseInt(shiny[0].total) || 0;

			const { "rows": legendary } = (await message.client.pg.query(
				`
				SELECT SUM((value -> 'caught')::int) AS total
				FROM pokemons, jsonb_each(users)
				WHERE shiny = false AND legendary AND ultra_beast = false AND variation = 'default'
				`
				).catch(console.error)) || {};
			if (!legendary) return message.channel.send(language.errors.database).catch(err => {
				console.error(err);
			});
			description += language.get(language.legendary, parseInt(legendary[0].total) || 0);
			total += parseInt(legendary[0].total) || 0;

			const { "rows": legendaryShiny } = (await message.client.pg.query(
				`
				SELECT SUM((value -> 'caught')::int) AS total
				FROM pokemons, jsonb_each(users)
				WHERE shiny AND legendary AND ultra_beast = false AND variation = 'default'
				`
				).catch(console.error)) || {};
			if (!legendaryShiny) return message.channel.send(language.errors.database).catch(err => {
				console.error(err);
			});
			description += language.get(language.legendary_shiny, parseInt(legendaryShiny[0].total) || 0);
			total += parseInt(legendaryShiny[0].total) || 0;

			const { "rows": beast } = (await message.client.pg.query(
				`
				SELECT SUM((value -> 'caught')::int) AS total
				FROM pokemons, jsonb_each(users)
				WHERE shiny = false AND legendary = false AND ultra_beast AND variation = 'default'
				`
				).catch(console.error)) || {};
			if (!beast) return message.channel.send(language.errors.database).catch(err => {
				console.error(err);
			});
			description += language.get(language.beast, parseInt(beast[0].total) || 0);
			total += parseInt(beast[0].total) || 0;

			const { "rows": beastShiny } = (await message.client.pg.query(
				`
				SELECT SUM((value -> 'caught')::int) AS total
				FROM pokemons, jsonb_each(users)
				WHERE shiny AND legendary = false AND ultra_beast AND variation = 'default'
				`
				).catch(console.error)) || {};
			if (!beastShiny) return message.channel.send(language.errors.database).catch(err => {
				console.error(err);
			});
			description += language.get(language.beast_shiny, parseInt(beastShiny[0].total) || 0);
			total += parseInt(beastShiny[0].total) || 0;

			const { "rows": alolan } = (await message.client.pg.query(
				`
				SELECT SUM((value -> 'caught')::int) AS total
				FROM pokemons, jsonb_each(users)
				WHERE shiny = false AND variation = 'alolan'
				`
				).catch(console.error)) || {};
			if (!alolan) return message.channel.send(language.errors.database).catch(err => {
				console.error(err);
			});
			description += language.get(language.alolan, parseInt(alolan[0].total) || 0);
			total += parseInt(alolan[0].total) || 0;

			const { "rows": alolanShiny } = (await message.client.pg.query(
				`
				SELECT SUM((value -> 'caught')::int) AS total
				FROM pokemons, jsonb_each(users)
				WHERE shiny AND variation = 'alolan'
				`
				).catch(console.error)) || {};
			if (!alolanShiny) return message.channel.send(language.errors.database).catch(err => {
				console.error(err);
			});
			description += language.get(language.alolan_shiny, parseInt(alolanShiny[0].total) || 0);
			total += parseInt(alolanShiny[0].total) || 0;

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
		}
	}
};

module.exports = command;