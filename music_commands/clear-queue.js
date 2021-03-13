const { Message } = require("discord.js");

const command = {
	name: "clear-queue",
	description: {
		fr: "Supprimer la queue entière",
		en: "Delete the whole queue"
	},
	aliases: ["cq"],
	args: 0,
    usage: "",
    perms: ["KICK_MEMBERS"],
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
		
		message.client.player.clearQueue(message.guild.id);
		message.channel.send(language.deleted).catch(console.error);
	}
};

module.exports = command;