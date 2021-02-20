const { Message } = require("discord.js");

const command = {
	name: "play",
	description: "Jouer une musique",
	aliases: ["p"],
	args: 1,
	usage: "<musique>",
	cooldown: 5,
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, language, languageCode) => {
		const Util = require("../utils/music/Util");

		if (!message.member.voice.channelID || (message.client.player.getQueue(message.guild.id) && message.member.voice.channelID !== message.client.player.getQueue(message.guild.id).connection.channel.id)) return message.reply("tu n'es pas dans le même salon vocal que moi").catch(console.error);
		const isPlaying = message.client.player.isPlaying(message.guild.id);

		const playlistRegex = /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com)).*(youtu.be\/|list=)([^#\&\?]*).*/;
		const SpotifyPlaylistRegex = /https?:\/\/(?:open\.)(?:spotify\.com\/)(?:playlist\/)((?:\w|-){22})/;

		const search = args
			? args.join(" ")
			: options[0].value;
		
		if (playlistRegex.test(search) || SpotifyPlaylistRegex.test(search)) {
			message.channel.startTyping(1);
			const playlist = await message.client.player.playlist(message.guild.id, search, message.member.voice.channel, -1, message.author);
			message.channel.send(`<a:blackCheck:803603780666523699> | **Playlist ajoutée**\n> ${playlist.playlist.videoCount} musiques ont été ajoutées à la queue`).catch(console.error);
			if (!isPlaying) message.channel.send(`<a:blackCheck:803603780666523699> | **En train de jouer...**\n> ${playlist.song.name}`).catch(console.error);
			message.channel.stopTyping();

		} else {
		
			// If there's already a song playing
			if (isPlaying) {
				const queue = message.client.player.getQueue(message.guild.id);
				const duration = Util.MillisecondsToTime(queue.duration - (queue.dispatcher ? queue.dispatcher.streamTime : 0));
				// Add the song to the queue
				const res = await message.client.player.addToQueue(message.guild.id, search, null, message.author);
				if (!res.song) return message.reply(`je n'ai pas trouvé de musique avec ce titre`).catch(console.error);
				message.channel.send(`<a:blackCheck:803603780666523699> | **Ajouté à la queue • Joué dans ${duration}**\n> ${res.song.name}`).catch(console.error);
			} else {
				// Else, play the song
				const res = await message.client.player.play(message.member.voice.channel, search, null, message.author);
				if (!res.song) return message.reply(`je n'ai pas trouvé de musique avec ce titre`).catch(console.error);
				message.channel.send(`<a:blackCheck:803603780666523699> | **En train de jouer...**\n> ${res.song.name}`).catch(console.error);
			}
		}
	}
};

module.exports = command;