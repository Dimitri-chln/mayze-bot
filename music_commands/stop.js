const { Message } = require("discord.js");

const command = {
	name: "stop",
	description: "Supprimer la queue entière et passer la musique actuelle",
	aliases: [],
	args: 0,
    usage: "",
    perms: ["KICK_MEMBERS"],
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options) => {
		const isPlaying = message.client.player.isPlaying(message.guild.id);
		if (!isPlaying) return message.channel.send("Il n'y a aucune musique en cours sur ce serveur").catch(console.error);
		message.client.player.stop(message.guild.id);
		message.channel.send(`<a:blackCheck:803603780666523699> | **Musique arrêtée**`).catch(console.error);
	}
};

module.exports = command;