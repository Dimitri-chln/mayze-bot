const { Message } = require("discord.js");

const command = {
	name: "play-skip",
	description: {
		fr: "Jouer immédiatement une musique",
		en: "Play a song immediately"
	},
	aliases: ["ps"],
	args: 1,
	usage: "<song>",
	cooldown: 5,
	slashOptions: [
		{
			name: "song",
			description: "The song to play",
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
		if (!message.member.voice.channelID || (message.client.player.getQueue(message) && message.member.voice.channelID !== message.client.player.getQueue(message).connection.channel.id)) return message.reply(language.errors.not_in_vc).catch(console.error);

		const playlistRegex = /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com)).*(youtu.be\/|list=)([^#\&\?]*).*/;
		const search = args
			? args.join(" ")
			: options[0].value;
		if (playlistRegex.test(search)) return message.reply(language.playlists_unsupported).catch(console.error);
		
		const res = await message.client.player.playskip(message.guild.id, message.member.voice.channel, search, null, message.author);
		if (!res.song) return message.reply(language.no_song).catch(console.error);
		message.channel.send(language.get(language.playing, res.song.name)).catch(console.error);
	}
};

module.exports = command;