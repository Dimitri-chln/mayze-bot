const { Message } = require("discord.js");

const command = {
	name: "unmute",
	description: "Unmute une personne sur le serveur",
	aliases: [],
	args: 1,
	usage: "<mention/id>",
	onlyInGuilds: ["689164798264606784"],
	perms: ["MANAGE_ROLES"],
	botPerms: ["MANAGE_ROLES"],
	category: "utility",
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
	execute: async (message, args, options, language, languageCode) => {
		const { OWNER_ID } = require("../config.json");

		const member = args
			? message.mentions.members.first() || message.guild.members.cache.get(args[0])
			: message.guild.members.cache.get(options[0].value);
		const mutedRole = message.guild.roles.cache.get("695330946844721312");
		
		if (!member) return message.reply("mentionne une personne").catch(console.error);
		if (member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== OWNER_ID)
			return message.reply("tu ne peux pas unmute cette personne").catch(console.error);

		try {
			const jailedRoles = member.roles.cache.filter(role => message.guild.roles.cache.some(r => r.permissions.has("ADMINISTRATOR") && role.name === r.name + " (Jailed)"));
			const unJailedRoles = message.guild.roles.cache.filter(role => role.permissions.has("ADMINISTRATOR") && member.roles.cache.some(r => r.name === role.name + " (Jailed)"));
			jailedRoles.set(mutedRole.id, mutedRole);

			await member.roles.add(unJailedRoles);
			await member.roles.remove(jailedRoles);

			message.channel.send(`${member.user} a été unmute`).catch(console.error);
		} catch (err) {
			console.error(err);
			message.channel.send("Quelque chose s'est mal passé en unmutant cette personne :/").catch(console.error);
		}
	}
};

module.exports = command;