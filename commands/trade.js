const { Message, User } = require("discord.js");

const command = {
	name: "trade",
	description: {
		fr: "Echanger des pokémons avec d'autres utilisateurs",
		en: "Trade pokémons with other users"
	},
	aliases: [],
	args: 2,
	usage: "block <user> [<duration>] | unblock <user> | [<pokémon to offer>], [<pokémon to offer>]... <user> [<pokémon to ask for>], [<pokémon to ask for>]...",
	botPerms: ["EMBED_LINKS", "ADD_REACTIONS", "MANAGE_MESSAGES"],
	cooldown: 15,
	slashOptions: [
		{
			name: "start",
			description: "Start a trade with someone",
			type: 1,
			options: [
				{
					name: "user",
					description: "The user to trade with",
					type: 6,
					required: true
				},
				{
					name: "pokemons-offer",
					description: "The pokémons to offer",
					type: 3,
					required: false
				},
				{
					name: "pokemons-demand",
					description: "The pokémons to ask for",
					type: 3,
					required: false
				}
			]
		},
		{
			name: "block",
			description: "Block a user from trading with you",
			type: 1,
			options: [
				{
					name: "user",
					description: "The user to block",
					type: 6,
					required: true
				},
				{
					name: "duration",
					description: "The duration to block the user for (e.g. 2d12h)",
					type: 3,
					required: false
				}
			]
		},
		{
			name: "unblock",
			description: "Unblock a user from trading with you",
			type: 1,
			options: [
				{
					name: "user",
					description: "The user to unblock",
					type: 6,
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
		const dhms = require("dhms");
		const timeToString = require("../utils/timeToString");
		const pokedex = require("oakdex-pokedex");
		const legendaries = require("../assets/legendaries.json");
		const beasts = require("../assets/ultra-beasts.json");
		const { getPokemonName, getPokemonVariation } = require("../utils/pokemonInfo");
		const { TRADE_LOG_CHANNEL_ID } = require("../config.json");
		const logChannel = message.client.channels.cache.get(TRADE_LOG_CHANNEL_ID);

		/**
		 * @typedef {object} OfferOrDemand
		 * @property {pokedex.Pokemon} data
		 * @property {number} number
		 * @property {boolean} shiny
		 * @property {"default" | "alolan" | "mega" | "megax" | "megay" | "primal"} variation
		 * @property {boolean} legendary
		 * @property {boolean} ultra_beast
		 * */

		const subCommand = args
			? ["block", "unblock"].includes(args[0].toLowerCase()) ? args[0].toLowerCase() : "start"
			: options[0].name;
		
		const user = args
			? message.mentions.users.first()
			: message.guild.members.cache.get(options[0].options[0].value).user;
		if (!user) return message.reply(language.invalid_user).catch(console.error);
		if (user.id === message.author.id) return message.reply(language.same_user).catch(console.error);

		switch (subCommand) {
			case "block":
				const duration = args
					? dhms(args[2])
					: dhms(options[0].options[1] ? options[0].options[1].value : null);

				const res = (await message.client.pg.query(`SELECT * FROM trade_block WHERE user_id = '${message.author.id}' AND blocked_user_id = '${user.id}'`).catch(console.error));
				if (!res) return message.channel.send(language.errors.database).catch(console.error);
				
				if (res.rows.length && duration) {
					message.client.pg.query(`UPDATE trade_block SET expires_at = '${new Date(Date.now() + duration).toISOString()}'`)
						.then(() => message.channel.send(language.get(language.blocked, user.tag, timeToString(duration / 1000, languageCode))).catch(console.error))
						.catch(err => {
							console.error(err);
							message.channel.send(language.errors.database).catch(console.error);
						});
				} else {
					message.client.pg.query(`INSERT INTO trade_block (user_id, blocked_user_id${duration ? `, expires_at` : ""}) VALUES ('${message.author.id}', '${user.id}'${duration ? `, '${new Date(Date.now() + duration).toISOString()}'` : ""})`)
						.then(() => message.channel.send(language.get(language.blocked, user.tag, timeToString(duration / 1000, languageCode))).catch(console.error))
						.catch(err => {
							console.error(err);
							message.channel.send(language.errors.database).catch(console.error);
						});
				}
				break;
			
			case "unblock":
				message.client.pg.query(`DELETE FROM trade_block WHERE user_id = '${message.author.id}' AND blocked_user_id = '${user.id}'`)
					.then(() => message.channel.send(language.get(language.unblocked, user.tag)).catch(console.error))
					.catch(err => {
						console.error(err);
						message.channel.send(language.errors.database).catch(console.error);
					});
				break;
			
			case "start":
				const { "rows": blocked } = (await message.client.pg.query(`SELECT * FROM trade_block WHERE user_id = '${user.id}' AND blocked_user_id = '${message.author.id}'`).catch(console.error)) || {};
				if (!blocked) return message.channel.send(language.errors.database).catch(console.error);
				if (blocked.length) return message.reply(language.get(language.not_allowed, user.tag)).catch(console.error);

				/**@type {OfferOrDemand[]} */
				let offer = args
					? args.join(" ").split(new RegExp(`<@!?${user.id}>`))[0].trim().split(/, */).filter(a => a)
					: options[0].options.find(o => o.name === "pokemons-offer") ? options[0].options.find(o => o.name === "pokemons-offer").value.split(/,(?: *)?/) : [];
				/**@type {OfferOrDemand[]} */
				let demand = args
					? args.join(" ").split(new RegExp(`<@!?${user.id}>`))[1].trim().split(/, */).filter(a => a)
					: options[0].options.find(o => o.name === "pokemons-demand") ? options[0].options.find(o => o.name === "pokemons-demand").value.split(/,(?: *)?/) : [];
				
				if (!offer.length && !demand.length) return message.reply(language.empty_trade).catch(console.error);

				let error = "";

				offer = offer.map(input => {
					const name = input.replace(/^\d+ *|alolan|mega|\bx\b|\by\b|primal|shiny| *(= *|#)\d+$/ig, "").trim();
					const number = parseInt((input.match(/^(\d+) *| *(?:= *|#)(\d+)$/) || []).filter(a => a)[1]) || 1;
					const shiny = /shiny/i.test(input);
					const variation = getPokemonVariation(input.replace(/^(\d+) *| *(?:= *|#)(\d+)$/g, ""));
					const pokemon = pokedex.allPokemon().find(pkm => Object.values(pkm.names).some(n => n.toLowerCase().replace(/\u2642/, "m").replace(/\u2640/, "f") === name.toLowerCase()));

					if (pokemon) return { data: pokemon, number, shiny, variation, legendary: legendaries.includes(pokemon.names.en), ultra_beast: beasts.includes(pokemon.names.en) };
					else error += language.get(language.invalid_pkm, name);
				}).filter(p => p).filter((v, i, a) => a.findIndex(u => u.data.national_id === v.data.national_id && u.shiny === v.shiny && u.variation === v.variation) === i);

				demand = demand.map(input => {
					const name = input.replace(/^\d+ *|alolan|mega|\bx\b|\by\b|primal|shiny| *(= *|#)\d+$/ig, "").trim();
					const number = parseInt((input.match(/^(\d+) *| *(?:= *|#)(\d+)$/) || []).filter(a => a)[1]) || 1;
					const shiny = /shiny/i.test(input);
					const variation = getPokemonVariation(input.replace(/^(\d+) *| *(?:= *|#)(\d+)$/g, ""));
					const pokemon = pokedex.allPokemon().find(pkm => Object.values(pkm.names).some(n => n.toLowerCase().replace(/\u2642/, "m").replace(/\u2640/, "f") === name.toLowerCase()));

					if (pokemon) return { data: pokemon, number, shiny, variation, legendary: legendaries.includes(pokemon.names.en), ultra_beast: beasts.includes(pokemon.names.en) };
					else error += language.get(language.invalid_pkm, name);
				}).filter(p => p).filter((v, i, a) => a.findIndex(u => u.data.national_id === v.data.national_id && u.shiny === v.shiny && u.variation === v.variation) === i);
				
				if (error) return message.channel.send(error);

				const errors = await checkValidPokemons(message.author, offer, user, demand);
				if (errors) return message.channel.send(errors).catch(console.error);

				const msg = await message.channel.send({
					content: user.toString(),
					embed: {
						author: {
							name: language.get(language.title, message.author.tag, user.tag),
							icon_url: message.author.avatarURL({ dynamic: true })
						},
						color: message.guild.me.displayColor,
						fields: [
							{
								name: language.get(language.offer, message.author.username),
								value: `\`\`\`\n${offer.map(pkm => `×${pkm.number} ${getPokemonName(pkm.data, pkm.shiny, pkm.variation, languageCode)}`).join("\n") || "Ø"}\n\`\`\``,
								inline: true
							},
							{
								name: language.get(language.demand, user.username),
								value: `\`\`\`\n${demand.map(pkm => `×${pkm.number} ${getPokemonName(pkm.data, pkm.shiny, pkm.variation, languageCode)}`).join("\n") || "Ø"}\n\`\`\``,
								inline: true
							}
						],
						footer: {
							text: "✨ Mayze ✨" + language.footer
						}
					}
				}).catch(console.error);
				await msg.react("✅").catch(console.error);
				await msg.react("❌").catch(console.error);

				const filter = (reaction, rUser) => [message.author.id, user.id].includes(rUser.id) && ["✅", "❌"].includes(reaction.emoji.name);
				const collector = msg.createReactionCollector(filter, { time: 60000 });
				let cancel, accepted = [false, false];

				collector.on("collect", async (reaction, rUser) => {
					if (reaction.emoji.name === "❌") {
						cancel = rUser.username;
						collector.stop();
					} else {
						let index = rUser.id === message.author.id ? 0 : 1;
						let field = msg.embeds[0].fields[index];
						field.name = field.name.replace(/ ✅$/, "") + " ✅";
						msg.edit(msg.embeds[0].spliceFields(index, 1, field)).catch(console.error);
						accepted[index] = true;

						if (accepted.every(v => v)) collector.stop();
					}
				});

				collector.on("end", async () => {
					msg.reactions.removeAll().catch(console.error);
					if (!accepted.every(v => v)) return message.channel.send(language.get(language.cancelled, cancel)).catch(console.error);
					
					const errorsNew = await checkValidPokemons(message.author, offer, user, demand);
					if (errorsNew) return message.channel.send(errorsNew).catch(console.error);
					
					let offerSuccess = [];
					for (const pkm of offer) {						
						const defaultUserData = { caught: pkm.number, favorite: false, nickname: null };
						const s = [];

						message.client.pg.query(
							`
							UPDATE pokemons
							SET users =
								CASE
									WHEN (users -> $1 -> 'caught')::int = $2 THEN users - $1
									ELSE jsonb_set(users, '{${message.author.id}, caught}', ((users -> $1 -> 'caught')::int - $2)::text::jsonb)
								END
							WHERE pokedex_id = $3 AND shiny = $4 AND variation = $5
							`,
							[ message.author.id, pkm.number, pkm.data.national_id, pkm.shiny, pkm.variation ]
						)
							.then(() => s.push(1))
							.catch(err => {
								console.error(err);
								s.push(0);
							});
						
						message.client.pg.query(
							`
							UPDATE pokemons
							SET users =
								CASE
									WHEN users -> $1 IS NULL THEN jsonb_set(users, '{${user.id}}', $3)
									ELSE jsonb_set(users, '{${user.id}, caught}', ((users -> $1 -> 'caught')::int + $2)::text::jsonb)
								END
							WHERE pokedex_id = $4 AND shiny = $5 AND variation = $6
							`,
							[ user.id, pkm.number, defaultUserData, pkm.data.national_id, pkm.shiny, pkm.variation ]
						)
							.then(() => s.push(1))
							.catch(err => {
								console.error(err);
								s.push(0);
							});
						
						offerSuccess.push(s);
					}

					let demandSuccess = [];
					for (const pkm of demand) {
						const defaultUserData = { caught: pkm.number, favorite: false, nickname: null };
						const s = [];
						
						message.client.pg.query(
							`
							UPDATE pokemons
							SET users =
								CASE
									WHEN (users -> $1 -> 'caught')::int = $2 THEN users - $1
									ELSE jsonb_set(users, '{${user.id}, caught}', ((users -> $1 -> 'caught')::int - $2)::text::jsonb)
								END
							WHERE pokedex_id = $3 AND shiny = $4 AND variation = $5
							`,
							[ user.id, pkm.number, pkm.data.national_id, pkm.shiny, pkm.variation ]
						)
							.then(() => s.push(1))
							.catch(err => {
								console.error(err);
								s.push(0);
							});
						
						message.client.pg.query(
							`
							UPDATE pokemons
							SET users =
								CASE
									WHEN users -> $1 IS NULL THEN jsonb_set(users, '{${message.author.id}}', $3)
									ELSE jsonb_set(users, '{${message.author.id}, caught}', ((users -> $1 -> 'caught')::int + $2)::text::jsonb)
								END
							WHERE pokedex_id = $4 AND shiny = $5 AND variation = $6
							`,
							[ message.author.id, pkm.number, defaultUserData, pkm.data.national_id, pkm.shiny, pkm.variation ]
						)
							.then(() => s.push(1))
							.catch(err => {
								console.error(err);
								s.push(0);
							});
						
						demandSuccess.push(s);
					}

					// Dummy request to await all other ones
					await message.client.pg.query("SELECT pokedex_id FROM pokemons WHERE pokedex_id = 0").catch(console.error);
					
					logChannel.send({
						embed: {
							author: {
								name: `${message.author.tag} / ${user.tag}`,
								url: msg.url,
								icon_url: message.guild.iconURL({ dynamic: true })
							},
							color: 65793,
							fields: [
								{
									name: "Offer:",
									value: `\`\`\`\n${offer.map((pkm, i) => `×${pkm.number} ${getPokemonName(pkm.data, pkm.shiny, pkm.variation, languageCode)} - ${offerSuccess[i].map(s => ["❌", "✅"][s]).join(" ")}`).join("\n") || "Ø"}\n\`\`\``,
									inline: true
								},
								{
									name: "Demand:",
									value: `\`\`\`\n${demand.map((pkm, i) => `×${pkm.number} ${getPokemonName(pkm.data, pkm.shiny, pkm.variation, languageCode)} - ${demandSuccess[i].map(s => ["❌", "✅"][s]).join(" ")}`).join("\n") || "Ø"}\n\`\`\``,
									inline: true
								}
							],
							footer: {
								text: "✨ Mayze ✨"
							}
						}
					}).catch(console.error);

					message.channel.send(language.trade_complete).catch(console.error);
				});
				break;
			
			default:
				message.reply(language.errors.invalid_args).catch(console.error);
		}



		/**
		 * @param {User} user1 
		 * @param {OfferOrDemand[]} pokemons1 
		 * @param {OfferOrDemand[]} pokemons2 
		 * @returns {Promise<?string>}
		 */
		async function checkValidPokemons(user1, pokemons1, user2, pokemons2) {
			const { "rows": user1Pokemons } = (await message.client.pg.query(`SELECT * FROM pokemons WHERE users ? '${user1.id}'`).catch(console.error)) || {};
			const { "rows": user2Pokemons } = (await message.client.pg.query(`SELECT * FROM pokemons WHERE users ? '${user2.id}'`).catch(console.error)) || {};

			let errors1 = [], errors1fav = [];
			for (const pokemon of pokemons1) {
				let pkm = user1Pokemons.find(p => p.pokedex_id === pokemon.data.national_id && p.shiny === pokemon.shiny && p.variation === pokemon.variation);
				if (!pkm || pokemon.number > pkm.users[user1.id].caught) errors1.push(`**${pokemon.number - (pkm?.users?.[user1.id]?.caught ?? 0)} ${getPokemonName(pokemon.data, pokemon.shiny, pokemon.variation, languageCode)}**`);
				if (pkm && pkm.users[user1.id].favorite) errors1fav.push(`**${getPokemonName(pokemon.data, pokemon.shiny, pokemon.variation, languageCode)}**`);
			}

			let errors2 = [], errors2fav = [];
			for (const pokemon of pokemons2) {
				let pkm = user2Pokemons.find(p => p.pokedex_id === pokemon.data.national_id && p.shiny === pokemon.shiny && p.variation === pokemon.variation);
				if (!pkm || pokemon.number > pkm.users[user2.id].caught) errors2.push(`**${pokemon.number - (pkm?.users?.[user2.id]?.caught ?? 0)} ${getPokemonName(pokemon.data, pokemon.shiny, pokemon.variation, languageCode)}**`);
				if (pkm && pkm.users[user2.id].favorite) errors2fav.push(`**${getPokemonName(pokemon.data, pokemon.shiny, pokemon.variation, languageCode)}**`);
			}

			errors1 = errors1.length ? language.get(language.not_enough_pkm, user1.username, errors1.join(", ")) : "";
			errors2 = errors2.length ? language.get(language.not_enough_pkm, user2.username, errors2.join(", ")) : "";
			errors1fav = errors1fav.length ? language.get(language.fav_pokemon, user1.username, errors1fav.join(", "), errors1fav.length > 1) : "";
			errors2fav = errors2fav.length ? language.get(language.fav_pokemon, user2.username, errors2fav.join(", "), errors2fav.length > 1) : "";

			return (errors1 + errors1fav + errors2 + errors2fav) || null;
		}
	}
};

module.exports = command;