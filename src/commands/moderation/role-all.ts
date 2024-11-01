import { CommandData } from "../../structures/commands/Command";
import {
	ApplicationCommandOptionType,
	ComponentType,
	PermissionFlagsBits,
	PermissionsBitField,
	Role,
} from "discord.js";
import Util from "../../Util";
import confirmation from "../../utils/misc/confirmation";

const command: CommandData = {
	name: "role-all",
	aliases: ["roleall", "ra"],
	userPermissions: new PermissionsBitField([PermissionFlagsBits.ManageRoles]),
	botPermissions: new PermissionsBitField([PermissionFlagsBits.ManageRoles]),

	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "give",
			description: undefined,
			options: [
				{
					type: ApplicationCommandOptionType.Role,
					name: "role",
					description: undefined,
					required: true,
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "option",
					description: undefined,
					required: false,
					choices: [
						{
							name: undefined,
							value: "bots",
						},
						{
							name: undefined,
							value: "humans",
						},
					],
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "remove",
			description: undefined,
			options: [
				{
					type: ApplicationCommandOptionType.Role,
					name: "role",
					description: undefined,
					required: true,
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "option",
					description: undefined,
					required: false,
					choices: [
						{
							name: undefined,
							value: "bots",
						},
						{
							name: undefined,
							value: "humans",
						},
					],
				},
			],
		},
	],

	run: {
		give: async function (input, args, localizations) {
			const role = args.get("role") as Role;
			const option = args.get("option") as "bots" | "humans";

			let members = input.guild.members.cache.filter((m) => !m.roles.cache.has(role.id));
			if (option === "bots") members = members.filter((m) => m.user.bot);
			if (option === "humans") members = members.filter((m) => !m.user.bot);

			const confirmed = await confirmation(
				input,
				localizations.confirmation.format(input.locale, role.name, members.size.toString(), members.size > 1),
				localizations.updating.format(input.locale, members.size.toString(), members.size > 1),
				localizations.cancelled.format(input.locale),
			);

			if (confirmed) {
				let errors = 0;

				await Promise.all(
					members.map(async (member) => {
						await member.roles.add(role.id).catch((err) => {
							errors++;
							console.error(err);
						});
					}),
				);

				const updatedMembers = members.size - errors;

				input.editReply(
					localizations.updated.format(
						input.locale,
						updatedMembers === 0,
						updatedMembers === 1,
						updatedMembers > 1,
						updatedMembers.toString(),
						errors.toString(),
						errors > 1,
					),
				);
			}
		},

		remove: async function (input, args, localizations) {
			const role = args.get("role") as Role;
			const option = args.get("option") as "bots" | "humans";

			let members = input.guild.members.cache.filter((m) => m.roles.cache.has(role.id));
			if (option === "bots") members = members.filter((m) => m.user.bot);
			if (option === "humans") members = members.filter((m) => !m.user.bot);

			const confirmed = await confirmation(
				input,
				localizations.confirmation.format(input.locale, role.name, members.size.toString(), members.size > 1),
				localizations.updating.format(input.locale, members.size.toString(), members.size > 1),
				localizations.cancelled.format(input.locale),
			);

			if (confirmed) {
				let errors = 0;

				await Promise.all(
					members.map(async (member) => {
						await member.roles.remove(role.id).catch((err) => {
							errors++;
							console.error(err);
						});
					}),
				);

				const updatedMembers = members.size - errors;

				input.editReply(
					localizations.updated.format(
						input.locale,
						updatedMembers === 0,
						updatedMembers === 1,
						updatedMembers > 1,
						updatedMembers.toString(),
						errors.toString(),
						errors > 1,
					),
				);
			}
		},
	},
};

export default command;
