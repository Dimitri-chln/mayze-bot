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
		const Axios = require("axios").default;

		if (!message.member.voice.channelID || (message.client.player.getQueue(message) && message.member.voice.channelID !== message.client.player.getQueue(message).connection.channel.id)) return message.reply(language.errors.not_in_vc).catch(console.error);
		const isPlaying = message.client.player.isPlaying(message);

		const videoRegex = /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))((?!channel)(?!user)\/(?:[\w\-]+\?v=|embed\/|v\/)?)((?!channel)(?!user)[\w\-]+)(\S+)?$/;
		const playlistRegex = /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com)).*(youtu.be\/|list=)([^#&\?]*).*/;
		const SpotifyPlaylistRegex = /https?:\/\/(?:open\.)(?:spotify\.com\/)(?:playlist\/)((?:\w|-){22})/;
		// const DeezerPlaylistRegex = /https?:\/\/(?:www\.)?deezer\.com\/(?:\w{2}\/)?playlist\/(\d+)/;
		// const DeezerRegexScrap = /https?:\/\/deezer\.page\.link\/\w+/;

		let search = args
			? args.filter(a => a !== "-shuffle").join(" ")
			: options[0].value;
		const shuffle = args
			? args.includes("-shuffle")
			: options[1].value.includes("-shuffle");

		// if (DeezerRegexScrap.test(search)) {
		// 	const res = await Axios.get(search).catch(err => {
		// 		console.error(err);
		// 		search = null;
		// 	});
		// 	let [ , scrap ] = res.data.match(/property="og:url" content="(.*)"/) || [];
		// 	search = scrap;
			
		// 	if (!search) return message.reply(language.error_deezer).catch(console.error);
		// }
		
		if ((playlistRegex.test(search) || SpotifyPlaylistRegex.test(search)) /*|| DeezerPlaylistRegex.test(search))*/ && !videoRegex.test(search)) {
			if (!message.isInteraction) message.channel.startTyping(1);

			const playlist = await message.client.player.playlist(message, {
				search,
				maxSongs: -1,
				requestedBy: message.author.tag,
				shuffle
			});

			if (!playlist) {
				console.error(res.error);
				if (!message.isInteraction) message.channel.stopTyping();
				return message.channel.send(language.error_playlist).catch(console.error);
			}

			if (!message.isInteraction) message.channel.stopTyping();

		} else {

			if (isPlaying) {
				const song = await message.client.player.addToQueue(message, {
					search,
					requestedBy: message.author.tag
				});

				if (!song) {
					console.error(res.error);
					return message.reply(language.no_song).catch(console.error);
				}

			} else {
				const song = await message.client.player.play(message, {
					search,
					requestedBy: message.author.tag
				});

				if (!song) return message.reply(language.no_song).catch(console.error);
			}
		}
	}
};

module.exports = command;