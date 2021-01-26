const { Message } = require("discord.js");

const command = {
	name: "volume",
	description: "Ajuster le volume de la musique",
	aliases: ["vol"],
	args: 1,
	usage: "<volume en %>",
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options) => {
        const newVolume = args
            ? parseInt(args[0], 10)
            : options[0].value;
        if (isNaN(newVolume) || newVolume < 0 || newVolume > 100) return message.reply("le volume doit être compris en 0 et 100").catch(console.error);

		const isPlaying = message.client.player.isPlaying(message.guild.id);
		if (!isPlaying) return message.channel.send("Il n'y a aucune musique en cours sur ce serveur").catch(console.error);
		message.client.player.setVolume(message.guild.id);
		message.channel.send(`<a:blackCheck:803603780666523699> | **Volume modifié**\n> ${newVolume}%`).catch(console.error);
	}
};

module.exports = command;