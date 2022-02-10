import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import { GuildMember } from "discord.js";

const command: Command = {
	name: "kick",
	aliases: [],
	description: {
		fr: "Expulser un membre du serveur",
		en: "Kick a member from the server",
	},
	usage: "",
	userPermissions: ["KICK_MEMBERS"],
	botPermissions: ["KICK_MEMBERS"],
	guildIds: ["689164798264606784"],

	options: {
		fr: [
			{
				name: "user",
				description: "L'utilisateur à expulser",
				type: "USER",
				required: true,
			},
			{
				name: "reason",
				description: "La raison de l'expulsion",
				type: "STRING",
				required: false,
			},
		],
		en: [
			{
				name: "user",
				description: "The user to kick",
				type: "USER",
				required: true,
			},
			{
				name: "reason",
				description: "The reason of the kick",
				type: "STRING",
				required: false,
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const member = interaction.guild.members.cache.get(
			interaction.options.getUser("user").id,
		);

		const reason = interaction.options.getString("reason");

		if (
			member.roles.highest.position >=
				(interaction.member as GuildMember).roles.highest.position &&
			interaction.user.id !== Util.owner.id
		)
			return interaction.followUp(translations.strings.not_allowed());

		// Server booster
		if (member.premiumSinceTimestamp)
			return interaction.followUp(
				translations.strings.boosting(member.user.tag),
			);

		if (
			member.roles.highest.position >=
			interaction.guild.me.roles.highest.position
		)
			return interaction.followUp(
				translations.strings.too_high_hierarchy(member.user.tag),
			);

		member
			.kick(translations.strings.reason(interaction.user.tag, reason))
			.then((m) => {
				interaction.followUp(translations.strings.kicked(m.user.tag));
			});
	},
};

export default command;
