const { Message } = require("discord.js");

const command = {
	name: "seek",
	description: {
		fr: "Chercher une partie de la musique",
		en: "Seek to a part of the song"
	},
	aliases: ["goto"],
	args: 1,
	usage: "<timestamp>",
	slashOptions: [
		{
			name: "timestamp",
			description: "The timestamp to seek in the song (e.g. 2:15)",
			type: 3,
			required: true
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, language, languageCode) => {
		const { Utils } = require("discord-music-player");
		
		if (!message.member.voice.channelID || (message.client.player.getQueue(message) && message.member.voice.channelID !== message.client.player.getQueue(message).connection.channel.id)) return message.reply(language.errors.not_in_vc).catch(console.error);
		
		const time = args
			? args[0]
			: options[0].value;
		const timeRegex = /(?:(\d+):)?([0-5]?\d):([0-5]\d)/;
		if (!timeRegex.test(time)) return message.reply(language.invalid_timestamp).catch(console.error);

		const isPlaying = message.client.player.isPlaying(message);
		if (!isPlaying) return message.channel.send(language.errors.no_music).catch(console.error);
		
		const timeInMs = Utils.TimeToMilliseconds(time);

		const song = await message.client.player.seek(message.guild.id, timeInMs);
		if (!song) return;

		message.channel.send(language.get(language.seeked, time, song.name)).catch(console.error);
	}
};

module.exports = command;