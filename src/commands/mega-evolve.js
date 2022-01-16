const { Message } = require("discord.js");

const command = {
	name: "mega-evolve",
	description: {
		fr: "Voir tes méga gemmes",
		en: "See your mega gems"
	},
	aliases: ["megaevolve", "mega"],
	args: 0,
	usage: "[<pokemon>]",
	botPerms: ["ADD_REACTIONS"],
	category: "pokémon",
	options: [
		{
			name: "pokemon",
			description: "The pokémon to mega evolve",
			type: 3,
			required: false
		}
	],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	run: async (message, args, options, language, languageCode) => {
		const pokedex = require("oakdex-pokedex");
		const megas = require("../assets/mega.json");
		const { getPokemonName, getCleanName, getPokemonImage } = require("../utils/pokemonInfo");

		const res = await message.client.database.query(
			"SELECT * FROM mega_gems WHERE user_id = $1",
			[ message.author.id ]
		).catch(console.error);
		if (!res) return message.channel.send(language.errors.database).catch(console.error);

		const gems = res.rows[0]?.gems ?? {};

		const pokemon = args
			? pokedex.allPokemon().find(pkm => Object.values(pkm.names).some(n => n.replace(/\u2642/, "m").replace(/\u2640/, "f") === getCleanName(args.join(" "))))
			: options ? pokedex.allPokemon().find(pkm => Object.values(pkm.names).some(n => n.replace(/\u2642/, "m").replace(/\u2640/, "f") === getCleanName(options[0].value))) : null;
		
		if (pokemon) {
			const shiny = args
				? args.includes("shiny")
				: options && options[0].value.includes("shiny");
			const xy = args
				? args.join(" ").toLowerCase().match(/(?:x|y)$/)?.[0]
				: options[0].value.toLowerCase().match(/(?:x|y)$/)?.[0];

			if (!Object.keys(megas).includes(pokemon.names.en)) return message.reply(language.not_mega_evolvable).catch(console.error);

			const { "rows": pokemons } = (await message.client.database.query(
				"SELECT * FROM pokemons WHERE pokedex_id = $1 AND shiny = $2 AND variation = 'default' AND users ? $3",
				[ pokemon.national_id, shiny, message.author.id ]
			).catch(console.error)) || {};
			if (!pokemons || !pokemons.length) return message.reply(language.pokemon_not_owned).catch(console.error);

			const megaGem =
				megas[pokemon.names.en].types?.mega ||
				(xy === "x" ? megas[pokemon.names.en].types?.megax : null) ||
				(xy === "y" ? megas[pokemon.names.en].types?.megay : null) ||
				megas[pokemon.names.en].types?.primal ||
				megas[pokemon.names.en].types?.other;
			
			if (!megaGem) return message.reply(language.xy).catch(console.error);
			
			if (!gems[megaGem.en]) return message.reply(language.get(language.no_mega_gem, megaGem[languageCode])).catch(console.error);

			message.client.database.query(
				`
				UPDATE mega_gems
				SET gems =
					CASE
						WHEN (gems -> $1)::int = 1 THEN gems - $1
						ELSE jsonb_set(gems, '{${megaGem.en}}', ((gems -> $1)::int - 1)::text::jsonb)
					END
				WHERE user_id = $2
				`,
				[ megaGem.en, message.author.id ]
			).catch(console.error);

			const defaultData = {};
			defaultData[message.author.id] = { caught: 1, favorite: false, nickname: null };
			const defaultUserData = { caught: 1, favorite: false, nickname: null };

			message.client.database.query(
				`
				INSERT INTO pokemons VALUES ($1, $2, $3, $4, $5, $6, $7)
				ON CONFLICT (pokedex_id, shiny, variation)
				DO UPDATE SET users =
					CASE
						WHEN pokemons.users -> $8 IS NULL THEN jsonb_set(pokemons.users, '{${message.author.id}}', $9)
						ELSE jsonb_set(pokemons.users, '{${message.author.id}, caught}', ((pokemons.users -> $8 -> 'caught')::int + 1)::text::jsonb)
					END
				WHERE pokemons.pokedex_id = EXCLUDED.pokedex_id AND pokemons.shiny = EXCLUDED.shiny AND pokemons.variation = EXCLUDED.variation
				`,
				[ pokemon.national_id, pokemon.names.en, shiny, pokemons[0].legendary, pokemons[0].ultra_beast, getMegaType(pokemon, megaGem), defaultData, message.author.id, defaultUserData ]
			).catch(console.error);

			message.client.database.query(
				`
				UPDATE pokemons
				SET users =
					CASE
						WHEN (users -> $1 -> 'caught')::int = 1 THEN users - $1
						ELSE jsonb_set(users, '{${message.author.id}, caught}', ((users -> $1 -> 'caught')::int - 1)::text::jsonb)
					END
				WHERE pokedex_id = $2 AND shiny = $3 AND variation = $4
				`,
				[ message.author.id, pokemon.national_id, shiny, "default" ]
			).catch(console.error);

			const msg = await message.channel.send({
				embed: {
					author: {
						name: language.get(language.evolving_title, message.author.tag),
						iconURL: message.author.displayAvatarURL({ dynamic: true })
					},
					color: message.guild.me.displayColor,
					thumbnail: {
						url: getPokemonImage(pokemon, shiny, "default")
					},
					description: language.get(language.evolving, getPokemonName(pokemon, shiny, "default", languageCode))
				}
			}).catch(console.error);
			if (!msg) return message.channel.send(language.errors.message_send).catch(console.error);

			setTimeout(() => {
				msg.edit(
					msg.embeds[0]
						.setThumbnail(getPokemonImage(pokemon, shiny, getMegaType(pokemon, megaGem)))
						.setDescription(language.get(language.evolved, getPokemonName(pokemon, shiny, "default", languageCode), getPokemonName(pokemon, shiny, getMegaType(pokemon, megaGem), languageCode)))
				).catch(console.error);
			}, 3000);

		} else {
			const gemList = groupArr(Object.entries(gems), 2);
	
			message.channel.send({
				embed: {
					author: {
						name: language.get(language.title, message.author.tag),
						iconURL: message.author.displayAvatarURL({ dynamic: true })
					},
					color: message.guild.me.displayColor,
					description: `\`\`\`\n${gemList.map(group => group.map(([ gem, number ]) => `${findGem(gem)} ×${number}`.padEnd(20, " ")).join(" ")).join("\n")}\n\`\`\``,
					footer: {
						text: "✨ Mayze ✨"
					}
				}
			}).catch(console.error);
		}

		function getMegaType(pokemon, gem) {
			const megaTypes = megas[pokemon.names.en].types;

			return megaTypes.mega === gem ? "mega"
				: megaTypes.megax === gem ? "megax"
				: megaTypes.megay === gem ? "megay"
				: megaTypes.primal === gem ? "primal"
				: "mega";
		}

		function groupArr(data, n) {
			var group = [];
			for (var i = 0, j = 0; i < data.length; i++) {
				if (i >= n && i % n === 0)
					j++;
				group[j] = group[j] || [];
				group[j].push(data[i])
			}
			return group;
		}

		function findGem(gem) {
			if (Object.values(megas).some(megaPokemon => megaPokemon.types.mega?.en === gem)) return Object.values(megas).find(megaPokemon => megaPokemon.types.mega?.en === gem).types.mega[languageCode];
			if (Object.values(megas).some(megaPokemon => megaPokemon.types.megax?.en === gem)) return Object.values(megas).find(megaPokemon => megaPokemon.types.megax?.en === gem).types.megax[languageCode];
			if (Object.values(megas).some(megaPokemon => megaPokemon.types.megay?.en === gem)) return Object.values(megas).find(megaPokemon => megaPokemon.types.megay?.en === gem).types.megay[languageCode];
			if (Object.values(megas).some(megaPokemon => megaPokemon.types.primal?.en === gem)) return Object.values(megas).find(megaPokemon => megaPokemon.types.primal?.en === gem).types.primal[languageCode];
			if (Object.values(megas).some(megaPokemon => megaPokemon.types.other?.en === gem)) return Object.values(megas).find(megaPokemon => megaPokemon.types.other?.en === gem).types.other[languageCode];

			return "Unknown gem";
		}
	}
};

module.exports = command;