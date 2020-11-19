const command = {
	name: "poll",
	description: "Crée un sondage dans le salon actuel",
	aliases: ["ask", "question"],
	args: 1,
	usage: "<question> [proposition]/[proposition]/...",
	async execute(message, args) {
		var emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
		const question = (args.join(" ").match(/^["«][^"»]*["»]/) || [null])[0];
		if (!question) {
			try { message.reply("écris ta question entre guillemets"); }
			catch (err) { console.log(err); }
			return;
		}
		var answers = args.join(" ").replace(question, "").trim().split("/");
		if (answers.length < 2) {
			answers = ["Oui", "Non"];
			emojis = ["✅", "❌"];
		};
		try { message.delete(); }
		catch (err) { console.log(err); }
		var msg;
		try {
			msg = await message.channel.send({
				embed: {
					author: {
						name: message.author.tag,
						icon_url: `https://cdn.discordapp.com/avatars/${message.client.user.id}/${message.client.user.avatar}.png`
					},
					thumbnail: {
						url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
					},
					title: `« ${question.replace(/["'«»]/g, "")} »`,
					color: "#010101",
					description: answers.map((a, i) => `${emojis[i]} ${a}`).join("\n"),
					footer: {
						text: "✨ Mayze ✨"
					}
				}
			});
		} catch (err) {
			console.log(err);
			try { message.channel.send("Quelque chose s'est mal passé en créant le sondage :/"); }
			catch (err) { console.log(err); }
		}
		emojis.slice(0, answers.length).forEach(e => {
			try { msg.react(e); }
			catch (err) { console.log(err); }
		});
	}
};

module.exports = command;