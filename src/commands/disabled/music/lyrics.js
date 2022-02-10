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
	botPerms: ["EMBED_LINKS", "ADD_REACTIONS", "MANAGE_MESSAGES"],
	options: [
		{
			name: "song",
			description: "The name of the song to search for",
			type: 3,
			required: false
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	run: async (message, args, options, language, languageCode) => {
		const lyricsFinder = require("lyrics-finder");
		const pagination = require("../utils/pagination");
		const { MessageEmbed } = require("discord.js")

		const isPlaying = message.client.player.isPlaying(message);
		const songName = args
			? args.length ? args.join(" ") : (isPlaying ? message.client.player.nowPlaying(message).name : null)
			: options ? options[0].value : (isPlaying ? message.client.player.nowPlaying(message).name : null);
		if (!songName) return message.reply(language.no_song).catch(console.error);

		if (!message.isInteraction) message.channel.startTyping(1);
		const lyrics = await lyricsFinder(songName);
		if (!message.isInteraction) message.channel.stopTyping();
		if (!lyrics) return message.reply(language.no_lyrics).catch(console.error);

		const linesPerPage = 20;
		const parsedLyrics = lyrics.match(new RegExp(`(.*\n){${linesPerPage}}`, "yg"));
		let pages = [];
		let embed = new MessageEmbed()
			.setAuthor(language.get(language.title, songName.replace(/^./, a => a.toUpperCase())), message.client.user.displayAvatarURL())
			.setColor(message.guild.me.displayColor)
			.setDescription(language.empty_lyrics);
		if (!parsedLyrics.length) pages.push(embed);

		for (i = 0; i < parsedLyrics.length; i++) {
			embed = new MessageEmbed()
			.setAuthor(language.get(language.title, songName.replace(/^./, a => a.toUpperCase())), message.client.user.displayAvatarURL())
			.setColor(message.guild.me.displayColor)
			.setDescription(parsedLyrics[i]);
			pages.push(embed);
		};
		
		pagination(message, pages, ["⏪", "⏩"], 300_000).catch(err => {
			console.error(err);
			message.channel.send(language.errors.paginator).catch(console.error);
		});
	}
};

module.exports = command;