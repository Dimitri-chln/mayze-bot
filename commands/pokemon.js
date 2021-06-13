const { Message } = require("discord.js");

const command = {
	name: "pokemon",
	description: {
		fr: "Obtenir la liste des pokémons que tu as attrapés",
		en: "Get the list of all the pokémons you caught"
	},
	aliases: ["pokemons", "pkmn", "pkm", "poke"],
	args: 0,
	usage: "addfav <pokémon> | removefav <pokémon> | nick <pokémon> [<nickname>] | [<user>] [-favorite] [-legendary] [-beast] [-starter] [-shiny] [-alolan] [-id [<number>]] [-name <name>]",
	slashOptions: [
		{
			name: "addfav",
			description: "Add a pokémon to your favorites",
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
			name: "removefav",
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
		},
		{
			name: "nick",
			description: "Set a new nickname for one of your pokémons",
			type: 1,
			options: [
				{
					name: "pokemon",
					description: "The pokémon to rename",
					type: 3,
					required: true
				},
				{
					name: "nickname",
					description: "The new nickname of the pokémon. Leave blank to reset",
					type: 3,
					required: false
				}
			]
		},
		{
			name: "list",
			description: "Get the list of your pokémons",
			type: 1,
			options: [
				{
					name: "user",
					description: "A user to check the pokémons from",
					type: 6,
					required: false
				},
				{
					name: "favorite",
					description: "An option to only display favorites",
					type: 5,
					required: false
				},
				{
					name: "legendary",
					description: "An option to only display legendaries",
					type: 5,
					required: false
				},
				{
					name: "ultra-beast",
					description: "An option to only display ultra beasts",
					type: 5,
					required: false
				},
				{
					name: "starter",
					description: "An option to only display starters",
					type: 5,
					required: false
				},
				{
					name: "shiny",
					description: "An option to only display shinies",
					type: 5,
					required: false
				},
				{
					name: "alolan",
					description: "An option to only display alolans",
					type: 5,
					required: false
				},
				{
					name: "id",
					description: "An option to find a pokémon by its ID. To display IDs next to the pokémons, use the value 0",
					type: 4,
					required: false
				},
				{
					name: "name",
					description: "An option to find a pokémon by its name of nickname",
					type: 3,
					required: false
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
		const { MessageEmbed } = require("discord.js");
		const pokedex = require("oakdex-pokedex");
		const starters = require("../assets/starters.json");
		const pagination = require("../utils/pagination");

		const subCommand = args
			? args.length && ["addfav", "removefav", "nick"].includes(args[0].toLowerCase()) ? args[0].toLowerCase() : "list"
			: options[0].name;
		
		switch (subCommand) {
			case "addfav": {
				const pokemonName = args
					? args.slice(1).join(" ").toLowerCase().replace(/shiny|alolan/g, "").trim()
					: options[0].options[0].value.toLowerCase().replace(/shiny|alolan/g, "").trim();
				const shiny = args
					? args.includes("shiny")
					: options[0].options[0].value.toLowerCase().includes("shiny");
				const alolan = args
					? args.includes("alolan")
					: options[0].options[0].value.toLowerCase().includes("alolan");
				
				const pokemon = pokedex.allPokemon().find(pkm => Object.values(pkm.names).some(name => name.toLowerCase() === pokemonName));
				if (!pokemon) return message.reply(language.invalid_pokemon).catch(console.error);
				
				const { "rows": pokemons } = (await message.client.pg.query(`SELECT * FROM pokemons WHERE user_id = '${message.author.id}' AND pokedex_name = '${pokemon.names.en}' AND shiny = ${shiny} AND alolan = ${alolan}`).catch(console.error)) || {};
				if (!pokemons || !pokemons.length) return message.reply(language.pokemon_not_owned).catch(console.error);

				const res = await message.client.pg.query(`UPDATE pokemons SET favorite = true WHERE id = ${pokemons[0].id}`).catch(console.error);
				if (!res) return message.channel.send(language.errors.database).catch(console.error);
				if (!message.isInteraction) message.react("✅").catch(console.error);
				else message.reply(language.favorite_added).catch(console.error);
				break;
			}
			
			case "removefav": {
				const pokemonName = args
					? args.slice(1).join(" ").toLowerCase().replace(/shiny|alolan/g, "").trim()
					: options[0].options[0].value.toLowerCase().replace(/shiny|alolan/g, "").trim();
				const shiny = args
					? args.includes("shiny")
					: options[0].options[0].value.toLowerCase().includes("shiny");
				const alolan = args
					? args.includes("alolan")
					: options[0].options[0].value.toLowerCase().includes("alolan");
				
				const pokemon = pokedex.allPokemon().find(pkm => Object.values(pkm.names).some(name => name.toLowerCase() === pokemonName));
				if (!pokemon) return message.reply(language.invalid_pokemon).catch(console.error);
				
				const { "rows": pokemons } = (await message.client.pg.query(`SELECT * FROM pokemons WHERE user_id = '${message.author.id}' AND pokedex_name = '${pokemon.names.en}' AND shiny = ${shiny} AND alolan = ${alolan}`).catch(console.error)) || {};
				if (!pokemons || !pokemons.length) return message.reply(language.pokemon_not_owned).catch(console.error);

				const res = await message.client.pg.query(`UPDATE pokemons SET favorite = false WHERE id = ${pokemons[0].id}`).catch(console.error);
				if (!res) return message.channel.send(language.errors.database).catch(console.error);
				if (!message.isInteraction) message.react("✅").catch(console.error);
				else message.reply(language.favorite_removed).catch(console.error);
				break;
			}
			
			case "nick": {
				const pokemonName = args
					? args[1].toLowerCase().replace(/shiny|alolan/g, "").trim()
					: options[0].options[0].value.toLowerCase().replace(/shiny|alolan/g, "").trim();
				const shiny = args
					? args[1].toLowerCase().includes("shiny")
					: options[0].options[0].value.toLowerCase().includes("shiny");
				const alolan = args
					? args[1].toLowerCase().includes("alolan")
					: options[0].options[0].value.toLowerCase().includes("alolan");
				
				const nickname = args
					? args[2]
					: options[0].options[1] ? options[0].options[1].value : null;
				if (nickname && nickname.length > 30) return message.reply(language.nickname_too_long).catch(console.error);
				
				const pokemon = pokedex.allPokemon().find(pkm => Object.values(pkm.names).some(name => name.toLowerCase() === pokemonName));
				if (!pokemon) return message.reply(language.invalid_pokemon).catch(console.error);
				
				const { "rows": pokemons } = (await message.client.pg.query(`SELECT * FROM pokemons WHERE user_id = '${message.author.id}' AND pokedex_name = '${pokemon.names.en}' AND shiny = ${shiny} AND alolan = ${alolan}`).catch(console.error)) || {};
				if (!pokemons || !pokemons.length) return message.reply(language.pokemon_not_owned).catch(console.error);

				const res = await message.client.pg.query(`UPDATE pokemons SET nickname = ${nickname ? `'${nickname.replace(/'/g, "''")}'` : "NULL"} WHERE id = ${pokemons[0].id}`).catch(console.error);
				if (!res) return message.channel.send(language.errors.database).catch(console.error);
				if (!message.isInteraction) message.react("✅").catch(console.error);
				else message.reply(language.nickname_updated).catch(console.error);
				break;
			}
			
			case "list": {
				const user = args
					? message.mentions.users.first() || (args.length ? (message.client.findMember(message.guild, args[0]) || {}).user : null) || message.author
					: options[0].options && options[0].options.some(o => o.name === "user") ? message.guild.members.cache.get(options[0].options.find(o => o.name === "user").value).user : message.author;

				let { "rows": pokemons }  = (await message.client.pg.query(`SELECT * FROM pokemons WHERE user_id = '${user.id}' ORDER BY legendary DESC, ultra_beast DESC, shiny DESC, caught DESC, pokedex_id ASC`).catch(console.error)) || {};
				if (!pokemons) return message.channel.send(language.errors.database).catch(console.error);

				const params = args
					? parseParams(args)
					: options[0].options || [];

				if (hasParam(params, "favorite")) pokemons = pokemons.filter(p => p.favorite);
				if (hasParam(params, "legendary")) pokemons = pokemons.filter(p => p.legendary);
				if (hasParam(params, "ultra-beast")) pokemons = pokemons.filter(p => p.ultra_beast);
				if (hasParam(params, "starter")) pokemons = pokemons.filter(p => starters.includes(p.pokedex_name));
				if (hasParam(params, "shiny")) pokemons = pokemons.filter(p => p.shiny);
				if (hasParam(params, "alolan")) pokemons = pokemons.filter(p => p.alolan);
				if (hasParam(params, "id")) pokemons = hasParam(params, "id") ? pokemons.filter(p => p.pokedex_id === hasParam(params, "id")) : pokemons;
				if (hasParam(params, "name")) pokemons = pokemons.filter(p => new RegExp(hasParam(params, "name"), "i").test(pokedex.findPokemon(p.pokedex_id).names[languageCode].replace(/\u2642/, "m").replace(/\u2640/, "f")) || (p.nickname && new RegExp(hasParam(params, "name"), "i").test(p.nickname ? p.nickname : "")));

				const pkmPerPage = 15;
				let pages = [];
				let embed = new MessageEmbed()
					.setAuthor(language.get(language.title, user.tag), user.avatarURL({ dynamic: true }))
					.setColor(message.guild.me.displayColor)
					.setDescription(language.no_pokemon);
				if (!pokemons.length) pages.push(embed);

				let total = pokemons.reduce((sum, p) => sum + p.caught, 0);
				for (i = 0; i < pokemons.length; i += pkmPerPage) {
					embed = new MessageEmbed()
						.setAuthor(language.get(language.title, user.tag), user.avatarURL({ dynamic: true }))
						.setTitle(language.get(language.total, total, total > 1))
						.setColor(message.guild.me.displayColor)
						.setDescription(pokemons.slice(i, i + pkmPerPage).map(p => language.get(language.description, p.legendary, p.shiny, pokedex.findPokemon(p.pokedex_id).names[languageCode], hasParam(params, "id") === 0 ? `#${p.pokedex_id}` : "", p.caught, p.caught > 1 ? "s" : "", p.favorite, p.ultra_beast, `https~d//pokemon.com/${languageCode === "en" ? "us" : languageCode}/pokedex/${pokedex.findPokemon(p.pokedex_id).names[languageCode].toLowerCase().replace(/[:\.']/g, "").replace(/\s/g, "-").replace(/\u2642/, "-male").replace(/\u2640/, "-female")}`, p.nickname ? p.nickname.replace(/:/g, "~d").replace(/\?/g, "~q") : null, p.alolan)).join("\n"));
						if (pokemons.length === 1) embed.setThumbnail(pokemons[0].shiny && !pokemons[0].alolan ? `https://img.pokemondb.net/sprites/home/shiny/${pokemons[0].pokedex_name.toLowerCase().replace(/\u2642/, "-m").replace(/\u2640/, "-f")}.png` : `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${(`00${pokemons[0].pokedex_id}`).substr(-3)}${pokemons[0].alolan ? "_f2" : ""}.png`);
					pages.push(embed);
				};
				
				pagination(message, pages).catch(err => {
					console.error(err);
					message.channel.send(language.errors.paginator).catch(console.error);
				});

				function parseParams(args) {
					const paramList = [];

					if (args.includes("-favorite") || args.includes("-fav")) paramList.push({ name: "favorite", value: true });
					if (args.includes("-legendary") || args.includes("-leg")) paramList.push({ name: "legendary", value: true });
					if (args.includes("-beast") || args.includes("-ub")) paramList.push({ name: "ultra-beast", value: true });
					if (args.includes("-starter")) paramList.push({ name: "starter", value: true });
					if (args.includes("-shiny")) paramList.push({ name: "shiny", value: true });
					if (args.includes("-alolan")) paramList.push({ name: "alolan", value: true });
					if (args.includes("-id")) paramList.push({ name: "id", value: parseInt(args[args.indexOf("-id") + 1]) || 0 });
					if (args.includes("-name")) paramList.push({ name: "name", value: args[args.indexOf("-name") + 1] });

					return paramList;
				}

				function hasParam(params, param) {
					let p = params.find(p => p.name === param && (p.value === 0 || p.value));
					if (p) return p.value;
					return false;
				}
				break;
			}
			
			default:
				message.reply(language.errors.invalid_args).catch(console.error);
		}
	}
}

module.exports = command;