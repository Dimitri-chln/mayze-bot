const { Message } = require("discord.js");

const command = {
	name: "queue-loop",
	description: {
		fr: "Activer ou désactiver la répétition de la queue",
		en: "Toggle the repetition of the queue"
	},
	aliases: ["ql"],
	args: 0,
	usage: "",
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, language, languageCode) => {
		if (!message.member.voice.channelID || (message.client.player.getQueue(message.guild.id) && message.member.voice.channelID !== message.client.player.getQueue(message.guild.id).connection.channel.id)) return message.reply(language.errors.not_in_vc).catch(console.error);

		const isPlaying = message.client.player.isPlaying(message.guild.id);
		if (!isPlaying) return message.channel.send(language.errors.no_music).catch(console.error);
		
		const loop = message.client.player.toggleQueueLoop(message.guild.id);
		message.channel.send(language.get(language.looped, loop)).catch(console.error);
	}
};

module.exports = command;