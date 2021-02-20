const { Message } = require("discord.js");

const command  = {
	name: "info",
	description: {
		fr: "Obtenir quelques informations sur le bot",
		en: "Get some information about the bot"
	},
	aliases: ["i"],
	args: 0,
	usage: "",
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const config = require("../config.json");
		const { version } = require("../package.json");
		message.channel.send({
			embed: {
				author: {
					name: message.client.user.username,
					icon_url: message.client.user.avatarURL()
				},
				title: language.title,
				color: "#010101",
				description: language.get(language.description, message.client.prefix, (message.client.users.cache.get(config.OWNER_ID) || { username: language.unknown }).tag, version),
				footer: {
					text: "✨Mayze✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;