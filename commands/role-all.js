const { Message } = require("discord.js");

const command = {
	name: "role-all",
	description: {
		fr: "Donner ou retirer un rôle à tous les membres",
		en: "Give or remove a role to all members"
	},
	aliases: ["ra"],
	cooldown: 10,
	args: 2,
	usage: "add <role> [-bot|-human] | remove <role> [-bot|-human]",
	perms: ["MANAGE_ROLES"],
	slashOptions: [
		{
			name: "add",
			description: "Give a role to all members",
			type: 1,
			options: [
				{
					name: "role",
					description: "The role to give",
					type: 8,
					required: true
				},
				{
					name: "options",
					description: "Options for giving the role",
					type: 3,
					required: false,
					choices: [
						{
							name: "Only bots",
							value: "-bot"
						},
						{
							name: "Only human users",
							value: "-human"
						}
					]
				}
			]
		},
		{
			name: "remove",
			description: "Remove a role to all members",
			type: 1,
			options: [
				{
					name: "role",
					description: "The role to remove",
					type: 8,
					required: true
				},
				{
					name: "options",
					description: "Options for removing the role",
					type: 3,
					required: false,
					choices: [
						{
							name: "Only bots",
							value: "-bot"
						},
						{
							name: "Only human users",
							value: "-human"
						}
					]
				}
			]
		}
	],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const userValidation = require("../utils/userValidation");
		const subCommand = args
			? args[0].toLowerCase()
			: options[0].name;
		const role = args
			? message.guild.roles.cache.get(args[1].toLowerCase()) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args[1].toLowerCase()) || message.guild.roles.cache.find(r => r.name.toLowerCase().includes(args[1].toLowerCase()))
			: message.guild.roles.cache.get(options[0].options[0].value);
		if (!role) return message.reply(language.invalid_role).catch(console.error);
		const params = args
			? args.slice(2)
			: (options[0].options[1] || { value: "" }).value.split(" ");

		const msg = await message.channel.send(language.get(language.response, role.name, subCommand === "add", params.includes("-bot"), params.includes("-human"), !params.includes("-bot") && !params.includes("-human"))).catch(console.error);
		const validation = await userValidation(message.author, msg);
		if (!validation) return message.channel.send(language.cancelled).catch(console.error);

		let members = message.guild.members.cache;

		if (params.includes("-bot")) members = members.filter(m => m.user.bot);
		else if (params.includes("-human")) members = members.filter(m => !m.user.bot);

		let errors = 0;
		msg.edit(language.get(language.updating, members.size, member.size > 1)).catch(console.error);

		switch (subCommand) {
			case "add":
				members = members.filter(m => !m.roles.cache.has(role.id));
				await Promise.all(members.map(async member => {
					member.roles.add(role).catch(err => {
						++errors;
						console.error(err);
					});
				}));
				break;
			case "remove":
				members = members.filter(m => m.roles.cache.has(role.id));
				await Promise.all(members.map(async member => {
					member.roles.remove(role).catch(err => {
						++errors;
						console.error(err);
					});
				}));
				break;
			default:
				return message.reply(language.errors.invalid_args).catch(console.error);
		}

		msg.edit(members.size - errors === 0 ? `Aucun membre n'a été mis à jour (${errors} erreur${errors > 1 ? "s" : ""})` : members.size - errors === 1 ? `1 membre a été mis à jour (${errors} erreur${errors > 1 ? "s" : ""})` : `${members.size - errors} membres ont été mis à jour (${errors} erreur${errors > 1 ? "s" : ""})`).catch(console.error);
	}
};

module.exports = command;