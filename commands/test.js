const { Message } = require("discord.js");

const command = {
	name: "test",
	description: "testest",
	aliases: [],
	args: 0,
	usage: "",
	ownerOnly: true,
	/**
	 * 
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		const Axios = require("axios").default;
		const deezer = new (require("deezer-public-api"));

		Axios.get("https://deezer.page.link/AbSuoYsNz2LYo4Kq5")
			.then(res => console.log(res.data))
			.catch(console.error);
	}
};

module.exports = command;