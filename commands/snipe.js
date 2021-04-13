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
	slashOptions: null,
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const Fs = require("fs");

		const snipedMsg = message.client.deletedMessages ? message.client.deletedMessages[message.channel.id] : null;
		if (!snipedMsg) return message.reply(language.no_snipe).catch(console.error);

		let urls = [];
		let buffers = [];
		const imageSnipeChannel = message.client.channels.cache.get("808389540552245278");
		if (snipedMsg.attachments.length) {
			if (!message.isInteraction) message.channel.startTyping(1);
			snipedMsg.attachments.forEach(attachment => {
				const buffer = Fs.readFileSync(`discord-images/${attachment}`);
				buffers.push(buffer);
			});
			
			const msg = await imageSnipeChannel.send({ files: snipedMsg.attachments.map(a => `discord-images/${a}`) }).catch(console.error);
			urls = msg.attachments.array().map(a => a.url);
		}
		
		message.channel.send({
			embed: {
				author: {
					name: snipedMsg.author.tag,
					icon_url: snipedMsg.author.avatar
				},
				color: message.guild.me.displayColor,
				description: snipedMsg.content,
				fields: urls.length > 1
					? [
						{ name: language.other_images, value: urls.slice(1).join("\n"), inline: false },
						{ name: "\u200b", value: "\u200b", inline: false }
					]
					: null,
				image: urls.length
					? { url: urls[0] }
					: null,
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);
		if (!message.isInteraction) message.channel.stopTyping();
	}
};

module.exports = command;