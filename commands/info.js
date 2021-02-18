const { Message } = require("discord.js");

const command  = {
	name: "info",
	description: "Montrer quelques info sur le bot",
	aliases: ["i"],
	args: 0,
	usage: "",
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language) => {
		const config = require("../config.json");
		const { version } = require("../package.json");
		message.channel.send({
			embed: {
				author: {
					name: message.client.user.username,
					icon_url: message.client.user.avatarURL()
				},
				title: "• Informations sur le bot",
				color: "#010101",
				description: `**Préfixe:** \`${message.client.prefix}\`\n**Propriétaire:** \`${(message.client.users.cache.get(config.OWNER_ID) || { username: "*Inconnu*" }).username}\`\n**Version:** \`${version}\``,
				footer: {
					text: "✨Mayze✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;