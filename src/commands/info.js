const { Message } = require("discord.js");

const command  = {
	name: "info",
	description: {
		fr: "Obtenir quelques informations sur le bot",
		en: "Get some information about the bot"
	},
	aliases: [],
	args: 0,
	usage: "",
	botPerms: ["EMBED_LINKS"],
	category: "utility",
	newbiesAllowed: true,
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	run: async (message, args, options, language, languageCode) => {
		const config = require("../config.json");
		const { version } = require("../package.json");
		message.channel.send({
			embed: {
				author: {
					name: message.client.user.username,
					iconURL: message.client.user.displayAvatarURL()
				},
				title: language.title,
				color: message.guild.me.displayColor,
				description: language.get(language.description, message.client.prefix, (message.client.users.cache.get(config.OWNER_ID) || { username: language.unknown }).tag, version),
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;