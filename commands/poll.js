const { Message, MessageEmbed } = require("discord.js");

const command = {
	name: "poll",
	description: "Créer un sondage dans le salon actuel",
	aliases: ["ask", "question", "vote"],
	args: 1,
	usage: "\"<question>\" \"[proposition]\" \"[proposition]\"... [-anonymous]",
	slashOptions: [
		{
			name: "question",
			description: "La question à poser",
			type: 3,
			required: true
		},
		{
			name: "propositions",
			description: "Une liste de propositions séparées par un //",
			type: 3,
			required: false
		},
		{
			name: "anonyme",
			description: "Si le sondage est anonyme ou pas",
			type: 4,
			required: false,
			choices: [
				{
					name: "Vote anonyme",
					value: 1
				},
				{
					name: "Pas anonyme",
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
			: !!(options.find(o => o.name === "anonyme") || {}).value;
		args = args.filter(a => a !== "-anonymous");
		const question = args
			? args[0]
			: options[0].value;
		if (!question) return message.reply("écris ta question entre guillemets").catch(console.error);
		const answers = args
			? args.length > 2 ? args.slice(1) : ["oui", "non"]
			: (options[1] || { value: "" }).value.trim().split("//").length > 1 ? (options[1] || { value: "" }).value.trim().split("/").map(answer => answer.replace(/^./, a => a.toUpperCase())) : [ "Oui", "Non"];
		if (answers.length > 10) return message.reply("le nombre de propositions ne peut pas dépasser 10").catch(console.error);

		const emojis = (answers[0].toLowerCase() === "oui" && answers[1].toLowerCase() === "non" && answers.length === 2 ? ["✅", "❌"] : ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"]).slice(0, answers.length);
		emojis.push("🛑");
		
		if (message.deletable) message.delete().catch(console.error);
		
		if (anonymous) {
			if (!message.client.anonymousPolls) message.client.anonymousPolls = {};
			if (message.client.anonymousPolls[message.channel.id]) return message.reply("un sondage a déjà lieu dans ce salon").catch(console.error);
			message.client.anonymousPolls[message.channel.id] = {};

			const dmMessage = await message.author.send({
				embed: {
					author: {
						name: message.author.tag,
						icon_url: message.author.avatarURL({ dynamic: true })
					},
					title: `« ${question.replace(/["'«»]/g, "")} »`,
					color: "#010101",
					fields: answers.map((a, i) => {
						return { name: `${emojis[i]} ${a.replace(/^./, a => a.toUpperCase())}`, value: "Ø", inline: true };
					}),
					footer: {
						text: "✨ Mayze ✨"
					}
				}
			}).catch(console.error);

			sendPollAnonymous(null, dmMessage);
		} else sendPoll();

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
						try {
							return { name: `${emojis[i]} ${a.replace(/^./, a => a.toUpperCase())}`, value: previousMsg.embeds[0].fields[i].value, inline: true };
						} catch(err) {
							return { name: `${emojis[i]} ${a.replace(/^./, a => a.toUpperCase())}`, value: "Ø", inline: true };
						}
					}),
					footer: {
						text: "✨ Mayze ✨"
					}
				}
			}).catch(err => {
				console.error(err);
				message.channel.send("Quelque chose s'est mal passé en envoyant le sondage :/").catch(console.error);
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
								field = field.replace(new RegExp(`(\n?• <@${user.id}>)|Ø`), "");
								if (reaction.emoji.name === emojis[i]) field += `\n• <@${user.id}>`;
								if (!field) field = "Ø";
								return { name: `${emojis[i]} ${a.replace(/^./, a => a.toUpperCase())}`, value: field, inline: true };
							}),
							footer: {
								text: "✨ Mayze ✨"
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
						try {
							return { name: `${emojis[i]} ${a.replace(/^./, a => a.toUpperCase())}`, value: previousMsg.embeds[0].fields[i].value, inline: true };
						} catch(err) {
							return { name: `${emojis[i]} ${a.replace(/^./, a => a.toUpperCase())}`, value: "→ **0** vote(s)", inline: true };
						}
					}),
					footer: {
						text: "✨ Mayze ✨"
					}
				}
			}).catch(err => {
				console.error(err);
				message.channel.send("Quelque chose s'est mal passé en envoyant le sondage :/").catch(console.error);
			});

			const reactionFilter = (reaction, user) => emojis.includes(reaction.emoji.name) && !user.bot;
			const reactionCollector = msg.createReactionCollector(reactionFilter);
			reactionCollector.on("collect", async (reaction, user) => {
				if (reaction.emoji.name === "🛑" && user.tag === reaction.message.embeds[0].author.name) {
					reaction.message.reactions.removeAll().catch(console.error);
					reactionCollector.stop();
					messageCollector.stop();
					delete message.client.anonymousPolls[message.channel.id];
				} else {
					reaction.users.remove(user).catch(console.error);

					msg = await reaction.message.edit({
						embed: {
							author: reaction.message.embeds[0].author,
							title: reaction.message.embeds[0].title,
							color: "#010101",
							fields: answers.map((a, i) => {
								let field = reaction.message.embeds[0].fields[i].value;
								field = field.replace(/\d+/, votes => message.client.anonymousPolls[message.channel.id][user.id] === i ? parseInt(votes) - 1 : votes);
								if (reaction.emoji.name === emojis[i]) {
									field = field.replace(/\d+/, votes => parseInt(votes) + 1);
								}
								return { name: `${emojis[i]} ${a.replace(/^./, a => a.toUpperCase())}`, value: field, inline: true };
							}),
							footer: {
								text: "✨ Mayze ✨"
							}
						}
					}).catch(console.error);

					message.client.anonymousPolls[message.channel.id][user.id] = emojis.indexOf(reaction.emoji.name);

					let newDmMessage = dmMessage.embeds[0];
					newDmMessage.fields = answers.map((a, i) => {
						return { name: `${emojis[i]} ${a.replace(/^./, a => a.toUpperCase())}`, value: Object.keys(message.client.anonymousPolls[message.channel.id]).filter(u => message.client.anonymousPolls[message.channel.id][u] === i).map(u => `• <@${u}>`).join("\n") || "Ø", inline: true };
					});
					dmMessage.edit(newDmMessage).catch(console.error);

					message.author.send(`**${user.tag}** a voté \`${answers[emojis.indexOf(reaction.emoji.name)].replace(/^./, a => a.toUpperCase())}\``)
						.then(m => m.delete().catch(console.error))
						.catch(console.error);
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