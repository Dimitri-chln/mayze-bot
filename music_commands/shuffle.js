const { Message } = require("discord.js");

const command = {
	name: "shuffle",
	description: {
		fr: "Mélanger la queue entière",
		en: "Shuffle the whole queue"
	},
	aliases: [],
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
		
		const songs = message.client.player.shuffle(message);
		message.channel.send(language.get(language.shuffled, songs.length - 1, songs.length === 2)).catch(console.error);
	}
};

module.exports = command;