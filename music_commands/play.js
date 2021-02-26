const { Message } = require("discord.js");

const command = {
	name: "play",
	description: "Jouer une musique",
	aliases: ["p"],
	args: 1,
	usage: "<musique> [-shuffle]",
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

		if (!message.member.voice.channelID || (message.client.player.getQueue(message.guild.id) && message.member.voice.channelID !== message.client.player.getQueue(message.guild.id).connection.channel.id)) return message.reply("tu n'es pas dans le même salon vocal que moi").catch(console.error);
		const isPlaying = message.client.player.isPlaying(message.guild.id);

		const playlistRegex = /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com)).*(youtu.be\/|list=)([^#\&\?]*).*/;
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
			Axios.get(search)
				.then(res => {
					let [ , scrap ] = res.data.match(/property="og:url" content="(.*)"/) || [];
					search = scrap;
				})
				.catch(err => {
					console.error(err);
					search = null;
				});
			
				if (!search) return message.reply("Quelque s'est mal passé en récupérant le lien Deezer");
		}
		
		if (playlistRegex.test(search) || SpotifyPlaylistRegex.test(search) || DeezerPlaylistRegex.test(search)) {
			message.channel.startTyping(1);
			const res = await message.client.player.playlist(message.guild.id, search, message.member.voice.channel, -1, message.author, shuffle);
			if (!res.playlist) {
				console.error(res.error);
				return message.channel.send("Quelque chose s'est mal passé en récupérant la playlist :/").catch(console.error);
			}

			message.channel.send(`<a:blackCheck:803603780666523699> | **Playlist ajoutée${shuffle ? " et mélangée" : ""}**\n> ${res.playlist.videoCount} musiques ont été ajoutées à la queue`).catch(console.error);
			if (!isPlaying) message.channel.send(`<a:blackCheck:803603780666523699> | **En train de jouer...**\n> ${res.song.name}`).catch(console.error);
			message.channel.stopTyping();

		} else {
			// If there's already a song playing
			if (isPlaying) {
				const queue = message.client.player.getQueue(message.guild.id);
				const duration = Util.MillisecondsToTime(queue.duration);
				// Add the song to the queue
				const res = await message.client.player.addToQueue(message.guild.id, search, null, message.author);
				if (!res.song) {
					console.error(res.error);
					return message.reply(`je n'ai pas trouvé de musique avec ce titre`).catch(console.error);
				}
				message.channel.send(`<a:blackCheck:803603780666523699> | **Ajouté à la queue • Joué dans ${duration}**\n> ${res.song.name}`).catch(console.error);

			} else {
				// Else, play the song
				const res = await message.client.player.play(message.member.voice.channel, search, null, message.author);
				if (!res.song) {
					console.error(res.error);
					return message.reply(`je n'ai pas trouvé de musique avec ce titre`).catch(console.error);
				}
				message.channel.send(`<a:blackCheck:803603780666523699> | **En train de jouer...**\n> ${res.song.name}`).catch(console.error);
			}
		}
	}
};

module.exports = command;