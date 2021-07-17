const { Message } = require("discord.js");

const command = {
	name: "now-playing",
	description: {
		fr: "Obtenir la musique actuelle",
		en: "Get the current song"
	},
	aliases: ["np"],
	args: 0,
	usage: "",
	botPerms: ["EMBED_LINKS"],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, language, languageCode) => {
		const isPlaying = message.client.player.isPlaying(message);
		if (!isPlaying) return message.channel.send(language.errors.no_music).catch(console.error);
		const queue = message.client.player.getQueue(message);
		
		const song = message.client.player.nowPlaying(message);

		const msg = await message.channel.send({
			embed: {
				author: {
					name: language.now_playing,
					icon_url: message.client.user.displayAvatarURL()
				},
				thumbnail: {
					url: song.thumbnail
				},
				color: message.guild.me.displayColor,
				description: language.get(language.description, song.name, song.url, message.client.player.createProgressBar(message), song.requestedBy, queue.repeatMode ? song.name : (queue.songs[1] ? queue.songs[1].name : (queue.repeatQueue ? queue.songs[0].name : "Ø")), queue.repeatMode || queue.repeatQueue || queue.autoplay ? "♾️" : queue.duration),
				footer: {
					text: language.get(language.footer, queue.repeatMode, queue.repeatQueue, queue.autoplay)
				}
			}
		}).catch(console.error);

		message.client.player.nowPlayings.set(message.channel.id, msg);
	}
};

module.exports = command;