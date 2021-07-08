const { Message } = require("discord.js");

const command = {
	name: "edit-snipe",
	description: {
		fr: "Envoyer sur le salon le message que quelqu'un vient de modifier",
		en: "Send a message from this channel that was edited"
	},
	aliases: ["editsnipe"],
	args: 0,
	usage: "",
	botPerms: ["EMBED_LINKS"],
	category: "miscellaneous",
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const snipedMsg = message.client.editedMessages ? message.client.editedMessages[message.channel.id] : null;
		if (!snipedMsg) return message.reply(language.no_message).catch(console.error);
		
		message.channel.send({
			embed: {
				author: {
					name: snipedMsg.author.tag,
					icon_url: snipedMsg.author.avatar
				},
				color: message.guild.me.displayColor,
				description: snipedMsg.content,
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;