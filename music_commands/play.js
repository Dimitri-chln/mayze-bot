const { Message } = require("discord.js");

const command = {
	name: "play",
	description: "Jouer une musique",
	aliases: ["p"],
	args: 1,
	usage: "<recherche>",
	cooldown: 5,
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options) => {
		if (!message.member.voice.channelID || (message.client.player.getQueue(message.guild.id) && message.member.voice.channelID !== message.client.player.getQueue(message.guild.id).connection.channel.id)) return message.reply("tu n'es pas dans le même salon vocal que moi").catch(console.error);

		const playlistRegex = /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com)).*(youtu.be\/|list=)([^#\&\?]*).*/;
		const search = args
			? args.join(" ")
			: options[0].value;
		if (playlistRegex.test(search)) return message.reply("les playlists ne sont pas supportées pour le moment").catch(console.error);
		
		const isPlaying = message.client.player.isPlaying(message.guild.id);
        // If there's already a song playing
        if (isPlaying) {
            // Add the song to the queue
            const { song } = await message.client.player.addToQueue(message.guild.id, search, null, message.author);
            message.channel.send(`<a:blackCheck:803603780666523699> | **Ajouté à la queue**\n> ${song.name}`).catch(console.error);
        } else {
            // Else, play the song
            const { song } = await message.client.player.play(message.member.voice.channel, search, null, message.author);
            message.channel.send(`<a:blackCheck:803603780666523699> | **En train de jouer...**\n> ${song.name}`).catch(console.error);
        }
	}
};

module.exports = command;