const { Message } = require("discord.js");

const command = {
	name: "loop",
	description: "Activer ou désactiver la répétition de la musique actuelle",
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
		const loop = message.client.player.toggleLoop(message.guild.id);
		message.channel.send(`<a:blackCheck:803603780666523699> | **Répétition ${loop ? "activée" : "désactivée"}**`).catch(console.error);
	}
};

module.exports = command;