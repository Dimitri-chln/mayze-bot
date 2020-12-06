const command = {
	name: "hug",
	description: "Fais un câlin à quelqu'un !",
	aliases: [],
	args: 1,
	usage: "<mention>",
	async execute(message, args) {
		const hugs = require("../assets/hugs.json");
		const user = message.mentions.users.first() || message.client.user;
		try {
			message.channel.send({
				embed: {
					author: {
						name: `${message.author.username} fait un câlin à ${user.username} 🤗`,
						icon_url: message.author.avatarURL({ dynamic: true })
					},
					color: "#010101",
					image: {
						url: hugs[Math.floor(Math.random() * hugs.length)]
					},
					footer: {
						text: "✨Mayze✨"
					}
				}
			});
		} catch (err) { console.log(err); }
	}
};

module.exports = command;