const { Message } = require("discord.js");

const command = {
	name: "play-skip",
	description: "Jouer immédiatement une musique",
	aliases: ["ps"],
	args: 1,
	usage: "<musique>",
	cooldown: 5,
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, language) => {
		if (!message.member.voice.channelID || (message.client.player.getQueue(message.guild.id) && message.member.voice.channelID !== message.client.player.getQueue(message.guild.id).connection.channel.id)) return message.reply("tu n'es pas dans le même salon vocal que moi").catch(console.error);

		const playlistRegex = /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com)).*(youtu.be\/|list=)([^#\&\?]*).*/;
		const search = args
			? args.join(" ")
			: options[0].value;
		if (playlistRegex.test(search)) return message.reply("les playlists ne sont pas supportées pour cette commande").catch(console.error);
		
		const res = await message.client.player.playskip(message.guild.id, message.member.voice.channel, search, null, message.author);
		if (!res.song) return message.reply(`je n'ai pas trouvé de musique avec ce titre`).catch(console.error);
		message.channel.send(`<a:blackCheck:803603780666523699> | **En train de jouer...**\n> ${res.song.name}`).catch(console.error);
	}
};

module.exports = command;