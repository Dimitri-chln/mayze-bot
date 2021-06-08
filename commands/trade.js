const { Message } = require("discord.js");

const command = {
	name: "trade",
	description: {
		fr: "Echanger des pokémons avec d'autres utilisateurs",
		en: "Trade pokémons with other users"
	},
	aliases: [],
	args: 2,
	usage: "block <user> [<duration>] | unblock <user> | [<pokémon to offer>], [<pokémon to offer>]... <user> [<pokémon to ask for>], [<pokémon to ask for>]...",
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
		const { TRADE_LOG_CHANNEL_ID } = require("../config.json");
		const logChannel = message.client.channels.cache.get(TRADE_LOG_CHANNEL_ID);

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

				let offer = args
					? args.join(" ").split(new RegExp(`<@!?${user.id}>`))[0].trim().split(/,(?: *)?/).filter(s => s)
					: options[0].options.find(o => o.name === "pokemons-offer") ? options[0].options.find(o => o.name === "pokemons-offer").value.split(/,(?: *)?/) : [];
				let demand = args
					? args.join(" ").split(new RegExp(`<@!?${user.id}>`))[1].trim().split(/,(?: *)?/).filter(s => s)
					: options[0].options.find(o => o.name === "pokemons-demand") ? options[0].options.find(o => o.name === "pokemons-demand").value.split(/,(?: *)?/) : [];
				
				if (!offer.length && !demand.length) return message.reply(language.empty_trade).catch(console.error);

				let error = "";

				offer = offer.map(input => {
					const name = input.replace(/alolan|shiny|#\d+$/ig, "").trim();
					const number = parseInt((input.match(/#(\d+)$/) || [])[1]) || 1;
					const shiny = /shiny/i.test(input);
					const alolan = /alolan/i.test(input);
					const pokemon = pokedex.allPokemon().find(pkm => Object.values(pkm.names).some(n => n.toLowerCase().replace(/\u2642/, "m").replace(/\u2640/, "f") === name.toLowerCase()));

					if (pokemon) return { data: pokemon, number, shiny, alolan, legendary: legendaries.includes(pokemon.names.en), ultra_beast: beasts.includes(pokemon.names.en) };
					else error += language.get(language.invalid_pkm, name);
				}).filter(p => p).filter((v, i, a) => a.findIndex(u => u.data.national_id === v.data.national_id) === i);

				demand = demand.map(input => {
					const name = input.replace(/alolan|shiny|#\d+$/ig, "").trim();
					const number = parseInt((input.match(/#(\d+)$/) || [])[1]) || 1;
					const shiny = /shiny/i.test(input);
					const alolan = /alolan/i.test(input);
					const pokemon = pokedex.allPokemon().find(pkm => Object.values(pkm.names).some(n => n.toLowerCase().replace(/\u2642/, "m").replace(/\u2640/, "f") === name.toLowerCase()));

					if (pokemon) return { data: pokemon, number, shiny, alolan, legendary: legendaries.includes(pokemon.names.en), ultra_beast: beasts.includes(pokemon.names.en) };
					else error += language.get(language.invalid_pkm, name);
				}).filter(p => p).filter((v, i, a) => a.findIndex(u => u.data.national_id === v.data.national_id) === i);
				
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
								value: `\`\`\`\n${offer.map(pkm => `×${pkm.number} ${pkm.alolan ? "Alolan " : ""}${pkm.data.names[languageCode]} ${pkm.legendary ? "🎖️": ""}${pkm.ultra_beast ? "🎗️ " : ""}${pkm.shiny ? "⭐": ""}`).join("\n") || "Ø"}\n\`\`\``,
								inline: true
							},
							{
								name: language.get(language.demand, user.username),
								value: `\`\`\`\n${demand.map(pkm => `×${pkm.number} ${pkm.alolan ? "Alolan " : ""}${pkm.data.names[languageCode]} ${pkm.legendary ? "🎖️": ""}${pkm.ultra_beast ? "🎗️ " : ""}${pkm.shiny ? "⭐": ""}`).join("\n") || "Ø"}\n\`\`\``,
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
				let cancel = null;
				let accepted = [false, false];

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
					
					// EXCHANGE POKEMONS
					const { "rows": offerPokemons1 } = (await message.client.pg.query(`SELECT * FROM pokemons WHERE user_id = '${message.author.id}'`).catch(console.error)) || {};
					const { "rows": demandPokemons1 } = (await message.client.pg.query(`SELECT * FROM pokemons WHERE user_id = '${user.id}'`).catch(console.error)) || {};

					let offerSuccess = [];
					for (const pkm of offer) {
						let s = []

						let p = demandPokemons1.find(d => d.pokedex_id === pkm.data.national_id && d.shiny === pkm.shiny && d.alolan === pkm.alolan);
						if (p) message.client.pg.query(`UPDATE pokemons SET caught = ${p.caught + pkm.number} WHERE id = ${p.id}`)
							.then(_res => s.push(1))
							.catch(err => {
								console.error(err);
								s.push(0);
							});
						else message.client.pg.query(`INSERT INTO pokemons (user_id, pokedex_id, pokedex_name, caught, shiny, legendary, ultra_beast, alolan) VALUES ('${user.id}', ${pkm.data.national_id}, '${pkm.data.names.en}', ${pkm.number}, ${pkm.shiny}, ${pkm.legendary}, ${pkm.ultra_beast}, ${pkm.alolan})`)
							.then(_res => s.push(1))
							.catch(err => {
								console.error(err);
								s.push(0);
							});
						
						let q = offerPokemons1.find(o => o.pokedex_id === pkm.data.national_id && o.shiny === pkm.shiny && o.alolan === pkm.alolan);
						if (q.caught === pkm.number) message.client.pg.query(`DELETE FROM pokemons WHERE id = ${q.id}`)
							.then(_res => s.push(1))
							.catch(err => {
								console.error(err);
								s.push(0);
							});
						else message.client.pg.query(`UPDATE pokemons SET caught = ${q.caught - pkm.number} WHERE id = ${q.id}`)
							.then(_res => s.push(1))
							.catch(err => {
								console.error(err);
								s.push(0);
							});

						offerSuccess.push(s);
					}

					const { "rows": offerPokemons2 } = (await message.client.pg.query(`SELECT * FROM pokemons WHERE user_id = '${message.author.id}'`).catch(console.error)) || {};
					const { "rows": demandPokemons2 } = (await message.client.pg.query(`SELECT * FROM pokemons WHERE user_id = '${user.id}'`).catch(console.error)) || {};

					let demandSuccess = [];
					for (const pkm of demand) {
						let s = [];

						let p = offerPokemons2.find(d => d.pokedex_id === pkm.data.national_id && d.shiny === pkm.shiny && d.alolan === pkm.alolan);
						if (p) message.client.pg.query(`UPDATE pokemons SET caught = ${p.caught + pkm.number} WHERE id = '${p.id}'`)
							.then(_res => s.push(1))
							.catch(err => {
								console.error(err);
								s.push(0);
							});
						else message.client.pg.query(`INSERT INTO pokemons (user_id, pokedex_id, pokedex_name, caught, shiny, legendary, ultra_beast, alolan) VALUES ('${message.author.id}', ${pkm.data.national_id}, '${pkm.data.names.en}', ${pkm.number}, ${pkm.shiny}, ${pkm.legendary}, ${pkm.ultra_beast}, ${pkm.alolan})`)
							.then(_res => s.push(1))
							.catch(err => {
								console.error(err);
								s.push(0);
							});
						
						let q = demandPokemons2.find(o => o.pokedex_id === pkm.data.national_id && o.shiny === pkm.shiny && o.alolan === pkm.alolan);
						if (q.caught === pkm.number) message.client.pg.query(`DELETE FROM pokemons WHERE id = ${q.id}`)
							.then(_res => s.push(1))
							.catch(err => {
								console.error(err);
								s.push(0);
							});
						else message.client.pg.query(`UPDATE pokemons SET caught = ${q.caught - pkm.number} WHERE id = ${q.id}`)
							.then(_res => s.push(1))
							.catch(err => {
								console.error(err);
								s.push(0);
							});
						
						demandSuccess.push(s);
					}

					// Dummy request to await for all other ones
					await message.client.pg.query(`SELECT id FROM pokemons where id = 0`).catch(console.error);
					
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
									value: `\`\`\`\n${offer.map((pkm, i) => `×${pkm.number} ${pkm.alolan ? "Alolan " : ""}${pkm.data.names.en} ${pkm.shiny ? "⭐": ""}${pkm.legendary ? "🎖️": ""}${pkm.ultra_beast ? "🎗️" : ""} - ${offerSuccess[i].map(s => ["❌", "✅"][s]).join(" ")}`).join("\n") || "Ø"}\n\`\`\``,
									inline: true
								},
								{
									name: "Demand:",
									value: `\`\`\`\n${demand.map((pkm, j) => `×${pkm.number} ${pkm.alolan ? "Alolan " : ""}${pkm.data.names.en} ${pkm.shiny ? "⭐": ""}${pkm.legendary ? "🎖️": ""}${pkm.ultra_beast ? "🎗️" : ""} - ${demandSuccess[j].map(s => ["❌", "✅"][s]).join(" ")}`).join("\n") || "Ø"}\n\`\`\``,
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



		async function checkValidPokemons(user1, pokemons1, user2, pokemons2) {
			const { "rows": user1Pokemons } = (await message.client.pg.query(`SELECT * FROM pokemons WHERE user_id = '${user1.id}'`).catch(console.error)) || {};
			const { "rows": user2Pokemons } = (await message.client.pg.query(`SELECT * FROM pokemons WHERE user_id = '${user2.id}'`).catch(console.error)) || {};

			let errors1 = [], errors1fav = [];
			for (const pokemon of pokemons1) {
				let pkm = user1Pokemons.find(p => p.pokedex_id === pokemon.data.national_id && p.shiny === pokemon.shiny && p.alolan === pokemon.alolan) || { caught: 0 };
				if (pokemon.number > pkm.caught) errors1.push(`**${pokemon.number - pkm.caught} ${pokemon.alolan ? "Alolan " : ""}${pokemon.data.names[languageCode]}${pokemon.shiny ? " ⭐": ""}${pokemon.legendary ? "🎖️": ""}${pokemon.ultra_beast ? "🎗️" : ""}**`);
				if (pkm.favorite) errors1fav.push(`**${pokemon.alolan ? "Alolan " : ""}${pokemon.data.names[languageCode]}${pokemon.shiny ? " ⭐": ""}${pokemon.legendary ? "🎖️": ""}${pokemon.ultra_beast ? "🎗️" : ""}**`);
			}

			let errors2 = [], errors2fav = [];
			for (const pokemon of pokemons2) {
				let pkm = user2Pokemons.find(p => p.pokedex_id === pokemon.data.national_id && p.shiny === pokemon.shiny && p.alolan === pokemon.alolan) || { caught: 0 };
				if (pokemon.number > pkm.caught) errors2.push(`**${pokemon.number - pkm.caught} ${pokemon.alolan ? "Alolan " : ""}${pokemon.data.names[languageCode]}${pokemon.shiny ? " ⭐": ""}${pokemon.legendary ? "🎖️": ""}${pokemon.ultra_beast ? "🎗️" : ""}**`);
				if (pkm.favorite) errors2fav.push(`**${pokemon.alolan ? "Alolan " : ""}${pokemon.data.names[languageCode]}${pokemon.shiny ? " ⭐": ""}${pokemon.legendary ? "🎖️": ""}${pokemon.ultra_beast ? "🎗️" : ""}**`);
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