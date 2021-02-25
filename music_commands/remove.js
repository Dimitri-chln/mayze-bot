const { Message } = require("discord.js");

const command = {
	name: "remove",
	description: "Retirer une musique de la queue",
	aliases: ["rm"],
	args: 0,
    usage: "[n° musique] | [intervalle de musiques]...",
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, language, languageCode) => {
		if (!message.member.voice.channelID || (message.client.player.getQueue(message.guild.id) && message.member.voice.channelID !== message.client.player.getQueue(message.guild.id).connection.channel.id)) return message.reply("tu n'es pas dans le même salon vocal que moi").catch(console.error);

		const numberRegex = /\d+(?:-\d+)?/g;
        
		const isPlaying = message.client.player.isPlaying(message.guild.id);
		if (!isPlaying) return message.channel.send("Il n'y a aucune musique en cours sur ce serveur").catch(console.error);
		const queue = message.client.player.getQueue(message.guild.id);

		const songs = args
            ? args.length ? args.join(" ").match(numberRegex) : [ queue.songs.length.toString() ]
            : options[0] ? options[0].value.match(numberRegex) : [ queue.songs.length.toString() ];
		if (songs.join(" ").match(/\d+/g).some(s => s === 0 || s > queue.songs.length)) return message.reply("un des nombres est invalide (0 ou trop grand)");

		const removedSongs = message.client.player.remove(message.guild.id, songs);
        if (!removedSongs) return message.reply("je n'ai pas trouvé l'une de ces musiques dans la queue").catch(console.error);
		message.channel.send(`<a:blackCheck:803603780666523699> | **${removedSongs.length} musique${removedSongs.length > 1 ? "s" : ""} supprimée${removedSongs.length > 1 ? "s" : ""}**${removedSongs.length === 1 ? "\n> " + removedSongs[0].name : ""}`).catch(console.error);
	}
};

module.exports = command;