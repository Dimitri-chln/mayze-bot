const { Message } = require("discord.js");

const command = {
	name: "nick",
	description: {
		fr: "Modifie ou réinitialise ton pseudo sur le serveur",
		en: "Change or reset your nickname on the server"
	},
	aliases: ["name", "rename"],
	args: 0,
	usage: "[<pseudo>]",
	perms: ["CHANGE_NICKNAME"],
	disableSlash: true,
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		if (message.deletable) message.delete().catch(console.error);
		const nickname = args
			? args.join(" ")
			: options[0].value;
		
		message.member.setNickname(nickname).catch(async err => {
			if (err.message === "Missing Permissions") {
				const msg = await message.reply(language.errors.no_perms).catch(console.error);
				msg.delete({ timeout: 4000 }).catch(console.error);
				return;
			}
			console.error(err);
		});
	}
};

module.exports = command;