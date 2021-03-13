const { Message } = require("discord.js");

const command = {
	name: "shuffle",
	description: "Mélanger la queue entière",
	aliases: [],
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
		
		const songs = message.client.player.shuffle(message.guild.id);
		message.channel.send(`<a:blackCheck:803603780666523699> | **Queue mélangée**\n> ${songs.length - 1} musiques ont été mélangées`).catch(console.error);
	}
};

module.exports = command;