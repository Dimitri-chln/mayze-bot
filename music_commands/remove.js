const { Message } = require("discord.js");

const command = {
	name: "remove",
	description: "Retirer une musique de la queue",
	aliases: ["rm"],
	args: 0,
    usage: "[n° musique] | [intervalle de musiques]...",
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, language, languageCode) => {
		if (!message.member.voice.channelID || (message.client.player.getQueue(message.guild.id) && message.member.voice.channelID !== message.client.player.getQueue(message.guild.id).connection.channel.id)) return message.reply(language.errors.not_in_vc).catch(console.error);

		const numberRegex = /\d+(?:-\d+)?/g;
		const checkRegex = /^(?:\d+(?:-\d+)?(?:\s|$))*/;

		if (!checkRegex.test(args ? args.join(" ") : options[0].value)) return message.reply("entre uniquement des nombres ou intervalles").catch(console.error);
        
		const isPlaying = message.client.player.isPlaying(message.guild.id);
		if (!isPlaying) return message.channel.send(language.errors.no_music).catch(console.error);
		const queue = message.client.player.getQueue(message.guild.id);
		if (queue.songs.length === 1) return message.reply("il n'y a aucune musique à supprimer").catch(console.error);

		const songs = args
            ? args.length ? args.join(" ").match(numberRegex) || [ "0" ] : [ (queue.songs.length - 1).toString() ]
            : options[0] ? options[0].value.match(numberRegex)|| [ "0" ] : [ (queue.songs.length - 1).toString() ];
		if (songs.join(" ").match(/\d+/g).some(s => parseInt(s) === 0 || parseInt(s) >= queue.songs.length)) return message.reply(`tous les nombres doivent être compris entre 1 et ${queue.songs.length - 1}`);

		const removedSongs = message.client.player.remove(message.guild.id, songs);
        if (!removedSongs) return message.reply("je n'ai pas trouvé l'une de ces musiques dans la queue").catch(console.error);
		message.channel.send(`<a:blackCheck:803603780666523699> | **${removedSongs.length} musique${removedSongs.length > 1 ? "s" : ""} supprimée${removedSongs.length > 1 ? "s" : ""}**${removedSongs.length === 1 ? "\n> " + removedSongs[0].name : ""}`).catch(console.error);
	}
};

module.exports = command;