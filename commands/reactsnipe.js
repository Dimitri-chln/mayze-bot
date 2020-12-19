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
					icon_url: snipedReaction.author.avatarURL({ dynamic: true})
                },
                thumbnail: {
                    url: snipedReaction.emoji.url
                },
				color: "#010101",
                description: snipedReaction.message.content,
                fields: [
                    { name: "\u200b", value: `**${snipedReaction.user.tag}** [a réagi avec](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${snipedReaction.message.id}) ${snipedReaction.emoji}` }
                ],
				footer: {
					text: "✨ Mayze ✨",
					icon_url: snipedReaction.user.avatarURL({ dynamic: true })
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;