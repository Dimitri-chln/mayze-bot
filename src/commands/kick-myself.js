const { Message } = require("discord.js");

const command = {
	name: "kick-myself",
	description: {
		fr: "T'expulse du serveur sans aucune raison",
		en: "Kicks you from the server for no reason"
	},
	aliases: ["kickmyself", "kms", "4-4-2", "442"],
	args: 0,
	usage: "",
	botPerms: ["KICK_MEMBERS"],
	category: "miscellaneous",
	newbiesAllowed: true,
	onlyInGuilds: ["689164798264606784", "724530039781326869"],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	run: async (message, args, options, language, languageCode) => {
		// Server booster
        if (message.member.premiumSince) return message.reply(language.boost).catch(console.error);

		if (message.member.roles.highest.position >= message.guild.me.roles.highest.position)
			return message.reply(language.too_high_hierarchy).catch(console.error);

		const member = await message.member.kick(language.reason).catch(console.error);

		if (member) message.channel.send(language.get(language.kick_msg, message.author.username)).catch(console.error);
		else message.channel.send(language.errors.kicking).catch(console.error);
	}
};

module.exports = command;