const { Message } = require("discord.js");

const command = {
	name: "kick-myself",
	description: {
		fr: "T'expulser du serveur sans aucune raison",
		en: "Kick you from the server for no reason"
	},
	aliases: ["kickmyself", "kms", "4-4-2"],
	args: 0,
	usage: "",
	slashOptions: null,
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const member = await message.member.kick(language.reason).catch(console.error);
		if (member) message.channel.send(language.get(language.kick_msg, message.author.username)).catch(console.error);
		else message.channel.send(language.error_kicking).catch(console.error);
	}
};

module.exports = command;