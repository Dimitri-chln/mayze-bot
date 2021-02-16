const { Message } = require("discord.js");

const command = {
	name: "move",
	description: "Déplacer une musique dans la queue",
	aliases: [],
	args: 1,
    usage: "<n° musique> <position>",
    perms: ["KICK_MEMBERS"],
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

        const songID = args
            ? parseInt(args[0])
            : options[0].value;
        if (isNaN(songID) || songID < 0) return message.reply(`le numéro de la chanson doit être positif`).catch(console.error);
        const position = args
            ? parseInt(args[1])
            : options[1].value;
        if (isNaN(position) || position < 0) return message.reply(`la position doit être positive`).catch(console.error);
		
		const song = message.client.player.move(message.guild.id, songID, position);
        if (!song || song.error) return message.reply("je n'ai pas trouvé cette musique dans la queue").catch(console.error);
		message.channel.send(`<a:blackCheck:803603780666523699> | **Musique déplacée**\n> ${song.name}`).catch(console.error);
	}
};

module.exports = command;