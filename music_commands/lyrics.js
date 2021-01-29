const { Message } = require("discord.js");

const command = {
	name: "lyrics",
	description: "Obtenir les paroles de la musique actuelle",
	aliases: ["ly", "l"],
	args: 0,
	usage: "[musique]",
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options) => {
		const lyricsFinder = require("lyrics-finder");
		const pagination = require("../util/pagination");
		const { MessageEmbed } = require("discord.js")

		const isPlaying = message.client.player.isPlaying(message.guild.id);
		const songName = args
			? args.length ? args.join(" ") : (isPlaying ? (await message.client.player.nowPlaying(message.guild.id)).name : null)
			: options[0] ? options[0].value : (isPlaying ? (await message.client.player.nowPlaying(message.guild.id)).name : null);
		if (!songName) return message.reply("indique le nom de la chanson").catch(console.error);

		const lyrics = await lyricsFinder(songName);
		if (!lyrics) return message.reply("je n'ai pas trouvé de paroles correspondantes").catch(console.error);

		const linesPerPage = 20;
		const parsedLyrics = lyrics.match(new RegExp(`(.*\n){${linesPerPage}}`, "yg"));
		let pages = [];
		let embed = new MessageEmbed()
			.setAuthor(`Paroles de "${songName.replace(/^./, a => a.toUpperCase())}"`, message.client.user.avatarURL())
			.setColor("#010101")
			.setDescription("*Aucune parole*");
		if (!parsedLyrics.length) pages.push(embed);

		for (i = 0; i < parsedLyrics.length; i++) {
			embed = new MessageEmbed()
			.setAuthor(`Paroles de "${songName.replace(/^./, a => a.toUpperCase())}"`, message.client.user.avatarURL())
			.setColor("#010101")
			.setDescription(parsedLyrics[i]);
			pages.push(embed);
		};
		
		try {
			pagination(message, pages);
		} catch (err) {
			console.error(err);
			message.channel.send("Quelque chose s'est mal passé en créant le paginateur :/").catch(console.error);
		}
	}
};

module.exports = command;