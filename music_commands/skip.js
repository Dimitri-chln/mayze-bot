const { Message } = require("discord.js");

const command = {
	name: "skip",
	description: "Passer la musique actuelle",
	aliases: ["s"],
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
		const song  = await message.client.player.skip(message.guild.id);
		message.channel.send(`<a:blackCheck:803603780666523699> | **Musique passée**\n> ${song.name}`).catch(console.error);
	}
};

module.exports = command;