const { Message } = require("discord.js");

const command = {
	name: "play",
	description: "Jouer une musique",
	aliases: ["p"],
	args: 0,
	usage: "",
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options) => {
		const isPlaying = message.client.player.isPlaying(message.guild.id);
        // If there's already a song playing
        if (isPlaying) {
            // Add the song to the queue
            const { song } = await message.client.player.addToQueue(message.guild.id, args.join(" "));
            message.channel.send(`<a:blackCheck:803603780666523699> | **Ajouté à la queue**\n> ${song.name}`).catch(console.error);
        } else {
            // Else, play the song
            const { song } = await message.client.player.play(message.member.voice.channel, args.join(" "));
            message.channel.send(`<a:blackCheck:803603780666523699> | **En train de jouer...**\n> ${song.name}`).catch(console.error);
        }
	}
};

module.exports = command;