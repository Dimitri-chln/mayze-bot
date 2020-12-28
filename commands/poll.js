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
		let answers = args.join(" ").replace(question, "").trim().split("/");
		let emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
		if (answers.length < 2) {
			answers = ["Oui", "Non"];
			emojis = ["✅", "❌"];
		};
		message.delete().catch(console.error);
		const msg = await message.channel.send({
			embed: {
				author: {
					name: message.author.tag,
					icon_url: message.author.avatarURL({ dynamic: true })
				},
				title: `« ${question.replace(/["'«»]/g, "")} »`,
				color: "#010101",
				description: answers.map((a, i) => `${emojis[i]} ${a}`).join("\n"),
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(err => {
			console.error(err);
			message.channel.send("Quelque chose s'est mal passé en créant le sondage :/").catch(console.error);
		});
		if (msg) emojis.slice(0, answers.length).forEach(e => msg.react(e).catch(console.error));
	}
};

module.exports = command;