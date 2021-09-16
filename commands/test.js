const { Message } = require("discord.js");

const command = {
	name: "test",
	description: "testest",
	aliases: [],
	args: 0,
	usage: "",
	ownerOnly: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		const Fs = require("fs");
		const ytdl = require("ytdl-core");

		const url = args[0];
		const info = await ytdl.getInfo(url);

		ytdl(url, {
			quality: "highestaudio",
			filter: "audioonly"
		})
			.on("data", chunk => {
				console.log(`Received ${chunk.length} bytes`);
			})
			.on("finish", () => {
				console.log("Download complete");
			})
			.pipe(Fs.createWriteStream(`./assets/downloads/${info.videoDetails.title}.mp3`));
	}
};

module.exports = command;