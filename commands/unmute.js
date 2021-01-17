const { Message } = require("discord.js");

const command = {
	name: "unmute",
	description: "Unmute une personne sur le serveur",
	aliases: [],
	args: 1,
	usage: "<mention/id>",
	onlyInGuilds: ["689164798264606784"],
	perms: ["MANAGE_ROLES"],
	slashOptions: [
		{
			name: "utilisateur",
			description: "La personne à unmute",
			type: 6,
			required: true
		}
	],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options) => {
		const { ownerID } = require("../config.json");
		const member = args
			? message.guild.members.cache.get((message.mentions.users.first() || {}).id)
			: message.guild.members.cache.get(options[0].value);
		const mutedRole = message.guild.roles.cache.get("695330946844721312");
		
		if (!member) return message.reply("mentionne une personne").catch(console.error);
		if (member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== ownerID)
			return message.reply("tu ne peux pas unmute cette personne").catch(console.error);

		member.roles.remove(mutedRole)
			.then(() => message.channel.send(`${member.user} a été unmute`).catch(console.error))
			.catch(err => {
				console.error(err);
				message.channel.send("Quelque chose s'est mal passé en unmutant cette personne :/").catch(console.error);
			});
	}
};

module.exports = command;