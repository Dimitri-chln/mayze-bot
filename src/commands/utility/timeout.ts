import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";

import dhms from "dhms";
import formatTime from "../../utils/misc/formatTime";
import { GuildMember } from "discord.js";



const command: Command = {
	name: "timeout",
	description: {
		fr: "Timeout un utilisateur sur le serveur",
		en: "Timeout a user on this server"
	},
	userPermissions: ["MODERATE_MEMBERS"],
	botPermissions: ["MODERATE_MEMBERS"],
	
	options: {
		fr: [
			{
				name: "user",
				description: "L'utilisateur à timeout",
				type: "USER",
				required: true
			},
			{
				name: "duration",
				description: "La durée du timeout",
				type: "STRING",
				required: false
			}
		],
		en: [
			{
				name: "user",
				description: "The user to timeout",
				type: "USER",
				required: true
			},
			{
				name: "duration",
				description: "The timeout's duration",
				type: "STRING",
				required: false
			}
		]
	},
	
	run: async (interaction, translations) => {
		const member = interaction.guild.members.cache.get(interaction.options.getUser("user").id);
		
		if (
			member.roles.highest.position >= (interaction.member as GuildMember).roles.highest.position
			&& interaction.user.id !== Util.owner.id
		)
			return interaction.reply({
				content: translations.data.not_allowed(),
				ephemeral: true
			});
		
		const duration: number = dhms(interaction.options.getString("duration"));

		await member.timeout(
			duration ?? 365 * 24 * 60 * 60 * 1000,
			translations.data.reason(interaction.user.tag)
		);

		interaction.reply(
			translations.data.timed_out(
				member.user.tag,
				Boolean(duration),
				formatTime(duration, translations.language)
			)
		);
	}
};



export default command;