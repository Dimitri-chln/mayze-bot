const { Message } = require("discord.js");

const command = {
	name: "edit-snipe",
	description: "Envoyer sur le salon le message que quelqu'un vient de modifier",
	aliases: ["editsnipe"],
	args: 0,
	usage: "",
	slashOptions: null,
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, languages, language) => {
		const snipedMsg = message.client.editedMessages ? message.client.editedMessages[message.channel.id] : null;
		if (!snipedMsg) return message.reply("il n'y a pas de message à snipe dans ce salon").catch(console.error);
		
		message.channel.send({
			embed: {
				author: {
					name: snipedMsg.author.tag,
					icon_url: snipedMsg.author.avatar
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