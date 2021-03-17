const { Channel, User } = require("discord.js");
const Player = require("./Player");

const language = {
	get: (text, ...args) => text
		.replace(/\{\d+?\}/g, a => args[parseInt(a.replace(/[\{\}]/g, "")) - 1])
		.replace(/\[\d+?\?.*?:.*?\]/g, a => {
			let m = a.match(/\[(\d+?)\?(.*?):(.*?)\]/);
			if (args[parseInt(m[1]) - 1]) return m[2];
			else return m[3];
		}),

	footer: {
		fr: "🐺 Mayze 🐺 | Tu as {1}s pour répondre",
		en: "🐺 Mayze 🐺 | You have {1}s to answer"
	}
};

/**
 * @param {Channel|User} channel The channel or user to recieve the message
 * @param {Player[]} players The list of all the players
 * @param {string} embedTitle The title of the embed that will be sent
 * @param {number} timeout The duration of the selection
 * @param {string} languageCode The language of the game
 * @returns {Promise<Player>} The chosen player
 */
async function selectPlayer(channel, players, embedTitle, timeout = 30000, languageCode) {
	const msg = await channel.send({
		embed: {
			title: embedTitle,
			color: "#010101",
			description: players.map((player, i) => `\`${ (i + 1).toString(16).toUpperCase() }.\` ${ player.member.user.username }`).join("\n"),
			footer: {
				text: language.get(language.footer, Math.round(timeout / 1000))
			}
		}
	}).catch(console.error);

	const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "🇦", "🇧", "🇨", "🇩", "🇪" ,"🇫"].slice(0, players.length);
	emojis.forEach(async e => await msg.react(e).catch(console.error));
	
	const filter = (reaction, user) => emojis.includes(reaction.emoji.name) && !user.bot;
	try {
		const collected = await msg.awaitReactions(filter, { max: 1, time: timeout, errors: ["time"] });
		if (channel.type && channel.type !== "dm") msg.reactions.removeAll().catch(console.error);
		return players[emojis.indexOf(collected.first().emoji.name)];
	} catch (err) {
		return;
	}
};

module.exports = selectPlayer;