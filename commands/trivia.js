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

		const startMsg = await message.channel.send({
			embed: {
				author: {
					name: language.start_msg_title,
					icon_url: message.client.user.avatarURL()
				},
				title: language.get(language.score_limit, scoreLimit),
				color: message.guild.me.displayHexColor,
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
		for (const [id, _player] of players) scores[id] = 0;
		let question = 0;

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
					color: message.guild.me.displayHexColor,
					description: language.whats_this_pkm,
					image: {
						url: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${(`00${pokemon.national_id}`).substr(-3)}.png`
					},
					footer: {
						text: "✨ Mayze ✨" + language.get(language.bonus_language, flags[bonusLanguage])
					}
				}
			}).catch(console.error);
		
			const answerFilter = msg => players.has(msg.author.id) && Object.values(pokemon.names).some(name => new RegExp(name, "i").test(msg.content));
			let answers = await message.channel.awaitMessages(answerFilter, { time: 15000 });
			answers.sweep(answer => answer.id !== answers.findKey(a => a.author.id === answer.author.id));
		
			let result = answers.size ? language.get(language.answer, flags[bonusLanguage], pokemon.names[bonusLanguage]) : language.get(language.no_correct_answer, Object.keys(pokemon.names).map(l => `${flags[l]} ${pokemon.names[l]}`).join("\n"));
		
			answers.array().forEach((answer, i) => {
				let score = 
					i === 0 ? 5
						: i === 1 ? 3
							: i === 2 ? 2
								: 1;
				let multiplier = answer.content.toLowerCase() === pokemon.names[bonusLanguage].toLowerCase()
					? 2
					: 1;
		
				scores[answer.author.id] += multiplier * score;
				result += `\n> **${answer.author.username}** - ${scores[answer.author.id]} \`(+${multiplier * score}${multiplier !== 1 ? ` bonus ${flags[bonusLanguage]}` : ""})\``;
			});
		
			message.channel.send(result).catch(console.error);
			
			if (Math.max(...Object.values(scores)) < scoreLimit) setTimeout(newQuestion, 10000);
			else {
				let results = Object.entries(scores).sort((a, b) => b[1]- a[1]);
		
				message.channel.send({
					embed: {
						author: {
							name: language.winner_msg_title,
							icon_url: message.client.user.avatarURL()
						},
						color: message.guild.me.displayHexColor,
						thumbnail: {
							url: players.find(p => p.id === results[0][0]).avatarURL({ dynamic: true })
						},
						description: results.map(([id, score], i) => {
							if (i === 0) return `👑 __**${players.find(p => p.id === id).username}**__ - **${score}** 👑\n`;
							return `\`${i + 1}.\` **${players.find(p => p.id === id).username}** - ${score}`;
						}).join("\n"),
						footer: {
							text: "✨ Mayze ✨"
						}
					}
				}).catch(console.error);
			}
		}
	}
};

module.exports = command;
