const { Message } = require("discord.js");

const command = {
	name: "snipe",
	description: "Envoyer sur le salon le message que quelqu'un vient de supprimer",
	aliases: [],
	args: 0,
	usage: "",
	slashOptions: null,
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options) => {
		const snipedMsg = message.client.deletedMessages ? message.client.deletedMessages[message.channel.id] : null;
		if (!snipedMsg) return message.reply("il n'y a aucun message à snipe dans ce salon").catch(console.error);
		
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
		}).catch(console.error);
	}
};

module.exports = command;