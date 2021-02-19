const { Message } = require("discord.js");

const command = {
	name: "volume",
	description: "Ajuster le volume de la musique",
	aliases: ["vol"],
	args: 1,
	usage: "<volume>",
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, language, languageCode) => {
		if (!message.member.voice.channelID || (message.client.player.getQueue(message.guild.id) && message.member.voice.channelID !== message.client.player.getQueue(message.guild.id).connection.channel.id)) return message.reply("tu n'es pas dans le même salon vocal que moi").catch(console.error);
		
		const volume = args
			? parseInt(args[0])
			: options[0].value;
		if (isNaN(volume) || volume < 0 || volume > 100) return message.reply("le volume doit être compris entre 0 et 100").catch(console.error);

		const isPlaying = message.client.player.isPlaying(message.guild.id);
		if (!isPlaying) return message.channel.send("Il n'y a aucune musique en cours sur ce serveur").catch(console.error);

		const volume = message.client.player.setVolume(message.guild.id, volume);
		message.channel.send(`<a:blackCheck:803603780666523699> | **Volume modifié**\n> ${volume}%`).catch(console.error);
	}
};

module.exports = command;