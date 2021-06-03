const { BetterMessage } = require("../utils/better-discord");

const command = {
	name: "resume",
	description: {
		fr: "Reprendre la musique actuelle",
		en: "Resume the current song"
	},
	aliases: [],
	args: 0,
	usage: "",
	/**
	 * @param {BetterMessage} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, language, languageCode) => {
		if (!message.member.voice.channelID || (message.client.player.getQueue(message) && message.member.voice.channelID !== message.client.player.getQueue(message).connection.channel.id)) return message.reply(language.errors.not_in_vc).catch(console.error);

		const isPlaying = message.client.player.isPlaying(message);
		if (!isPlaying) return message.channel.send(language.errors.no_music).catch(console.error);
		
		const song = message.client.player.resume(message);
		message.channel.send(language.get(language.resumed, song.name)).catch(console.error);
	}
};

module.exports = command;