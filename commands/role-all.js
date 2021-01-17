const { Message } = require("discord.js");

const command = {
	name: "role-all",
	description: "Donner ou retirer un rôle à tous les membres",
	aliases: ["ra"],
	cooldown: 30,
	args: 2,
	usage: "add/remove <rôle> [-bot | -human]",
	perms: ["MANAGE_ROLES"],
	slashOptions: [
		{
			name: "add",
			description: "Ajouter un rôle à tous les membres",
			type: 1,
			options: [
				{
					name: "rôle",
					description: "Le rôle à ajouter à tous les membres",
					type: 8,
					required: true
				},
				{
					name: "options",
					description: "Options pour ajouter le rôle",
					type: 3,
					required: false,
					choices: [
						{
							name: "Bots uniquement",
							value: "-bot"
						},
						{
							name: "Utilisateurs uniquement",
							value: "-human"
						}
					]
				}
			]
		},
		{
			name: "remove",
			description: "Retirer un rôle à tous les membres",
			type: 1,
			options: [
				{
					name: "rôle",
					description: "Le rôle à retirer à tous les membres",
					type: 8,
					required: true
				},
				{
					name: "options",
					description: "Options pour retirer le rôle",
					type: 3,
					required: false,
					choices: [
						{
							name: "Bots uniquement",
							value: "-bot"
						},
						{
							name: "Utilisateurs uniquement",
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
	execute: async (message, args, options) => {
		const userValidation = require("../modules/userValidation.js");
		const subCommand = args
			? args[0].toLowerCase()
			: options[0].name;
		const role = args
			? message.guild.roles.cache.get(args[1].toLowerCase()) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args[1].toLowerCase()) || message.guild.roles.cache.find(r => r.name.toLowerCase().includes(args[1].toLowerCase()))
			: message.guild.roles.cache.get(options[0].options[0].value);
		if (!role) return message.reply("ce rôle n'existe pas").catch(console.error);
		const params = args
			? args.slice(2)
			: (options[0].options[1] || { value: "" }).value.split(" ");

		let response = `Le rôle \`${role.name}\` sera`;
		if (subCommand === "add") response += " ajouté à";
		else if (subCommand.toLowerCase() === "remove") response += " retiré de";
		else return message.reply("le premier argument est incorrect").catch(console.error);

		if (params.includes("-bot")) response += " tous les bots.";
		else if (params.includes("-human")) response += " tous les utilisateurs.";
		else response += " tout les membres.";

		const msg = await message.channel.send(`${response} Veux-tu continuer?`).catch(console.error);
		const validation = await userValidation(message.author, msg);
		if (!validation) return message.channel.send("Procédure annulée").catch(console.error);

		let members = message.guild.members.cache;

		if (params.includes("-bot")) members = members.filter(m => m.user.bot);
		else if (params.includes("-human")) members = members.filter(m => !m.user.bot);

		let errors = 0;
		msg.edit(`Mise à jour de ${members.size} membre(s)...`).catch(console.error);

		switch (subCommand) {
			case "add":
				members = members.filter(m => !m.roles.cache.has(role.id));
				members.forEach(async member => {
					await member.roles.add(role).catch(err => {
						++errors;
						console.error(err);
					});
				});
				break;
			case "remove":
				members = members.filter(m => m.roles.cache.has(role.id));
				members.forEach(async member => {
					await member.roles.remove(role).catch(err => {
						++errors;
						console.error(err);
					});
				});
				break;
			default:
				message.reply("arguments incorrects").catch(console.error);
		}

		msg.edit(members.size - errors === 0 ? `Aucun membre n'a été mis à jour (${errors} erreur${errors > 1 ? "s" : ""})` : members.size - errors === 1 ? `1 membre a été mis à jour (${errors} erreur${errors > 1 ? "s" : ""})` : `${members.size - errors} membres ont été mis à jour (${errors} erreur${errors > 1 ? "s" : ""})`).catch(console.error);
	}
};

module.exports = command;