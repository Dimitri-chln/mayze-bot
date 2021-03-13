const { Message } = require("discord.js");

const command = {
	name: "poll",
	description: {
		fr: "Créer un sondage dans le salon actuel",
		en: "Create a poll in the current channel"
	},
	aliases: ["ask", "question", "vote"],
	args: 1,
	usage: "\"<question>\" \"[<answer>]\" \"[<answer>]\"... [-anonymous] [-single]",
	slashOptions: [
		{
			name: "question",
			description: "The title of the poll",
			type: 3,
			required: true
		},
		{
			name: "answers",
			description: "A list of answers, separated by //",
			type: 3,
			required: false
		},
		{
			name: "anonymous",
			description: "Whether the poll needs to be anonymous or not",
			type: 4,
			required: false,
			choices: [
				{
					name: "Anonymous poll",
					value: 1
				},
				{
					name: "Not anonymous poll",
					value: 0
				}
			]
		},
		{
			name: "votes",
			description: "Whether a single vote is permitted or not",
			type: 4,
			required: false,
			choices: [
				{
					name: "Only one vote",
					value: 1
				},
				{
					name: "Multiple votes",
					value: 0
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
		const anonymous = args
			? args.includes("-anonymous")
			: !!(options.find(o => o.name === "anonymous") || {}).value;
		if (args) args = args.filter(a => a !== "-anonymous");
		const single = args
			? args.includes("-single")
			: !!(options.find(o => o.name === "votes") || {}).value;
		if (args) args = args.filter(a => a !== "-single");
		const question = args
			? args[0]
			: options[0].value;
		const answers = args
			? args.length > 2 ? args.slice(1) : language.yes_no
			: options[1] && options[1].value.trim().split("//").length > 1 ? options[1].value.trim().split("//").map(answer => answer.replace(/^./, a => a.toUpperCase())) : language.yes_no;
		if (answers.length > 10) return message.reply(language.too_many_answers).catch(console.error);

		const emojis = answers[0].toLowerCase() === language.yes_no[0] && answers[1].toLowerCase() === language.yes_no[1] && answers.length === 2 ? ["✅", "❌"] : ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"].slice(0, answers.length);
		emojis.push("🛑");
		
		if (message.deletable) message.delete().catch(console.error);
		
		if (anonymous) {
			const dmMessage = await message.author.send({
				embed: {
					author: {
						name: message.author.tag,
						icon_url: message.author.avatarURL({ dynamic: true })
					},
					title: `« ${question.replace(/["'«»]/g, "")} »`,
					color: "#010101",
					fields: answers.map((a, i) => {
						return { name: `${emojis[i]} ${a}`, value: "Ø", inline: true };
					}),
					footer: {
						text: "✨ Mayze ✨" + (single ? language.single : "")
					}
				}
			}).catch(console.error);

			sendPollAnonymous(null, dmMessage);
		} else {
			sendPoll();
		}

		async function sendPoll(previousMsg) {
			let msg = await message.channel.send({
				embed: {
					author: {
						name: message.author.tag,
						icon_url: message.author.avatarURL({ dynamic: true })
					},
					title: `« ${question.replace(/["'«»]/g, "")} »`,
					color: "#010101",
					fields: answers.map((a, i) => {
						return { name: `${emojis[i]} ${a}`, value: previousMsg ? previousMsg.embeds[0].fields[i].value : "Ø", inline: true };
					}),
					footer: {
						text: "✨ Mayze ✨" + (single ? language.single : "")
					}
				}
			}).catch(err => {
				console.error(err);
				message.channel.send(language.errors.message_send).catch(console.error);
			});

			const reactionFilter = (reaction, user) => emojis.includes(reaction.emoji.name) && !user.bot;
			const reactionCollector = msg.createReactionCollector(reactionFilter);
			reactionCollector.on("collect", async (reaction, user) => {
				if (reaction.emoji.name === "🛑" && user.tag === reaction.message.embeds[0].author.name) {
					reaction.message.reactions.removeAll().catch(console.error);
					reactionCollector.stop();
					messageCollector.stop();
					
				} else {
					reaction.users.remove(user).catch(console.error);
					msg = await reaction.message.edit({
						embed: {
							author: reaction.message.embeds[0].author,
							title: reaction.message.embeds[0].title,
							color: "#010101",
							fields: answers.map((a, i) => {
								let field = reaction.message.embeds[0].fields[i].value;

								if (single) {
									field = field.replace(new RegExp(`(\n?• <@${user.id}>)|Ø`), "");
									if (reaction.emoji.name === emojis[i]) field += `\n• ${user}`;
								} else {
									if (reaction.emoji.name === emojis[i]) {
										const regex = new RegExp(`\n?• <@${user.id}>`);
										if (regex.test(field)) field = field.replace(regex, "");
										else field = field.replace("Ø", "") + `\n• ${user}`;
									}
								}

								if (!field) field = "Ø";
								return { name: `${emojis[i]} ${a}`, value: field, inline: true };
							}),
							footer: {
								text: reaction.message.embeds[0].footer.text
							}
						}
					}).catch(console.error);
				}
			});

			let counter = 5;
			const messageCollector = message.channel.createMessageCollector(() => true);
			messageCollector.on("collect", async () => {
				--counter;
				if (counter ===  0) {
					reactionCollector.stop();
					sendPoll(msg);
					msg.delete().catch(console.error);
				}
			});

			if (msg) emojis.forEach(async e => await msg.react(e).catch(console.error));
			return msg;
		}

		async function sendPollAnonymous(previousMsg, dmMessage) {
			let msg = await message.channel.send({
				embed: {
					author: {
						name: message.author.tag,
						icon_url: message.author.avatarURL({ dynamic: true })
					},
					title: `« ${question.replace(/["'«»]/g, "")} »`,
					color: "#010101",
					fields: answers.map((a, i) => {
						return { name: `${emojis[i]} ${a}`, value: previousMsg ? previousMsg.embeds[0].fields[i].value : "→ **0** vote", inline: true };
					}),
					footer: {
						text: "✨ Mayze ✨" + (single ? language.single : "")
					}
				}
			}).catch(err => {
				console.error(err);
				message.channel.send(language.errors.message_send).catch(console.error);
			});

			const reactionFilter = (reaction, user) => emojis.includes(reaction.emoji.name) && !user.bot;
			const reactionCollector = msg.createReactionCollector(reactionFilter);
			reactionCollector.on("collect", async (reaction, user) => {
				if (reaction.emoji.name === "🛑" && user.tag === reaction.message.embeds[0].author.name) {
					reaction.message.reactions.removeAll().catch(console.error);
					reactionCollector.stop();
					messageCollector.stop();
				} else {
					reaction.users.remove(user).catch(console.error);

					dmMessage = await dmMessage.edit({
						embed: {
							author: reaction.message.embeds[0].author,
							title: reaction.message.embeds[0].title,
							color: "#010101",
							fields: answers.map((a, i) => {
								let field = dmMessage.embeds[0].fields[i].value;

								if (single) {
									field = field.replace(new RegExp(`(\n?• <@${user.id}>)|Ø`), "");
									if (reaction.emoji.name === emojis[i]) field += `\n• ${user}`;
								} else {
									if (reaction.emoji.name === emojis[i]) {
										const regex = new RegExp(`\n?• <@${user.id}>`);
										if (regex.test(field)) field = field.replace(regex, "");
										else field = field.replace("Ø", "") + `\n• ${user}`;
									}
								}

								if (!field) field = "Ø";
								return { name: `${emojis[i]} ${a}`, value: field, inline: true };
							}),
							footer: {
								text: dmMessage.embeds[0].footer.text
							}
						}
					}).catch(console.error);

					message.author.send(language.get(language.voted, user.tag, answers[emojis.indexOf(reaction.emoji.name)]))
						.then(m => m.delete().catch(console.error))
						.catch(console.error);


					msg = await reaction.message.edit({
						embed: {
							author: reaction.message.embeds[0].author,
							title: reaction.message.embeds[0].title,
							color: "#010101",
							fields: answers.map((a, i) => {
								const votes = dmMessage.embeds[0].fields[i].value === "Ø" ? 0 : dmMessage.embeds[0].fields[i].value.split("\n").length;
								return { name: `${emojis[i]} ${a}`, value: `→ **${votes}** vote${votes > 1 ? "s" : ""}`, inline: true };
							}),
							footer: {
								text: reaction.message.embeds[0].footer.text
							}
						}
					}).catch(console.error);
				}
			});

			let counter = 5;
			const messageCollector = message.channel.createMessageCollector(() => true);
			messageCollector.on("collect", async () => {
				--counter;
				if (counter ===  0) {
					reactionCollector.stop();
					sendPollAnonymous(msg, dmMessage);
					msg.delete().catch(console.error);
				}
			});

			if (msg) emojis.forEach(async e => await msg.react(e).catch(console.error));
			return msg;
		}
	}
};

module.exports = command;