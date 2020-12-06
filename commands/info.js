const command  = {
	name: "info",
	description: "Montre quelques info sur le bot",
	aliases: ["i"],
	args: 0,
	usage: "",
	async execute(message, args) {
		const config = require("../config.json");
		const { version } = require("../package.json");
		try {
			message.channel.send({
				embed: {
					author: {
						name: message.client.user.username,
						icon_url: message.client.user.avatarURL()
					},
					title: "• Informations sur le bot",
					color: "#010101",
					description: `**Préfixe:** \`${config.prefix[message.client.user.id]}\`\n**Propriétaire:** \`${message.client.users.cache.get(config.ownerID).username}\`\n**Version:** \`${version}\``,
					footer: {
						text: "✨Mayze✨"
					}
				}
			});
		} catch (err) { console.log(err); }
	}
};

module.exports = command;