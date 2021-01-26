const { Message } = require("discord.js");

const command = {
	name: "playlist",
	description: "Ajouter une playlist entière à la queue",
	aliases: ["plist"],
	args: 0,
	usage: "",
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options) => {
		return message.channel.send("Soon™").catch(console.error);
		const playlistRegex = /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com)).*(youtu.be\/|list=)([^#\&\?]*).*/;
		const playlistLink = args
			? args[0]
			: options[0].value;
		if (!playlistRegex.test(playlistLink)) return message.reply("le lien est invalide").catch(console.error);
			
		const isPlaying = message.client.player.isPlaying(message.guild.id);
		const playlist = await message.client.player.playlist(message.guild.id, playlistLink, message.member.voice.channel, -1, message.author);
		message.channel.send(`<a:blackCheck:803603780666523699> | **Playlist ajoutée**\n> ${playlist.videoCount} musiques ont été ajoutées à la queue`).catch(console.error);
		if (!isPlaying) message.channel.send(`<a:blackCheck:803603780666523699> | **En train de jouer...**\n> ${playlist.song.name}`).catch(console.error);
	}
};

module.exports = command;