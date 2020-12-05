import { Channel, User } from "discord.js";
import Player from "./classPlayer";

/**
 * @param {Channel|User} channel The channel or user to recieve the message
 * @param {Player[]} players The list of all the players
 * @param {string} embedTitle The title of the embed that will be sent
 * @returns {Promise<Player>} The chosen player
 */
async function werewolfAction(channel, players, embedTitle) {
	const msg = await channel.send({
		embed: {
			title: embedTitle,
			color: "#010101",
			description: players.map((player, i) => `\`${ i + 1 }.\` ${ player.member.user.username }`),
			footer: "🐺 Mayze 🐺"
		}
	}).catch(console.error);
	const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"].slice(0, playerList.length);
	emojis.forEach(async e => await msg.react(e).catch(console.error));
	const filter = (reaction, _user) => emojis.includes(reaction._emoji);
	const result = await msg.awaitReactions(filter, { max: 1, time: 60000 });
	msg.reactions.removeAll().catch(console.error);
	return players[emojis.indexOf(result.first()._emoji)];
}

export default werewolfAction;