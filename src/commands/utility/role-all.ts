import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import LanguageStrings from "../../types/structures/LanguageStrings";
import Util from "../../Util";



const command: Command = {
	name: "role-all",
	description: {
		fr: "Donner ou retirer un rôle à tous les membres",
		en: "Give or remove a role to all members"
	},
	cooldown: 10,
	
	userPermissions: ["MANAGE_ROLES"],
	botPermissions: ["MANAGE_ROLES"],
	
	options: {
		fr: [
			{
				name: "give",
				description: "Donner un rôle à tous les membres",
				type: "SUB_COMMAND",
				options: [
					{
						name: "role",
						description: "Le rôle à donner",
						type: "ROLE",
						required: true
					},
					{
						name: "option",
						description: "Options pour donner le rôle",
						type: "STRING",
						required: false,
						choices: [
							{
								name: "Bots uniquement",
								value: "bot"
							},
							{
								name: "Utilisateurs humains uniquement",
								value: "human"
							}
						]
					}
				]
			},
			{
				name: "remove",
				description: "Retirer un rôle de tous les membres",
				type: "SUB_COMMAND",
				options: [
					{
						name: "role",
						description: "Le rôle à retirer",
						type: "ROLE",
						required: true
					},
					{
						name: "option",
						description: "Options pour retirer le rôle",
						type: "STRING",
						required: false,
						choices: [
							{
								name: "Bots uniquement",
								value: "bot"
							},
							{
								name: "Utilisateurs humains uniquement",
								value: "human"
							}
						]
					}
				]
			}
		],
		en: [
			{
				name: "give",
				description: "Give a role to all members",
				type: "SUB_COMMAND",
				options: [
					{
						name: "role",
						description: "The role to give",
						type: "ROLE",
						required: true
					},
					{
						name: "option",
						description: "Options for giving the role",
						type: "STRING",
						required: false,
						choices: [
							{
								name: "Bots only",
								value: "bot"
							},
							{
								name: "Human users only",
								value: "human"
							}
						]
					}
				]
			},
			{
				name: "remove",
				description: "Remove a role from all members",
				type: "SUB_COMMAND",
				options: [
					{
						name: "role",
						description: "The role to remove",
						type: "ROLE",
						required: true
					},
					{
						name: "option",
						description: "Options for removing the role",
						type: "STRING",
						required: false,
						choices: [
							{
								name: "Bots only",
								value: "bot"
							},
							{
								name: "Human users only",
								value: "human"
							}
						]
					}
				]
			}
		]
	},
	
	run: async (interaction: CommandInteraction, languageStrings: LanguageStrings) => {
		const subCommand = interaction.options.getSubcommand();
		const role = interaction.options.getRole("role");
		const option: "bot" | "human" | "all" = interaction.options.getString("option") as "bot" | "human" ?? "all";

		let members = interaction.guild.members.cache;

		if (option === "bot") members = members.filter(m => m.user.bot);
		if (option === "human") members = members.filter(m => !m.user.bot);

		let errors = 0;
		
		interaction.reply(
			languageStrings.data.updating(
				members.size.toString(),
				members.size > 1
			)
		);

		switch (subCommand) {
			case "add":
				members = members.filter(m => !m.roles.cache.has(role.id));
				
				await Promise.all(members.map(async member => {
					await member.roles.add(role.id).catch(err => {
						++errors;
						console.error(err);
					});
				}));
				break;
			
			case "remove":
				members = members.filter(m => m.roles.cache.has(role.id));
				
				await Promise.all(members.map(async member => {
					await member.roles.remove(role.id).catch(err => {
						++errors;
						console.error(err);
					});
				}));
				break;
		}

		interaction.editReply(
			languageStrings.data.updated(
				members.size - errors === 0,
				members.size - errors === 1,
				members.size - errors > 1,
				(members.size - errors).toString(),
				errors.toString(),
				errors > 1
			)
		);
	}
};

module.exports = command;