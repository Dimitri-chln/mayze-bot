const { Message } = require("discord.js");

const command = {
	name: "stop",
	description: "Supprimer la queue entière et passer la musique actuelle",
	aliases: ["leave"],
	args: 0,
    usage: "",
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, language, languageCode) => {
		if (!message.member.voice.channelID || (message.client.player.getQueue(message.guild.id) && message.member.voice.channelID !== message.client.player.getQueue(message.guild.id).connection.channel.id)) return message.reply(language.errors.not_in_vc).catch(console.error);

		const isPlaying = message.client.player.isPlaying(message.guild.id);
		if (!isPlaying) return message.channel.send(language.errors.no_music).catch(console.error);
		
		message.client.player.stop(message.guild.id);
		message.channel.send(`<a:blackCheck:803603780666523699> | **Musique arrêtée**`).catch(console.error);
	}
};

module.exports = command;