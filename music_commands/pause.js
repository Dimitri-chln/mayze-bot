const { Message } = require("discord.js");

const command = {
	name: "pause",
	description: {
		fr: "Mettre en pause la musique actuelle",
		en: "Pause the current song"
	},
	aliases: [],
	args: 0,
	usage: "",
	botPerms: ["USE_EXTERNAL_EMOJIS"],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, language, languageCode) => {
		if (!message.member.voice.channelID || (message.client.player.getQueue(message) && message.member.voice.channelID !== message.client.player.getQueue(message).connection.channel.id)) return message.reply(language.errors.not_in_vc).catch(console.error);

		const isPlaying = message.client.player.isPlaying(message);
		if (!isPlaying) return message.channel.send(language.errors.no_music).catch(console.error);
		
		const song = message.client.player.pause(message);
		message.channel.send(language.get(language.paused, song.name)).catch(console.error);
	}
};

module.exports = command;