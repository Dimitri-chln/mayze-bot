const { Message } = require("discord.js");

const command = {
	name: "skip-to",
	description: {
		fr: "Passer directement à une certaine musique",
		en: "Skip to a certain song in the queue"
	},
	aliases: ["st"],
	args: 0,
	usage: "<#song>",
	slashOptions: [
		{
			name: "song",
			description: "The number of the song to skip to",
			type: 4,
			required: true
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
		const { length } = await message.client.player.getQueue(message);
		
        const songID = args
            ? parseInt(args[0])
            : options[0].value;
        if (isNaN(songID) || songID < 1 || songID >= length) return message.reply(language.get(invalid_number, length - 1)).catch(console.error);

		const song = await message.client.player.skipTo(message.guild.id, songID);
		message.channel.send(language.get(language.skipped, songID, songID > 1, song.name)).catch(console.error);
	}
};

module.exports = command;