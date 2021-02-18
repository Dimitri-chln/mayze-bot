const { Message } = require("discord.js");

const command = {
	name: "playlist",
	description: "Activer ou désactiver la répétition de la musique actuelle",
	aliases: ["plist", "pl"],
	args: 0,
	usage: "play <playlist> [-me] | add <nom> <url> | remove <nom>",
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, language) => {
		if (!message.member.voice.channelID || (message.client.player.getQueue(message.guild.id) && message.member.voice.channelID !== message.client.player.getQueue(message.guild.id).connection.channel.id)) return message.reply("tu n'es pas dans le même salon vocal que moi").catch(console.error);

		const isPlaying = message.client.player.isPlaying(message.guild.id);
		if (!isPlaying) return message.channel.send("Il n'y a aucune musique en cours sur ce serveur").catch(console.error);
		
		const playlistName = args.join(" ");

        if (playlistName) {

        } else {

        }

		message.channel.send(`<a:blackCheck:803603780666523699> | **Répétition ${loop ? "activée" : "désactivée"}**`).catch(console.error);
	}
};

module.exports = command;