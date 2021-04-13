const { Message } = require("discord.js");

const command = {
	name: "queue",
	description: {
		fr: "Obtenir la queue du serveur",
		en: "Get the queue of the server"
	},
	aliases: ["q"],
	args: 0,
	usage: "",
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, language, languageCode) => {
		const pagination = require("../utils/pagination");
		const { MessageEmbed } = require("discord.js");
		const Util = require("../utils/music/Util");
		const isPlaying = message.client.player.isPlaying(message.guild.id);
		if (!isPlaying) return message.channel.send(language.errors.no_music).catch(console.error);
		
		const queue = message.client.player.getQueue(message.guild.id);

		const songsPerPage = 15;
		let pages = [];
		let embed = new MessageEmbed()
			.setAuthor(language.get(language.author, message.guild.name), message.client.user.avatarURL())
			.setTitle(language.get(language.title, Util.MillisecondsToTime(queue.duration)))
			.setColor(message.guild.me.displayHexColor)
			.setDescription(language.no_song);
		if (!queue.songs.length) pages.push(embed);

		for (i = 0; i < queue.songs.length; i += songsPerPage) {
			embed = new MessageEmbed()
			.setAuthor(language.get(language.author, message.guild.name), message.client.user.avatarURL())
			.setTitle(language.get(language.title, Util.MillisecondsToTime(queue.duration)))
			.setColor(message.guild.me.displayHexColor)
			.setDescription(queue.songs.slice(i, i + songsPerPage).map((song, j) => `${i + j === 0 ? language.now_playing : `\`${i + j}.\``} ${song.name}${i + j === 0 ? "\n" : ""}`).join("\n"));
			pages.push(embed);
		};
		
		pagination(message, pages);
	}
};

module.exports = command;