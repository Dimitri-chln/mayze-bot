import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";

import { GuildMember } from "discord.js";

const command: Command = {
	name: "jail",
	description: {
		fr: "Mettre un membre en prison ou le libérer",
		en: "Jail or unjail a member",
	},
	userPermissions: ["MANAGE_ROLES"],
	botPermissions: ["ADD_REACTIONS", "MANAGE_ROLES"],
	guildIds: [Util.config.MAIN_GUILD_ID],

	options: {
		fr: [
			{
				name: "user",
				description: "L'utilisateur à mettre en prison ou à libérer",
				type: "USER",
				required: true,
			},
		],
		en: [
			{
				name: "user",
				description: "The user to jail or unjail",
				type: "USER",
				required: true,
			},
		],
	},

	run: async (interaction, translations) => {
		const member = interaction.guild.members.cache.get(
			interaction.options.getUser("user").id,
		);

		if (
			member.roles.highest.position >=
				(interaction.member as GuildMember).roles.highest.position &&
			interaction.user.id !== Util.owner.id
		)
			return interaction.followUp({
				content: translations.data.not_allowed(),
				ephemeral: true,
			});

		const jailedRole =
			interaction.guild.roles.cache.get("695943648235487263");

		if (!member.roles.cache.has(jailedRole.id)) {
			const unJailedRoles = member.roles.cache.filter((role) =>
				interaction.guild.roles.cache.some(
					(r) => r.name === role.name + " (Jailed)",
				),
			);
			const jailedRoles = interaction.guild.roles.cache.filter((role) =>
				member.roles.cache.some(
					(r) => role.name === r.name + " (Jailed)",
				),
			);
			jailedRoles.set(jailedRole.id, jailedRole);

			await member.roles.remove(unJailedRoles).catch(console.error);
			await member.roles.add(jailedRoles).catch(console.error);

			return interaction.followUp(
				translations.data.jailed(member.user.tag),
			);
		} else {
			const jailedRoles = member.roles.cache.filter((role) =>
				interaction.guild.roles.cache.some(
					(r) => role.name === r.name + " (Jailed)",
				),
			);
			const unJailedRoles = interaction.guild.roles.cache.filter((role) =>
				member.roles.cache.some(
					(r) => r.name === role.name + " (Jailed)",
				),
			);
			jailedRoles.set(jailedRole.id, jailedRole);

			await member.roles.add(unJailedRoles).catch(console.error);
			await member.roles.remove(jailedRoles).catch(console.error);

			return interaction.followUp(
				translations.data.unjailed(member.user.tag),
			);
		}
	},
};

module.exports = command;
