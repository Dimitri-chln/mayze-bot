const { Message } = require("discord.js");

const command = {
	name: "queue",
	description: "Obtenir la queue du serveur",
	aliases: ["q"],
	args: 0,
	usage: "",
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options) => {
		const pagination = require("../util/pagination");
		const { MessageEmbed } = require("discord.js");
		const isPlaying = message.client.player.isPlaying(message.guild.id);
		if (!isPlaying) return message.channel.send("Il n'y a aucune musique en cours sur ce serveur").catch(console.error);
		
		const queue = await message.client.player.getQueue(message.guild.id);

		const songsPerPage = 15;
		let pages = [];
		let embed = new MessageEmbed()
			.setAuthor(`Queue de ${message.guild.name}`, message.client.user.avatarURL())
			.setColor("#010101")
			.setDescription("*Aucune musique*");
		if (!queue.songs.length) pages.push(embed);

		for (i = 0; i < queue.songs.length; i += songsPerPage) {
			embed = new MessageEmbed()
			.setAuthor(`Queue de ${message.guild.name}`, message.client.user.avatarURL())
			.setColor("#010101")
			.setDescription(queue.songs.slice(i, i + songsPerPage).map((song, j) => `${i + j === 0 ? "**En cours -**" : `\`${i + j}.\``} ${song.name}${i + j === 0 ? "\n" : ""}`).join("\n"));
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