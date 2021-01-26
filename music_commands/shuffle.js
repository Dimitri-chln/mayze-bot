const { Message } = require("discord.js");

const command = {
	name: "shuffle",
	description: "Mélanger la queue entière",
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
		const songs = message.client.player.shuffle(message.guild.id);
		message.channel.send(`<a:blackCheck:803603780666523699> | **Queue mélangée**\n> ${songs.length} musiques ont été mélangées`).catch(console.error);
	}
};

module.exports = command;