const { Message } = require("discord.js");

const command = {
	name: "mute",
	description: "Mute une personne sur le serveur pendant un temps donné",
	aliases: [],
	args: 1,
	usage: "<mention> [durée]",
	onlyInGuilds: ["689164798264606784"],
	perms: ["MANAGE_ROLES"],
	slashOptions: [
		{
			name: "utilisateur",
			description: "La personne à mute",
			type: 6,
			required: true
		},
		{
			name: "durée",
			description: "La durée pendant laquelle mute la personne",
			type: 3,
			required: false
		}
	],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const { OWNER_ID } = require("../config.json");
		const dhms = require ("dhms");
		const timeToString = require("../utils/timeToString");
		
		const member = args
			? message.mentions.members.first() || message.guild.members.cache.get(args[0])
			: message.guild.members.cache.get(options[0].value);
		const mutedRole = message.guild.roles.cache.get("695330946844721312");
		
		if (!member) return message.reply("mentionne une personne").catch(console.error);
		if (member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== OWNER_ID)
			return message.reply("tu ne peux pas mute cette personne").catch(console.error);
		
		const duration = args
			? dhms(args.slice(1).join(" "))
			: dhms((options[1] || {}).value);

		try {
			const unJailedRoles = member.roles.cache.filter(role => role.permissions.has("ADMINISTRATOR") && message.guild.roles.cache.some(r => r.name === role.name + " (Jailed)"));
			const jailedRoles = message.guild.roles.cache.filter(role => member.roles.cache.some(r => r.permissions.has("ADMINISTRATOR") && role.name === r.name + " (Jailed)"));

			await member.roles.remove(unJailedRoles);
			await member.roles.add(mutedRole);
			await member.roles.add(jailedRoles);

			message.channel.send(`${member.user} a été mute ${duration ? `pendant ${timeToString(duration / 1000, languageCode)}` : "indéfiniment"}`).catch(console.error);
		} catch (err) {
			console.error(err);
			message.channel.send("Quelque chose s'est mal passé en mutant cette personne :/").catch(console.error);
		}

		if (duration) setTimeout(async () => {
			const jailedRoles = member.roles.cache.filter(role => message.guild.roles.cache.some(r => r.permissions.has("ADMINISTRATOR") && role.name === r.name + " (Jailed)"));
			const unJailedRoles = message.guild.roles.cache.filter(role => role.permissions.has("ADMINISTRATOR") && member.roles.cache.some(r => r.name === role.name + " (Jailed)"));
			
			await member.roles.add(unJailedRoles).catch(console.error);
			await member.roles.remove(mutedRole).catch(console.error);
			await member.roles.remove(jailedRoles).catch(console.error);
		}, duration);
	}
};

module.exports = command;