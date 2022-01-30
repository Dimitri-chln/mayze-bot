import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";

import Pokedex from "../../types/pokemon/Pokedex";



const command: Command = {
	name: "stats",
	description: {
		fr: "Obtenir des statistiques sur le bot",
		en: "Get statistics about the bot"
	},
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],
	
	options: {
		fr: [
			{
				name: "pokemons",
				description: "Obtenir des statistiques sur les pokémons",
				type: "SUB_COMMAND_GROUP",
				options: [
					{
						name: "about",
						description: "Obtenir les statistiques d'un pokémon",
						type: "SUB_COMMAND",
						options: [
							{
								name: "pokemon",
								description: "Le pokémon dont tu veux voir les statistiques",
								type: "STRING",
								required: true
							}
						]
					},
					{
						name: "caught",
						description: "Voir le classement des pokémons les plus attrapés",
						type: "SUB_COMMAND",
						options: [
							{
								name: "shiny",
								description: "Ne garder que les pokémons shiny",
								type: "BOOLEAN",
								required: false
							},
							{
								name: "legendary",
								description: "Ne garder que les pokémons légendaires",
								type: "BOOLEAN",
								required: false
							},
							{
								name: "ultra-beast",
								description: "Ne garder que les chimères",
								type: "BOOLEAN",
								required: false
							},
							{
								name: "alola",
								description: "Ne garder que les pokémons d'Alola",
								type: "BOOLEAN",
								required: false
							},
							{
								name: "mega",
								description: "Ne garder que les pokémons méga",
								type: "BOOLEAN",
								required: false
							}
						]
					}
				]
			}
		],
		en: [
			{
				name: "pokemons",
				description: "Get statistics about pokémons",
				type: "SUB_COMMAND_GROUP",
				options: [
					{
						name: "about",
						description: "Get statistics about one pokémon",
						type: "SUB_COMMAND",
						options: [
							{
								name: "pokemon",
								description: "The pokémon whose statistics to get",
								type: "STRING",
								required: true
							}
						]
					},
					{
						name: "caught",
						description: "See the ranking of the most caught pokémons",
						type: "SUB_COMMAND",
						options: [
							{
								name: "shiny",
								description: "Keep shiny pokémons only",
								type: "BOOLEAN",
								required: false
							},
							{
								name: "legendary",
								description: "Keep legendary pokémons only",
								type: "BOOLEAN",
								required: false
							},
							{
								name: "ultra-beast",
								description: "Keep ultra beasts only",
								type: "BOOLEAN",
								required: false
							},
							{
								name: "alola",
								description: "Keep alolan pokémons only",
								type: "BOOLEAN",
								required: false
							},
							{
								name: "mega",
								description: "Keep mega pokémons only",
								type: "BOOLEAN",
								required: false
							}
						]
					}
				]
			}
		]
	},

	run: async (interaction: CommandInteraction, translations: Translations) => {
		const subCommandGroup = interaction.options.getSubcommandGroup();
		
		switch (subCommandGroup) {
			case "pokemons": {
				const subCommand = interaction.options.getSubcommand();

				switch (subCommand) {
					case "about": {
						break;
					}

					case "caught": {
						break;
					}
				}
				break;
			}
		}

		if (pokemonName) {
			if (args[0].toLowerCase() === "caught") {
				let { "rows": pokemons } = (await message.client.database.query(
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
					? 
						  args.includes("-alolan") ? "alolan"
						: args.includes("-mega") ? "mega" : "default"
					: 
						"default";

				pokemons = pokemons.filter(p => p.shiny === shiny);
				pokemons = pokemons.filter(p => p.variation === variation);
				if (legendary) pokemons = pokemons.filter(p => p.legendary);
				if (beast) pokemons = pokemons.filter(p => p.ultra_beast);

				const pkmPerPage = 15;
				let pages = [];
				let embed = new MessageEmbed()
					.setAuthor(language.get(language.title), message.client.user.displayAvatarURL())
					.setColor(message.guild.me.displayColor)
					.setDescription(language.no_pokemon);
				if (!pokemons.length) pages.push(embed);

				for (i = 0; i < pokemons.length; i += pkmPerPage) {
					embed = new MessageEmbed()
						.setAuthor(language.get(language.title), message.client.user.displayAvatarURL())
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

				const { "rows": normal } = (await message.client.database.query(
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

				const { "rows": shiny } = (await message.client.database.query(
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
					const { "rows": alolan } = (await message.client.database.query(
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

					const { "rows": alolanShiny } = (await message.client.database.query(
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

				if (Object.keys(megas).includes(pokemon.names.en)) {
					const { "rows": mega } = (await message.client.database.query(
						`
						SELECT SUM((value -> 'caught')::int) AS total
						FROM pokemons, jsonb_each(users)
						WHERE pokedex_id = $1 AND shiny = false AND variation = ANY('{ "mega", "megax", "megay", "primal" }')
						`,
						[ pokemon.national_id ]
					).catch(console.error)) || {};
					if (!mega) return message.channel.send(language.errors.database).catch(err => {
						console.error(err);
					});
					description += language.get(language.mega, parseInt(mega[0].total) || 0);
					total += parseInt(mega[0].total) || 0;

					const { "rows": megaShiny } = (await message.client.database.query(
						`
						SELECT SUM((value -> 'caught')::int) AS total
						FROM pokemons, jsonb_each(users)
						WHERE pokedex_id = $1 AND shiny AND variation = ANY('{ "mega", "megax", "megay", "primal" }')
						`,
						[ pokemon.national_id ]
					).catch(console.error)) || {};
					if (!megaShiny) return message.channel.send(language.errors.database).catch(err => {
						console.error(err);
					});
					description += language.get(language.mega_shiny, parseInt(megaShiny[0].total) || 0);
					total += parseInt(megaShiny[0].total) || 0;
				}

				description += language.get(language.total, total);

				message.channel.send({
					embed: {
						author: {
							name: language.title,
							iconURL: message.client.user.displayAvatarURL()
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

			const { "rows": normal } = (await message.client.database.query(
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

			const { "rows": shiny } = (await message.client.database.query(
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

			const { "rows": legendary } = (await message.client.database.query(
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

			const { "rows": legendaryShiny } = (await message.client.database.query(
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

			const { "rows": beast } = (await message.client.database.query(
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

			const { "rows": beastShiny } = (await message.client.database.query(
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

			const { "rows": alolan } = (await message.client.database.query(
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

			const { "rows": alolanShiny } = (await message.client.database.query(
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

			const { "rows": mega } = (await message.client.database.query(
				`
				SELECT SUM((value -> 'caught')::int) AS total
				FROM pokemons, jsonb_each(users)
				WHERE shiny = false AND variation = ANY('{ "mega", "megax", "megay", "primal" }')
				`
				).catch(console.error)) || {};
			if (!mega) return message.channel.send(language.errors.database).catch(err => {
				console.error(err);
			});
			description += language.get(language.mega, parseInt(mega[0].total) || 0);
			total += parseInt(mega[0].total) || 0;

			const { "rows": megaShiny } = (await message.client.database.query(
				`
				SELECT SUM((value -> 'caught')::int) AS total
				FROM pokemons, jsonb_each(users)
				WHERE shiny AND variation = ANY('{ "mega", "megax", "megay", "primal" }')
				`
				).catch(console.error)) || {};
			if (!megaShiny) return message.channel.send(language.errors.database).catch(err => {
				console.error(err);
			});
			description += language.get(language.mega_shiny, parseInt(megaShiny[0].total) || 0);
			total += parseInt(megaShiny[0].total) || 0;

			description += language.get(language.total, total);

			message.channel.send({
				embed: {
					author: {
						name: language.title,
						iconURL: message.client.user.displayAvatarURL()
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