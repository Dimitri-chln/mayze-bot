import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import dhms from "dhms";
import formatTime from "../../utils/misc/formatTime";
import { GuildMember } from "discord.js";

const command: Command = {
	name: "timeout",
	aliases: [],
	description: {
		fr: "Timeout un utilisateur sur le serveur",
		en: "Timeout a user on this server",
	},
	usage: "",
	userPermissions: ["MODERATE_MEMBERS"],
	botPermissions: ["MODERATE_MEMBERS"],

	options: {
		fr: [
			{
				name: "user",
				description: "L'utilisateur à timeout",
				type: "USER",
				required: true,
			},
			{
				name: "duration",
				description: "La durée du timeout",
				type: "STRING",
				required: true,
			},
		],
		en: [
			{
				name: "user",
				description: "The user to timeout",
				type: "USER",
				required: true,
			},
			{
				name: "duration",
				description: "The timeout's duration",
				type: "STRING",
				required: true,
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const member = interaction.guild.members.cache.get(
			interaction.options.getUser("user", true).id,
		);

		if (
			member.roles.highest.position >=
				(interaction.member as GuildMember).roles.highest.position &&
			interaction.user.id !== Util.owner.id
		)
			return interaction.followUp(translations.strings.not_allowed());

		const duration: number = Math.min(
			dhms(interaction.options.getString("duration", true)),
			28 * 24 * 60 * 60 * 1000, // 28 days
		);

		await member.timeout(
			duration,
			translations.strings.reason(interaction.user.tag),
		);

		interaction.followUp(
			translations.strings.timed_out(
				member.user.tag,
				formatTime(duration, translations.language),
			),
		);
	},
};

export default command;
