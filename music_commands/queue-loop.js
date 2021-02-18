const { Message } = require("discord.js");

const command = {
	name: "queue-loop",
	description: "Activer ou désactiver la répétition de la queue",
	aliases: ["ql"],
	args: 0,
	usage: "",
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, languages, language) => {
		if (!message.member.voice.channelID || (message.client.player.getQueue(message.guild.id) && message.member.voice.channelID !== message.client.player.getQueue(message.guild.id).connection.channel.id)) return message.reply("tu n'es pas dans le même salon vocal que moi").catch(console.error);

		const isPlaying = message.client.player.isPlaying(message.guild.id);
		if (!isPlaying) return message.channel.send("Il n'y a aucune musique en cours sur ce serveur").catch(console.error);
		
		const loop = message.client.player.toggleLoopQueue(message.guild.id);
		message.channel.send(`<a:blackCheck:803603780666523699> | **Répétition de la queue ${loop ? "activée" : "désactivée"}**`).catch(console.error);
	}
};

module.exports = command;