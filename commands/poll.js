const { Message } = require("discord.js");

const command = {
	name: "poll",
	description: "Crée un sondage dans le salon actuel",
	aliases: ["ask", "question"],
	args: 1,
	usage: "<question> [proposition]/[proposition]/...",
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 */
	async execute(message, args) {
		const question = (args.join(" ").match(/^["«][^"»]*["»]/) || [null])[0];
		if (!question) return message.reply("écris ta question entre guillemets").catch(console.error);
		const answers = args.join(" ").replace(question, "").trim().split("/").length < 2 ? ["Oui", "Non"] : args.join(" ").replace(question, "").trim().split("/");
		const emojis = answers.length === 2 ? ["✅", "❌"] : ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"].slice(0, answers.length);
		emojis.push("🛑");
		message.delete().catch(console.error);
		sendPoll();

		async function sendPoll(previousMsg) {
			const m = await message.channel.send({
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
			const reactionCollector = m.createReactionCollector(reactionFilter);
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

			if (m) emojis.forEach(async e => await m.react(e).catch(console.error));
			return m;
		}
	}
};

module.exports = command;