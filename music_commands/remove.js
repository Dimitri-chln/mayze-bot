const { Message } = require("discord.js");

const command = {
	name: "remove",
	description: "Retirer une musique de la queue",
	aliases: [],
	args: 1,
    usage: "<n° musique> | <intervalle de musiques>",
    perms: ["KICK_MEMBERS"],
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, language, languageCode) => {
		// if (!message.member.voice.channelID || (message.client.player.getQueue(message.guild.id) && message.member.voice.channelID !== message.client.player.getQueue(message.guild.id).connection.channel.id)) return message.reply("tu n'es pas dans le même salon vocal que moi").catch(console.error);

		const numberRegex = /\d+(?:-\d+)?/g;

        const songs = args
            ? args.join(" ").match(numberRegex)
            : options[0].value.match(numberRegex);
        
		const isPlaying = message.client.player.isPlaying(message.guild.id);
		if (!isPlaying) return message.channel.send("Il n'y a aucune musique en cours sur ce serveur").catch(console.error);
		
		const queue = message.client.player.getQueue(message.guild.id);
		if (songs.join(" ").match(/\d+/g).some(s => s === 0 || s > queue.songs.length)) return message.reply("un des nombres est invalide (0 ou trop grand)");

		const songs = message.client.player.remove(message.guild.id, songs);
        if (!song) return message.reply("je n'ai pas trouvé cette musique dans la queue").catch(console.error);
		message.channel.send(`<a:blackCheck:803603780666523699> | **Musique supprimée**\n> ${song.name}`).catch(console.error);
	}
};

module.exports = command;