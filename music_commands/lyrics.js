const { Message } = require("discord.js");

const command = {
	name: "lyrics",
	description: {
		fr: "Obtenir les paroles de la musique actuelle",
		en: "Get the lyrics of the current song"
	},
	aliases: ["ly", "l"],
	args: 0,
	usage: "[<song>]",
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, language, languageCode) => {
		const lyricsFinder = require("lyrics-finder");
		const pagination = require("../utils/pagination");
		const { MessageEmbed } = require("discord.js")

		const isPlaying = message.client.player.isPlaying(message.guild.id);
		const songName = args
			? args.length ? args.join(" ") : (isPlaying ? (await message.client.player.nowPlaying(message.guild.id)).name : null)
			: options[0] ? options[0].value : (isPlaying ? (await message.client.player.nowPlaying(message.guild.id)).name : null);
		if (!songName) return message.reply(language.no_song).catch(console.error);

		message.channel.startTyping(1);
		const lyrics = await lyricsFinder(songName);
		message.channel.stopTyping();
		if (!lyrics) return message.reply(language.no_lyrics).catch(console.error);

		const linesPerPage = 20;
		const parsedLyrics = lyrics.match(new RegExp(`(.*\n){${linesPerPage}}`, "yg"));
		let pages = [];
		let embed = new MessageEmbed()
			.setAuthor(language.get(language.title, songName.replace(/^./, a => a.toUpperCase())), message.client.user.avatarURL())
			.setColor("#010101")
			.setDescription(language.empty_lyrics);
		if (!parsedLyrics.length) pages.push(embed);

		for (i = 0; i < parsedLyrics.length; i++) {
			embed = new MessageEmbed()
			.setAuthor(language.get(language.title, songName.replace(/^./, a => a.toUpperCase())), message.client.user.avatarURL())
			.setColor("#010101")
			.setDescription(parsedLyrics[i]);
			pages.push(embed);
		};
		
		try {
			pagination(message, pages, ["⏪", "⏩"], 300000);
		} catch (err) {
			console.error(err);
			message.channel.send(language.errors.paginator).catch(console.error);
		}
	}
};

module.exports = command;