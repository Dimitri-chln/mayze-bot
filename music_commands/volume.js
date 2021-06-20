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
	botPerms: ["USE_EXTERNAL_EMOJIS"],
	slashOptions: [
		{
			name: "volume",
			description: "The new volume",
			type: 4,
			required: false
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, language, languageCode) => {
		if (!message.member.voice.channelID || (message.client.player.getQueue(message) && message.member.voice.channelID !== message.client.player.getQueue(message).connection.channel.id)) return message.reply(language.errors.not_in_vc).catch(console.error);
		const isPlaying = message.client.player.isPlaying(message);
		if (!isPlaying) return message.channel.send(language.errors.no_music).catch(console.error);
		
		const volume = args
			? parseInt(args[0])
			: options ? options[0].value : NaN;
		if (isNaN(volume)) {
			const volume = message.client.player.getQueue(message).dispatcher.volumeLogarithmic * 200;
			message.channel.send(language.get(language.volume_info, volume)).catch(console.error);
			
		} else {
			if (volume < 0 || volume > 200) return message.reply(language.invalid_volume).catch(console.error);

			message.client.player.setVolume(message, volume);
			
			message.channel.send(language.get(language.volume_changed, volume)).catch(console.error);
		
		}
	}
};

module.exports = command;