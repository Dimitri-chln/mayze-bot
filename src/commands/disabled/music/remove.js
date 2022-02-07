const { Message } = require("discord.js");

const command = {
	name: "remove",
	description: {
		fr: "Retirer une musique de la queue",
		en: "Remove a song from the queue"
	},
	aliases: ["rm"],
	args: 0,
    usage: "[<#song>] | <#songs interval>]...",
	botPerms: ["USE_EXTERNAL_EMOJIS"],
	options: [
		{
			name: "songs",
			description: "The songs numbers or song intervals (e.g. 6-13)",
			type: 3,
			required: false
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	run: async (message, args, options, language, languageCode) => {
		if (!message.member.voice.channelID || (message.client.player.getQueue(message) && message.member.voice.channelID !== message.client.player.getQueue(message).connection.channel.id)) return message.reply(language.errors.not_in_vc).catch(console.error);

		const numberRegex = /\d+(?:-\d+)?/g;
		const checkRegex = /^(?:\d+(?:-\d+)?(?:\s|$))*/;

		if (!checkRegex.test(args ? args.join(" ") : options[0].value)) return message.reply(language.invalid_input).catch(console.error);
        
		const isPlaying = message.client.player.isPlaying(message);
		if (!isPlaying) return message.channel.send(language.errors.no_music).catch(console.error);
		const queue = message.client.player.getQueue(message);
		if (queue.songs.length === 1) return message.reply(language.no_song).catch(console.error);

		const songs = args
            ? args.length ? args.join(" ").match(numberRegex) || [ "0" ] : [ (queue.songs.length - 1).toString() ]
            : options[0] ? options[0].value.match(numberRegex) || [ "0" ] : [ (queue.songs.length - 1).toString() ];
		if (songs.join(" ").match(/\d+/g).some(s => parseInt(s) === 0 || parseInt(s) >= queue.songs.length)) return message.reply(language.get(language.invalid_numbers, queue.songs.length - 1));

		const removedSongs = message.client.player.remove(message, songs);
		message.channel.send(language.get(language.removed, removedSongs.length, removedSongs.length > 1, removedSongs.length === 1 ? "\n> " + removedSongs[0].name : "")).catch(console.error);
	}
};

module.exports = command;