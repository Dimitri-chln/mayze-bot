import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField, User } from "discord.js";
import Util from "../../Util";

const command: CommandData = {
	name: "jail",
	aliases: [],
	userPermissions: new PermissionsBitField([PermissionFlagsBits.ModerateMembers]),
	botPermissions: new PermissionsBitField([PermissionFlagsBits.ManageRoles]),

	options: [
		{
			type: ApplicationCommandOptionType.User,
			name: "user",
			description: undefined,
			required: true,
		},
	],

	async run(input, args, localizations) {
		const user = args.get("user") as User;

		const member = input.guild.members.cache.get(user.id);
		const jailRole = input.guild.roles.cache.get(Util.guildConfigs.get(input.guild.id).jailRoleId);
		if (!jailRole) {
			await input.reply(localizations.no_jail_role.format(input.locale));
			return;
		}

		if (member.roles.highest.position >= input.member.roles.highest.position || input.guild.ownerId === member.id) {
			await input.reply(localizations.not_allowed.format(input.locale));
			return;
		}

		if (member.roles.cache.has(jailRole.id)) {
			const jailedRoles = member.roles.cache.filter((role) =>
				input.guild.roles.cache.some((r) => role.name === r.name + " (Jailed)"),
			);
			const unJailedRoles = input.guild.roles.cache.filter((role) =>
				member.roles.cache.some((r) => r.name === role.name + " (Jailed)"),
			);

			jailedRoles.set(jailRole.id, jailRole);

			await member.roles.add(unJailedRoles).catch(console.error);
			await member.roles.remove(jailedRoles).catch(console.error);

			await input.reply(localizations.freed.format(input.locale, user.tag));
		} else {
			const unJailedRoles = member.roles.cache.filter((role) =>
				input.guild.roles.cache.some((r) => r.name === role.name + " (Jailed)"),
			);
			const jailedRoles = input.guild.roles.cache.filter((role) =>
				member.roles.cache.some((r) => role.name === r.name + " (Jailed)"),
			);

			jailedRoles.set(jailRole.id, jailRole);

			await member.roles.remove(unJailedRoles).catch(console.error);
			await member.roles.add(jailedRoles).catch(console.error);

			await input.reply(localizations.in_jail.format(input.locale, user.tag));
		}
	},
};

export default command;
