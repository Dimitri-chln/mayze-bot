const { Message } = require("discord.js");

const command = {
	name: "auto-play",
	description: {
		fr: "Ajouter de nouvelles musiques automatiquement",
		en: "Add new songs automatically"
	},
	aliases: ["autoplay", "ap"],
	args: 0,
    usage: "",
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, language, languageCode) => {
		if (!message.member.voice.channelID || (message.client.player.getQueue(message) && message.member.voice.channelID !== message.client.player.getQueue(message).connection.channel.id)) return message.reply(language.errors.not_in_vc).catch(console.error);

		const isPlaying = message.client.player.isPlaying(message);
		if (!isPlaying) return message.channel.send(language.errors.no_music).catch(console.error);
		
		const autoPlay = message.client.player.toggleAutoPlay(message);
		message.channel.send(language.get(language.toggled, autoPlay)).catch(console.error);
	}
};

module.exports = command;