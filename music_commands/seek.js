const { Message } = require("discord.js");

const command = {
	name: "seek",
	description: "Chercher une partie de la musique",
	aliases: ["goto"],
	args: 1,
	usage: "<temps>",
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options) => {
		if (!message.member.voice.channelID || (message.client.player.getQueue(message.guild.id) && message.member.voice.channelID !== message.client.player.getQueue(message.guild.id).connection.channel.id)) return message.reply("tu n'es pas dans le même salon vocal que moi").catch(console.error);
		
		const time = args
			? args[0]
			: options[0].value;
		const timeRegex = /(?:(\d+):)?([0-5]?\d):([0-5]\d)/;
		if (!timeRegex.test(time)) return message.reply("le format est incorrect (hh:mm:ss)").catch(console.error);

		const isPlaying = message.client.player.isPlaying(message.guild.id);
		if (!isPlaying) return message.channel.send("Il n'y a aucune musique en cours sur ce serveur").catch(console.error);
		
		const { Util } = require("../util/MusicPlayer");
		const timeInMs = Util.TimeToMilliseconds(time);
		const song = message.client.player.seek(message.guild.id, timeInMs);
		message.channel.send(`<a:blackCheck:803603780666523699> | **Temps modifié (${time})**\n> ${song}`).catch(console.error);
	}
};

module.exports = command;