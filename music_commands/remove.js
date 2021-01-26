const { Message } = require("discord.js");

const command = {
	name: "remove",
	description: "Retirer une musique de la queue",
	aliases: [],
	args: 1,
    usage: "<n° musique>",
    perms: ["KICK_MEMBERS"],
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options) => {
        const songID = args
            ? parseInt(args[0], 10)
            : options[0].value;
        if (isNaN(songID) || songID < 0) return message.reply("le numéro de la chanson doit être positif").catch(console.error);

		const isPlaying = message.client.player.isPlaying(message.guild.id);
		if (!isPlaying) return message.channel.send("Il n'y a aucune musique en cours sur ce serveur").catch(console.error);
        const song = message.client.player.remove(message.guild.id, songID);
        if (!song) return message.reply("je n'ai pas trouvé cette musique dans la queue").catch(console.error);
		message.channel.send(`<a:blackCheck:803603780666523699> | **Musique supprimée**\n> ${song.name}`).catch(console.error);
	}
};

module.exports = command;