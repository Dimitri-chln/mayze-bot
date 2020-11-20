const command = {
	name: "editsnipe",
	description: "Montre sur le salon le message que quelqu'un vient de modifier",
	aliases: [],
	args: 0,
	usage: "",
	async execute(message, args) {
		if (!message.client.editedMessages || !message.client.editedMessages[message.channel.id]) {
			return message.reply("il n'y a aucun message à snipe dans ce salon").catch(console.error);
		}
		const snipedMsg = message.client.editedMessages[message.channel.id];
		try {
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
			});
		} catch (err) { console.log(err); }
	}
};

module.exports = command;