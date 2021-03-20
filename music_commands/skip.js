const { Message } = require("discord.js");

const command = {
	name: "skip",
	description: {
		fr: "Passer la musique actuelle",
		en: "Skip the current song"
	},
	aliases: ["s"],
	args: 0,
	usage: "",
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, language, languageCode) => {
		if (!message.member.voice.channelID || (message.client.player.getQueue(message.guild.id) && message.member.voice.channelID !== message.client.player.getQueue(message.guild.id).connection.channel.id)) return message.reply(language.errors.not_in_vc).catch(console.error);

		const isPlaying = message.client.player.isPlaying(message.guild.id);
		if (!isPlaying) return message.channel.send(language.errors.no_music).catch(console.error);
		
		const song = await message.client.player.skip(message.guild.id);
		message.channel.send(language.get(language.skipped, song.name)).catch(console.error);
	}
};

module.exports = command;