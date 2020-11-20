const command = {
	name: "snipe",
	description: "Montre sur le salon le message que quelqu'un vient de supprimer",
	aliases: [],
	args: 0,
	usage: "",
	async execute(message, args) {
		const snipedMsg = (message.client.deletedMessages || {})[message.channel.id];
		if (!snipedMsg) return message.reply("il n'y a aucun message à snipe dans ce salon").catch(console.error);
		
		message.channel.send({
			embed: {
				author: {
					name: snipedMsg.author.tag,
					icon_url: `https://cdn.discordapp.com/avatars/${snipedMsg.author.id}/${snipedMsg.author.avatar}.png`
				},
				color: "#010101",
				description: snipedMsg.content,
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;