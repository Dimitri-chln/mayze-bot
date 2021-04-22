const { Message } = require("discord.js");

const command = {
	name: "jail",
	description: {
		fr: "Mettre un membre en prison ou le libérer",
		en: "Jail or unjail a member"
	},
	aliases: [],
	cooldown: 5,
	args: 1,
	usage: "<utilisateur>",
	perms: ["MANAGE_ROLES"],
	onlyInGuilds: ["689164798264606784"],
	slashOptions: [
		{
			name: "utilisateur",
			description: "La personne à mettre en prison ou à libérer",
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

		const user = args
			? message.mentions.users.first()
			: message.guild.members.cache.get(options[0].value).user;
		if (!user) return message.reply("mentionne la personne à mettre en prison ou à libérer").catch(console.error);
		const member = message.guild.members.cache.get(user.id);
		
		if (member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== OWNER_ID) 
			return message.reply("tu ne peux pas mettre cette personne en prison").catch(console.error);

		const jailedRole = "695943648235487263";

		if (!member.roles.cache.has(jailedRole)) {
			const unJailedRoles = member.roles.cache.filter(role => message.guild.roles.cache.some(r => r.name === role.name + " (Jailed)"));
			const jailedRoles = message.guild.roles.cache.filter(role => member.roles.cache.some(r => role.name === r.name + " (Jailed)"));

			await member.roles.remove(unJailedRoles).catch(console.error);
			await member.roles.add(jailedRole).catch(console.error);
			await member.roles.add(jailedRoles).catch(console.error);

			if (message.deletable) message.react("🔗").catch(console.error);
			return;

		} else {
			const jailedRoles = member.roles.cache.filter(role => message.guild.roles.cache.some(r => role.name === r.name + " (Jailed)"));
			const unJailedRoles = message.guild.roles.cache.filter(role => member.roles.cache.some(r => r.name === role.name + " (Jailed)"));
			
			await member.roles.remove(jailedRole).catch(console.error);
			await member.roles.remove(jailedRoles).catch(console.error);
			await member.roles.add(unJailedRoles).catch(console.error);

			if (message.deletable) message.react("👋").catch(console.error);
			return;
		}
	}
};

module.exports = command;