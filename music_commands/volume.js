const { Message } = require("discord.js");

const command = {
	name: "volume",
	description: {
		fr: "Ajuster le volume de la musique",
		en: "Adjust the volume of the music"
	},
	aliases: ["vol"],
	args: 0,
	usage: "[<volume>]",
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
		
		if (args[0]) {
			const volume = args
				? parseInt(args[0])
				: options[0].value;
			if (isNaN(volume) || volume < 0 || volume > 200) return message.reply(language.invalid_volume).catch(console.error);

			message.client.player.setVolume(message.guild.id, volume);
			message.channel.send(language.get(language.volume_changed, volume)).catch(console.error);
		
		} else {
			const volume = message.client.player.getQueue(message.guild.id).dispatcher.volumeLogarithmic * 200;
			message.channel.send(language.get(language.volume_info, volume)).catch(console.error);
		}
	}
};

module.exports = command;