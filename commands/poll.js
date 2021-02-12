const { Message } = require("discord.js");

const command = {
	name: "poll",
	description: "Créer un sondage dans le salon actuel",
	aliases: ["ask", "question"],
	args: 1,
	usage: "\"<question>\" \"[proposition]\" \"[proposition]\"...",
	slashOptions: [
		{
			name: "question",
			description: "La question à poser",
			type: 3,
			required: true
		},
		{
			name: "propositions",
			description: "Une liste de propositions séparées par un /",
			type: 3,
			required: false
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options) => {
		const question = args
			? args[0]
			: options[0].value;
		if (!question) return message.reply("écris ta question entre guillemets").catch(console.error);
		const answers = args
			? args.length > 1 ? args.slice(1) : [ "Oui", "Non" ]
			: (options[1] || { value: "" }).value.trim().split("/").length > 1 ? (options[1] || { value: "" }).value.trim().split("/").map(answer => answer.replace(/^./, a => a.toUpperCase())) : [ "Oui", "Non"];
		
		const emojis = answers === ["Oui", "Non"] ? ["✅", "❌"] : ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"].slice(0, answers.length);
		emojis.push("🛑");
		
		if (message.deletable) message.delete().catch(console.error);
		sendPoll();

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
							return { name: `${emojis[i]} ${a}`, value: previousMsg.embeds[0].fields[i].value, inline: true };
						} catch(err) {
							return { name: `${emojis[i]} ${a}`, value: "Ø", inline: true };
						}
					}),
					footer: {
						text: "✨ Mayze ✨"
					}
				}
			}).catch(err => {
				console.error(err);
				message.channel.send("Quelque chose s'est mal passé en envoyant le sondage :/").catch(console.error);
				messageCollector.stop();
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
								return { name: `${emojis[i]} ${a}`, value: field, inline: true };
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
	}
};

module.exports = command;