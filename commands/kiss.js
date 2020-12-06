const command = {
	name: "kiss",
	description: "Fais un bisous à quelqu'un !",
	aliases: [],
	args: 1,
	usage: "<mention>",
	async execute(message, args) {
		const kisses = require("../assets/kisses.json");
		const user = message.mentions.users.first() || message.client.user;
		try {
			message.channel.send({
				embed: {
					author: {
						name: `${message.author.username} fait un bisous à ${user.username} 😘`,
						icon_url: message.author.avatarURL({ dynamic: true })
					},
					color: "#010101",
					image: {
						url: kisses[Math.floor(Math.random() * kisses.length)]
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