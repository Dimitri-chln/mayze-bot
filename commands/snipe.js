const { Message } = require("discord.js");

const command = {
	name: "snipe",
	description: {
		fr: "Envoyer un message que quelqu'un vient de supprimer",
		en: "Send a message that someone just deleted"
	},
	aliases: [],
	args: 0,
	usage: "",
	botPerms: ["EMBED_LINKS", "ATTACH_FILES"],
	category: "miscellaneous",
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const snipedMsg = message.client.deletedMessages ? message.client.deletedMessages[message.channel.id] : null;
		if (!snipedMsg) return message.reply(language.no_snipe).catch(console.error);
		
		message.channel.send({
			embed: {
				author: {
					name: snipedMsg.author.tag,
					icon_url: snipedMsg.author.avatar
				},
				color: message.guild.me.displayColor,
				description: snipedMsg.content,
				image: {
					url: snipedMsg.attachments.length ? `attachment://${snipedMsg.attachments[0].name}` : null
				},
				footer: {
					text: "✨ Mayze ✨"
				}
			},
			files: snipedMsg.attachments
		}).catch(console.error);

		if (!message.isInteraction) message.channel.stopTyping();
	}
};

module.exports = command;