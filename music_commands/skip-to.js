const { Message } = require("discord.js");

const command = {
	name: "skip-to",
	description: "Passer directement à une certaine musique",
	aliases: ["st"],
	args: 0,
	usage: "<n° musique>",
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options) => {
		if (!message.member.voice.channelID || (message.client.player.getQueue(message.guild.id) && message.member.voice.channelID !== message.client.player.getQueue(message.guild.id).connection.channel.id)) return message.reply("tu n'es pas dans le même salon vocal que moi").catch(console.error);

		const isPlaying = message.client.player.isPlaying(message.guild.id);
		if (!isPlaying) return message.channel.send("Il n'y a aucune musique en cours sur ce serveur").catch(console.error);
        
        const songID = args
            ? parseInt(args[0])
            : options[0].value;
        if (isNaN(songID) || songID < 0) return message.reply(`le numéro de la chanson doit être positif`).catch(console.error);

		const song = await message.client.player.skipTo(message.guild.id, songID);
		message.channel.send(`<a:blackCheck:803603780666523699> | **${songID} musique${songID < 2 ? "" : "s"} passée${songID < 2 ? "" : "s"}**\n> ${song.name}`).catch(console.error);
	}
};

module.exports = command;