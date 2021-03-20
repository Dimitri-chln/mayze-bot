const { Message } = require("discord.js");

const command = {
	name: "move",
	description: {
		fr: "Déplacer une musique dans la queue",
		en: "Move a song in the queue"
	},
	aliases: [],
	args: 1,
    usage: "<#song> <position>",
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

        const songID = args
            ? parseInt(args[0])
            : options[0].value;
        if (isNaN(songID) || songID < 0) return message.reply(language.invalid_song).catch(console.error);
        const position = args
            ? parseInt(args[1])
            : options[1].value;
        if (isNaN(position) || position < 0) return message.reply(language.invalid_pos).catch(console.error);
		
		const song = message.client.player.move(message.guild.id, songID, position);
        if (!song || song.error) return message.reply(language.invalid_song).catch(console.error);
		message.channel.send(language.get(language.song_moved, song.name)).catch(console.error);
	}
};

module.exports = command;