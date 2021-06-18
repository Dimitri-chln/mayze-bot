const { Message, Collection, User } = require("discord.js");
const { max } = require("mathjs");

const command = {
	name: "trivia",
	description: {
		fr: "Jouer à un jeu de trivia",
		en: "Play some trivia"
	},
	aliases: ["quiz"],
	args: 0,
	usage: "[-score <score>]",
	disableSlash: true,
	slashOptions: [
		{
			name: "score",
			description: "The score to reach to win",
			type: 4,
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
		let scoreLimit = args
			? parseInt(args[args.indexOf("-score") + 1])
			: options[0].value;
		if (isNaN(scoreLimit) || scoreLimit < 0) scoreLimit = 50;
		if (scoreLimit > 250) scoreLimit = 250;

		const startMsg = await message.channel.send({
			embed: {
				author: {
					name: language.start_msg_title,
					icon_url: message.client.user.avatarURL()
				},
				title: language.get(language.score_limit, scoreLimit),
				color: message.guild.me.displayColor,
				description: language.start_msg_description,
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);
		startMsg.react("✅").catch(console.error);

		const startFilter = (reaction, user) => reaction.emoji.name === "✅" && !user.bot;
		const collected = await startMsg.awaitReactions(startFilter, { time: 30000 }).catch(console.error);
		if (!collected.size || collected.first().users.cache.size < 3) return message.reply(language.no_player).catch(console.error);

		/**@type {Collection<string,User>} */
		const players = collected.first().users.cache.filter(u => !u.bot);

		const scores = {};
		for (const [id] of players) scores[id] = 0;
		let question = 0;
		let unanswered = 0;

		newQuestion();

		async function newQuestion() {
			++question;
			const pokemon = pokedex.allPokemon()[Math.floor(Math.random() * pokedex.allPokemon().length)];
			const bonusLanguage = Object.keys(pokemon.names)[Math.floor(Math.random() * Object.keys(pokemon.names).length)];
			const flags = { en: "🇬🇧", fr: "🇫🇷", de: "🇩🇪", cz: "🇨🇿", es: "🇪🇸", it: "🇮🇹", jp: "🇯🇵", tr: "🇹🇷", dk: "🇩🇰", gr: "🇬🇷", pl: "🇵🇱" };
		
			message.channel.send({
				embed: {
					author: {
						name: language.get(language.question, question),
						icon_url: message.client.user.avatarURL()
					},
					color: message.guild.me.displayColor,
					description: language.whats_this_pkm,
					image: {
						url: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${(`00${pokemon.national_id}`).substr(-3)}.png`
					},
					footer: {
						text: "✨ Mayze ✨" + language.get(language.bonus_language, flags[bonusLanguage])
					}
				}
			}).catch(console.error);
		
			const answerFilter = msg => players.has(msg.author.id) && Object.values(pokemon.names).some(name => simplify(name) === simplify(msg.content));
			let answers = await message.channel.awaitMessages(answerFilter, { time: 15000 });
			answers.sweep(answer => answer.id !== answers.findKey(a => a.author.id === answer.author.id && simplify(a.content) === simplify(answer.content)));

			if (!answers.size) ++unanswered;
			else unanswered = 0;
			
			let newScores = {};
			for (const [id] of players)
				newScores[id] = Object.keys(pokemon.names).reduce((acc, key) => {
					acc[key] = 0;
					return acc;
				}, {});

			answers.array().forEach((answer, i) => {
				let score = [5, 3, 2][i] || 1;
				let multiplier = answer.content.toLowerCase() === pokemon.names[bonusLanguage].toLowerCase() ? 2 : 1;
				let lang = [bonusLanguage, ...Object.keys(pokemon.names).filter(l => l !== bonusLanguage)].find(l => simplify(pokemon.names[l]) === simplify(answer.content));
		
				scores[answer.author.id] += multiplier * score;
				newScores[answer.author.id][lang] = multiplier * score;
			});
		
			message.channel.send(answers.size ? `${language.get(language.answer, [bonusLanguage, ...Object.keys(pokemon.names).filter(l => l !== bonusLanguage)].map(l => `${flags[l]} ${pokemon.names[l]}`).join(", "))}\n${players.map(p => `> **${p.username}** - **${scores[p.id]}** \`(${Object.keys(newScores[p.id]).filter(l => newScores[p.id][l] !== 0).sort((a, b) => newScores[p.id][b] - newScores[p.id][a]).map(l => `${flags[l]} +${newScores[p.id][l]}`).join(", ") || "+0"})\``).join("\n")}` : language.get(language.no_correct_answer, Object.keys(pokemon.names).map(l => `${flags[l]} ${pokemon.names[l]}`).join("\n"))).catch(console.error);
			
			if (unanswered >= 5) {
				return message.channel.send(language.inactive).catch(console.error);
			}

			if (Math.max(...Object.values(scores)) < scoreLimit) setTimeout(newQuestion, 10000);
			else {
				let results = Object.entries(scores).sort((a, b) => b[1]- a[1]);
		
				message.channel.send({
					embed: {
						author: {
							name: language.winner_msg_title,
							icon_url: message.client.user.avatarURL()
						},
						color: message.guild.me.displayColor,
						thumbnail: {
							url: players.find(p => p.id === results[0][0]).avatarURL({ dynamic: true })
						},
						description: results.map(([id, score], i) => {
							if (i === 0) return `👑 **${players.find(p => p.id === id).username}** - **${score}** 👑\n`;
							return `\`${i + 1}.\` **${players.find(p => p.id === id).username}** - ${score}`;
						}).join("\n"),
						footer: {
							text: "✨ Mayze ✨"
						}
					}
				}).catch(console.error);
			}
		}

		function simplify(text) {
			const replacement = {
				"à": "a", "â": "a",
				"é": "e", "è": "e", "ê": "e", "ë": "e",
				"î": "i", "ï": "i",
				"ô": "o",
				"ù": "u", "û": "u",
				"-": " "
			};

			return text.toLowerCase().replace(/\W/g, c => replacement[c] || c);
		}
	}
};

module.exports = command;
