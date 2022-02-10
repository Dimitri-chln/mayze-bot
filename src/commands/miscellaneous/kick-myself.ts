import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import { GuildMember } from "discord.js";

const command: Command = {
	name: "kick-myself",
	description: {
		fr: "T'expulse du serveur sans aucune raison",
		en: "Kicks you from the server for no reason",
	},
	userPermissions: [],
	botPermissions: ["KICK_MEMBERS"],
	guildIds: [Util.config.MAIN_GUILD_ID, "724530039781326869"],

	options: {
		fr: [],
		en: [],
	},

	run: async (interaction, translations) => {
		// Server booster
		if ((interaction.member as GuildMember).premiumSinceTimestamp)
			return interaction.followUp(translations.strings.boosting());

		if (
			(interaction.member as GuildMember).roles.highest.position >=
			interaction.guild.me.roles.highest.position
		)
			return interaction.followUp(translations.strings.too_high_hierarchy());

		(interaction.member as GuildMember)
			.kick(translations.strings.reason())
			.then(() => {
				interaction.followUp(
					translations.strings.kick_message(interaction.user.tag),
				);
			});
	},
};

export default command;
