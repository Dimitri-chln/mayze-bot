const command = {
	name: "reactsnipe",
	description: "Montre sur le salon la réaction que quelqu'un vient de supprimer",
	aliases: [],
	args: 0,
	usage: "",
	async execute(message, args) {
		const snipedReaction = message.client.removedReactions ? message.client.removedReactions[message.channel.id] : undefined;
		if (!snipedReaction) return message.reply("il n'y a aucune réaction à snipe dans ce salon").catch(console.error);
		
		message.channel.send({
			embed: {
				author: {
					name: snipedReaction.author.tag,
					icon_url: `https://cdn.discordapp.com/avatars/${snipedReaction.author.id}/${snipedReaction.author.avatar}.png`
                },
                thumbnail: {
                    url: `https://cdn.discordapp.com/avatars/${snipedReaction.user.id}/${snipedReaction.user.avatar}.png`
                },
				color: "#010101",
                description: snipedReaction.content,
                fields: [
                    { name: "\u200b", value: `**${snipedReaction.user.tag}** [a réagi avec](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${snipedReaction.messageID}) ${snipedReaction.emoji}`, inline: false }
                ],
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;