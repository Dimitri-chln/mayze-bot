const { Message } = require("discord.js");

const command = {
	name: "lyrics",
	description: "Obtenir les paroles de la musique actuelle",
	aliases: ["ly", "l"],
	args: 0,
	usage: "[musique]",
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options) => {
		const axios = require("axios").default;

		const isPlaying = message.client.player.isPlaying(message.guild.id);
		const songName = args
			? args.length ? args.join(" ") : (isPlaying ? (await message.client.player.nowPlayint(message.guild.id)).name : null)
			: options[0] ? options[0].value : (isPlaying ? (await message.client.player.nowPlayint(message.guild.id)).name : null);
		if (!songName) return message.reply("indique le nom de la chanson").catch(console.error);

		const apiURL = "https://api.genius.com";
		const res = await axios.get(`${apiURL}/lyrics/search?q=${songName.replace(/\s/g, "%20")}`, { headers: { Authorization: `Bearer ${process.env.GENIUS_API_KEY}` } }).catch(console.error);
		if (!res) return message.channel.send("Quelque chose s'est mal passé en accédant à l'API Genius").catch(console.error);
		console.log(res);
	}
};

module.exports = command;