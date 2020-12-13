const { Channel, User } = require("discord.js");
const Player = require("./classPlayer");

/**
 * @param {Channel|User} channel The channel or user to recieve the message
 * @param {Player[]} players The list of all the players
 * @param {string} embedTitle The title of the embed that will be sent
 * @returns {Promise<Player>} The chosen player
 */
async function selectPlayer(channel, players, embedTitle) {
	const msg = await channel.send({
		embed: {
			title: embedTitle,
			color: "#010101",
			description: players.map((player, i) => `\`${ (i + 1).toString(16).toUpperCase() }.\` ${ player.member.user.username }`).join("\n"),
			footer: "🐺 Mayze 🐺"
		}
	}).catch(console.error);
	const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "🇦", "🇧", "🇨", "🇩", "🇪" ,"🇫"].slice(0, players.length);
	emojis.forEach(async e => await msg.react(e).catch(console.error));
	const filter = (reaction, user) => emojis.includes(reaction.emoji.name) && !user.bot;
	try {
		const collected = await msg.awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] });
		if (channel.type && channel.type !== "dm") msg.reactions.removeAll().catch(console.error);
		return players[emojis.indexOf(collected.first().emoji.name)];
	} catch (err) {
		return;
	}
};

module.exports = selectPlayer;