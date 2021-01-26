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
		const isPlaying = message.client.player.isPlaying(message.guild.id);
		if (!isPlaying) return message.channel.send("Il n'y a aucune musique en cours sur ce serveur").catch(console.error);
		
		const queue = await message.client.player.getQueue(message.guild.id);
		message.channel.send({
			embed: {
				author: {
					name: `Queue de ${message.guild.name}`,
					icon_url: message.client.user.avatarURL()
				},
				color: "#010101",
				description: queue.songs.map((song, i) => `${i === 0 ? "**En cours -**" : `\`${i}.\``} ${song.name}`).join('\n'),
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;