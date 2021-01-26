const { Message } = require("discord.js");

const command = {
	name: "resume",
	description: "Reprndre la musique actuelle",
	aliases: [],
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
		const song = message.client.player.resume(message.guild.id);
		message.channel.send(`<a:blackCheck:803603780666523699> | **Musique reprise**\n> ${song.name}`).catch(console.error);
	}
};

module.exports = command;