const { Message } = require("discord.js");

/**
 * @param {Message} message 
 */
function updateGwaMsg(message) {
	const endTimestamp = message.embeds[0].timestamp;
	if (endTimestamp < Date.now()) {
		message.edit({
			content: message.content,
			embed: message.embeds[0].setDescription("Giveaway terminé !")
		}).catch(console.error);
		clearInterval(message.client.giveawayTimers.get(message.id));
		message.client.giveawayTimers.delete(message.id);

		const reactions = message.reactions.cache.get("🎉").users.cache.filter(user => user.id !== message.client.user.id);
		const numberOfWinners = parseInt(message.embeds[0].footer.text.match(/^\d+/)[0]);
		if (numberOfWinners > reactions.size) return message.channel.send(`Il n'y a pas assez d'utilisateurs qui ont participé au giveaway\n${message.url}`).catch(console.error);

		const winners = reactions.random(numberOfWinners);
		const winnersString = winners.map(u => u.toString()).join(", ").replace(/>, <@(\d{18})>$/, "> et <@$1>");
		message.channel.send(`${winnersString} ${winners.length === 1 ? "a" : "ont"} gagné **\`${message.embeds[0].title}\`**\n${message.url}`).catch(console.error);

	} else {
		const timeToString = require("./timeToString");
		message.edit({
			content: message.content,
			embed: message.embeds[0].setDescription(`Il reste ${timeToString((message.embeds[0].timestamp - Date.now()) / 1000)}`)
		}).catch(console.error);
	}
}

module.exports = updateGwaMsg;