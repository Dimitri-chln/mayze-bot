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
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, language, languageCode) => {
		if (!message.member.voice.channelID || (message.client.player.getQueue(message.guild.id) && message.member.voice.channelID !== message.client.player.getQueue(message.guild.id).connection.channel.id)) return message.reply(language.errors.not_in_vc).catch(console.error);
		
		const time = args
			? args[0]
			: options[0].value;
		const timeRegex = /(?:(\d+):)?([0-5]?\d):([0-5]\d)/;
		if (!timeRegex.test(time)) return message.reply(language.invalid_timestamp).catch(console.error);

		const isPlaying = message.client.player.isPlaying(message.guild.id);
		if (!isPlaying) return message.channel.send(language.errors.no_music).catch(console.error);
		
		const Util = require("../utils/music/Util");
		const timeInMs = Util.TimeToMilliseconds(time);

		const res = await message.client.player.seek(message.guild.id, timeInMs);
		message.channel.send(language.get(language.seeked, time, res.song.name)).catch(console.error);
	}
};

module.exports = command;