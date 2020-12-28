const { Message } = require("discord.js");

const command = {
	name: "message",
	description: "Envoie un message dans un salon",
	aliases: ["msg", "m"],
	args: 2,
	usage: "<salon> <texte>",
	perms: ["MANAGE_MESSAGES"],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 */
	async execute(message, args) {
		const channel = message.mentions.channels.first();
		if (!channel) return message.reply("indique le salon dans lequel je dois envoyer le message").catch(console.error);
		channel.send(args.splice(1).join(" "))
		.then(() => message.react("✅"))
		.catch(err => {
			console.error(err);
			message.react("❌");
		});
	}
};

module.exports = command;