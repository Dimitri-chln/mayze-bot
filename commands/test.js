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
		const Minecraft = require("minecraft-server-ping");

		Minecraft.ping("Lap1BleuKuro.aternos.me")
			.then(console.log)
			.catch(console.error);
	}
};

module.exports = command;