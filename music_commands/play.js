const { Message } = require("discord.js");

const command = {
	name: "play",
	description: {
		fr: "Jouer une musique",
		en: "Play a song"
	},
	aliases: ["p"],
	args: 1,
	usage: "<song> [-shuffle]",
	cooldown: 5,
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, language, languageCode) => {
		const Axios = require("axios").default;
		const Util = require("../utils/music/Util");

		if (!message.member.voice.channelID || (message.client.player.getQueue(message.guild.id) && message.member.voice.channelID !== message.client.player.getQueue(message.guild.id).connection.channel.id)) return message.reply(language.errors.not_in_vc).catch(console.error);
		const isPlaying = message.client.player.isPlaying(message.guild.id);

		const videoRegex = /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))((?!channel)(?!user)\/(?:[\w\-]+\?v=|embed\/|v\/)?)((?!channel)(?!user)[\w\-]+)(\S+)?$/;
		const playlistRegex = /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com)).*(youtu.be\/|list=)([^#&\?]*).*/;
		const SpotifyPlaylistRegex = /https?:\/\/(?:open\.)(?:spotify\.com\/)(?:playlist\/)((?:\w|-){22})/;
		const DeezerPlaylistRegex = /https?:\/\/(?:www\.)?deezer\.com\/(?:\w{2}\/)?playlist\/(\d+)/;
		const DeezerRegexScrap = /https?:\/\/deezer\.page\.link\/\w+/;

		let search = args
			? args.filter(a => a !== "-shuffle").join(" ")
			: options[0].value;
		const shuffle = args
			? args.includes("-shuffle")
			: options[1].value.includes("-shuffle");

		if (DeezerRegexScrap.test(search)) {
			const res = await Axios.get(search).catch(err => {
				console.error(err);
				search = null;
			});
			let [ , scrap ] = res.data.match(/property="og:url" content="(.*)"/) || [];
			search = scrap;
			
			if (!search) return message.reply(language.error_deezer).catch(console.error);
		}
		
		if ((playlistRegex.test(search) || SpotifyPlaylistRegex.test(search) || DeezerPlaylistRegex.test(search)) && !videoRegex.test(search)) {
			message.channel.startTyping(1);
			const res = await message.client.player.playlist(message.guild.id, search, message.member.voice.channel, -1, message.author, shuffle);
			if (!res.playlist) {
				console.error(res.error);
				message.channel.stopTyping();
				return message.channel.send(language.error_playlist).catch(console.error);
			}

			message.channel.send(language.get(language.playlist_added, shuffle, res.playlist.videoCount)).catch(console.error);
			if (!isPlaying) message.channel.send(language.get(language.playing, res.song.name)).catch(console.error);
			message.channel.stopTyping();

		} else {
			// If there's already a song playing
			if (isPlaying) {
				const queue = message.client.player.getQueue(message.guild.id);
				// Add the song to the queue
				const res = await message.client.player.addToQueue(message.guild.id, search, null, message.author);
				if (!res.song) {
					console.error(res.error);
					return message.reply(language.no_song).catch(console.error);
				}
				message.channel.send(language.get(language.added_to_queue, Util.MillisecondsToTime(queue.duration), res.song.name)).catch(console.error);

			} else {
				// Else, play the song
				const res = await message.client.player.play(message.member.voice.channel, search, null, message.author);
				if (!res.song) {
					console.error(res.error);
					return message.reply(language.no_song).catch(console.error);
				}
				message.channel.send(language.get(language.playing, res.song.name)).catch(console.error);
			}
		}
	}
};

module.exports = command;