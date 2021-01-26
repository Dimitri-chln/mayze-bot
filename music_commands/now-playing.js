const { Message } = require("discord.js");

const command = {
	name: "now-playing",
	description: "Obtenir la musique actuelle",
	aliases: ["np"],
	args: 0,
	usage: "",
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options) => {
		const isPlaying = message.client.player.isPlaying(message.guild.id);
		if (!isPlaying) return message.channel.send("Il n'y a aucune musique en cours sur ce serveur").catch(console.error);
		const song = await message.client.player.nowPlaying(message.guild.id);
		message.channel.send({
			embed: {
				author: {
					name: "Musique en cours",
					icon_url: message.client.user.avatarURL()
				},
				thumbnail: {
					url: song.thumbnail
				},
				color: "#010101",
				description: `[${song.name}](${song.url})\n\n**${message.client.player.createProgressBar(message.guild.id)}**\n\n\`Ajouté par:\` **${song.requestedBy.tag}**\n\`Suivant:\` **${song.queue.songs[1] ? song.queue.songs[1].name : "Rien"}**`,
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);
		
	}
};

module.exports = command;