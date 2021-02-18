const { Message } = require("discord.js");

const command = {
	name: "clear-queue",
	description: "Supprimer la queue entière",
	aliases: ["cq"],
	args: 0,
    usage: "",
    perms: ["KICK_MEMBERS"],
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, language, languageCode) => {
		if (!message.member.voice.channelID || (message.client.player.getQueue(message.guild.id) && message.member.voice.channelID !== message.client.player.getQueue(message.guild.id).connection.channel.id)) return message.reply("tu n'es pas dans le même salon vocal que moi").catch(console.error);

		const isPlaying = message.client.player.isPlaying(message.guild.id);
		if (!isPlaying) return message.channel.send("Il n'y a aucune musique en cours sur ce serveur").catch(console.error);
		
		message.client.player.clearQueue(message.guild.id);
		message.channel.send(`<a:blackCheck:803603780666523699> | **Queue supprimée**`).catch(console.error);
	}
};

module.exports = command;